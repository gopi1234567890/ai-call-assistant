import os
import json
import asyncio
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session, engine, Base  # for database connection
from models import CallLog 


# --- Windows-safe asyncio ---
import sys
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# --- Function to insert sample calls from JSON ---
async def insert_sample_calls():
    # Read JSON file
    with open("temp.json", "r", encoding="utf-8") as f:
        data = json.load(f)

   
    async with async_session() as session:
        async with session.begin():
            for call_sid, info in data.items():  # key is call_sid, value is dict
                call = CallLog(
                    call_sid=call_sid,
                    caller_number=info.get("caller_number"),
                    receiver_number=info.get("receiver_number"),
                    start_time=datetime.fromisoformat(info.get("start_time")),
                    end_time=datetime.fromisoformat(info.get("end_time")),
                    duration=info.get("duration"),
                    status=info.get("status"),
                    direction=info.get("direction"),
                    call_type=info.get("call_type"),
                    transcription=info.get("transcription"),
                    intent=info.get("intent"),
                    department=info.get("department"),
                    audio_url=info.get("audio_url")
                )
                session.add(call)
        await session.commit()

    print("All entries inserted successfully!")

# --- Main entry point ---
if __name__ == "__main__":
    # Create tables if not exist
    async def main():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database tables ready!")
        await insert_sample_calls()

    asyncio.run(main())
