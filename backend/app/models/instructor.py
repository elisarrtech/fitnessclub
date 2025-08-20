# app/models/instructor.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InstructorBase(BaseModel):
    name: str
    email: Optional[str] = None
    bio: Optional[str] = None
    rating: Optional[float] = None

class InstructorCreate(InstructorBase):
    user_id: str

class Instructor(InstructorBase):
    id: str
    user_id: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Config:
        from_attributes = True
