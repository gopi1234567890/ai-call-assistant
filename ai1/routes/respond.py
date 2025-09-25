from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pathlib import Path
import json
import asyncio

JSON_FILE = Path("transcriptions.json")
file_lock = asyncio.Lock()  # Protects JSON_FILE from concurrent access

router = APIRouter()
@router.post("/respond")
async def respond(request: Request):
    # Support JSON or form payload
    try:
        data = await request.json()
    except:
        form = await request.form()
        data = dict(form)

    callid = data.get("CallSid")
    if not callid:
        return JSONResponse({"status": "error", "message": "CallSid missing"}, status_code=400)

    async with file_lock:
        if not JSON_FILE.exists():
            transcriptions = {}
        else:
            try:
                with open(JSON_FILE, "r") as f:
                    transcriptions = json.load(f)
            except json.JSONDecodeError:
                transcriptions = {}

        if callid in transcriptions:
            return JSONResponse(
                content={
                    "status": "success",
                    "intent": transcriptions[callid]["intent"],
                    "transcript": transcriptions[callid]["transcription"]
                },
                status_code=200
            )
        else:
            return JSONResponse(content={"status": "pending"}, status_code=200)
