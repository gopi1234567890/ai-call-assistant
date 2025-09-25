from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CallLogBase(BaseModel):
    call_sid: str
    phone_number: str
    transcript: Optional[str] = None
    intent: Optional[str] = None
    department: Optional[str] = None
    created_at: datetime = datetime.utcnow()

class CallLogCreate(CallLogBase):
    pass

class CallLogResponse(CallLogBase):
    id: int

    class Config:
        orm_mode = True
