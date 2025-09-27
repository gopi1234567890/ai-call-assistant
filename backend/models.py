from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from database import Base  # your Base from models

class CallLog(Base):
    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True)
    call_sid = Column(String, nullable=False)
    caller_number = Column(String, nullable=False)
    receiver_number = Column(String, nullable=False)
    start_time = Column(TIMESTAMP, nullable=False)
    end_time = Column(TIMESTAMP, nullable=False)
    duration = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    direction = Column(String, nullable=False)
    call_type = Column(String, nullable=False)
    transcription = Column(Text)
    intent = Column(String)
    department = Column(String)
    audio_url = Column(String)
