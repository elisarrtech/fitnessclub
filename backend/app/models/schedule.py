# app/models/schedule.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScheduleBase(BaseModel):
    class_id: str
    instructor_id: Optional[str] = None
    start_ts: datetime
    end_ts: datetime
    room: Optional[str] = None

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: str
    created_at: datetime = datetime.now()

    class Config:
        from_attributes = True
