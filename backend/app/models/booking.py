# app/models/booking.py
from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional

class BookingStatus(str, Enum):
    RESERVED = "RESERVED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"
    WAITLIST = "WAITLIST"

class BookingBase(BaseModel):
    schedule_id: str
    user_id: str
    status: BookingStatus = BookingStatus.RESERVED
    seat_no: Optional[int] = None

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: str
    created_at: datetime = datetime.now()

    class Config:
        from_attributes = True
