from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session  # Your CallLog model
from models import CallLog
app = APIRouter()

# Dependency to get session
async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session

@app.get("/call_logs")
async def get_call_logs(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(CallLog))
    calls = result.scalars().all()
    
    # Convert SQLAlchemy objects to dict
    call_list = [
        {
            "id": call.id,
            "call_sid": call.call_sid,
            "caller_number": call.caller_number,
            "receiver_number": call.receiver_number,
            "start_time": call.start_time.isoformat(),
            "end_time": call.end_time.isoformat(),
            "duration": call.duration,
            "status": call.status,
            "direction": call.direction,
            "call_type": call.call_type,
            "transcription": call.transcription,
            "intent": call.intent,
            "department": call.department,
            "audio_url": call.audio_url
        }
        for call in calls
    ]
    
    return {"data": call_list}
