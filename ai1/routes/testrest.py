from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from pathlib import Path
import whisper
import torch
import uuid

router = APIRouter()

# Load Whisper model on GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("medium", device=device)

# Directory to save uploaded audio
SAVE_DIR = Path("rest_api_call_recording")
SAVE_DIR.mkdir(exist_ok=True)

# Simple intent classifier
def classify_intent(transcription: str) -> str:
    transcription = transcription.lower()
    if any(word in transcription for word in ["order", "purchase", "buy"]):
        return "sales"
    elif any(word in transcription for word in ["error", "issue", "problem", "help"]):
        return "technical"
    elif any(word in transcription for word in ["billing", "invoice", "payment"]):
        return "billing"
    else:
        return "unknown"

@router.post("/testaudio")
async def test(file: UploadFile = File(...)):
    file_ext = Path(file.filename).suffix
    audio_id = str(uuid.uuid4())
    save_path = SAVE_DIR / f"{audio_id}{file_ext}"
    
    with open(save_path, "wb") as f:
        f.write(await file.read())

    # Transcribe using Whisper on GPU
    result = model.transcribe(str(save_path))
    transcription = result.get("text", "")

    intent = classify_intent(transcription)

    return JSONResponse({
        "audio_file": str(save_path),
        "transcription": transcription,
        "intent": intent
    })
