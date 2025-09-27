import asyncio
import os
import wave
import numpy as np
import base64
import struct

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
#from services.transcriber import transcribe_audio
from pydantic import BaseModel

class StreamResponse(BaseModel):
    transcript: str
    intent: str
    route: str



router = APIRouter()

# Audio settings
sample_rate = 8000
channels = 1
sample_width = 2

# μ-law decode table
ulaw_decode_table = np.array([
    ((i ^ 0xFF) << 3) + 132 for i in range(256)
], dtype=np.int16)

def decode(mulaw_bytes: bytes) -> bytes:
    decoded = ulaw_decode_table[np.frombuffer(mulaw_bytes, dtype=np.uint8)]
    return decoded.astype('<i2').tobytes()

def write(frames: list[bytes], path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))


@router.websocket('/stream')
async def stream_audio(websocket: WebSocket):
    await websocket.accept()
    print('[WebSocket] Connection accepted.')

    audio_frames = []
    Call_Sid = None

    try:
        while True:
            message = await websocket.receive_json()
            event = message.get('event')

            if event == 'start':
                # Twilio sends the CallSid inside 'start' event message
                Call_Sid = message.get('start', {}).get('callSid', 'unknown')
                print(f'[WebSocket] Start event received. CallSid: {Call_Sid}')
                continue

            elif event == 'media':
                payload = message['media']['payload']
                mulaw_audio = base64.b64decode(payload)
                pcm_audio = decode(mulaw_audio)
                audio_frames.append(pcm_audio)

            elif event == 'stop':
                print('[WebSocket] Stop event received.')
                output_path = f'audio/{Call_Sid}.wav' if Call_Sid else 'audio/unknown.wav'
                write(audio_frames, output_path)
                print('[WebSocket] Audio saved to', output_path)
                  # run whisper here
                import threading
                from services.transcriber import transcribe_audio
                threading.Thread(target=transcribe_audio, args=(Call_Sid, output_path)).start()
            
                
                await websocket.close()
                break

    except WebSocketDisconnect:
        print('[WebSocket] Client disconnected.')

    except Exception as e:
        print(f'[WebSocket] Error: {e}')
        await websocket.close() 
