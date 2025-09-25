from fastapi import APIRouter, Request
from pathlib import Path
import requests
import torch
import whisper
import os
import json
import asyncio
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()
# Environment variables
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
print("SID env:", TWILIO_ACCOUNT_SID)
print("TOKEN env set?:", bool(TWILIO_AUTH_TOKEN))


# JSON file & lock
JSON_FILE = Path("transcriptions.json")
file_lock = asyncio.Lock()

# Load Whisper model
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
model = whisper.load_model("medium", device=device)

# Simple keyword-based intent classifier
def classify_intent(text: str):
    keywords = {
        'billing': ['bill', 'invoice', 'payment', 'charge','money'],
        'technical': ['error', 'issue', 'problem', 'technical', 'help'],
        'sales': ['buy', 'purchase', 'order', 'pricing']
    }
    text = text.lower()
    for intent, words in keywords.items():
        if any(w in text for w in words):
            return intent
    return "unknown"

# Save transcription safely
async def save_transcription(transcript: str, intent: str, callid: str):
    async with file_lock:
        if JSON_FILE.exists():
            try:
                with open(JSON_FILE, "r") as f:
                    data = json.load(f)
            except json.JSONDecodeError:
                data = {}
        else:
            data = {}

        data[callid] = {"transcription": transcript, "intent": intent}

        with open(JSON_FILE, "w") as f:
            json.dump(data, f, indent=2)


@router.post("/transcribtion")
async def transcribition(request: Request):
    # Twilio sends form-encoded
    data = await request.form()

    callid = data.get("CallSid")
    callurl = data.get("RecordingUrl")
    status = data.get("RecordingStatus")

    print("Incoming webhook:", callid, callurl, status)

    if not callid or not callurl:
        return {"error": "CallSid or RecordingUrl missing"}

    if status != "completed":
        return {"status": f"Recording not complete yet (status={status})"}

    try:
        # Append extension
        callurl = f"{callurl}.mp3"

        recordings_dir = Path("recordings")
        recordings_dir.mkdir(exist_ok=True)
        filename = recordings_dir / f"{callid}.mp3"

        # Download recording
        response = requests.get(
            callurl,
            auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        )
        response.raise_for_status()

        with open(filename, "wb") as f:
            f.write(response.content)

        print(f"✅ Saved recording at {filename.resolve()}")

        # Transcribe
        result = model.transcribe(str(filename))
        transcript = result["text"]

        # Classify
        intent = classify_intent(transcript)

        # Save
        await save_transcription(transcript, intent, callid)

        return {"status": "success", "intent": intent, "transcript": transcript}

    except Exception as e:
        print( ' errors ', str(e))
        return {"error": str(e)}
