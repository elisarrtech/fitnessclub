# app/models/class.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClassBase(BaseModel):
    title: str
    modality: str  # presencial | online
    level: str     # básico | intermedio | avanzado
    duration_min: int
    base_price: int  # en centavos
    capacity: int

class ClassCreate(ClassBase):
    instructor_id: str

class Class(ClassBase):
    id: str
    instructor_id: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Config:
        from_attributes = True
