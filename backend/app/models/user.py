# app/models/user.py
from pydantic import BaseModel
try:
    from pydantic import EmailStr
except ImportError:
    # Fallback si email_validator no está instalado
    EmailStr = str

from typing import Optional
from enum import Enum
from datetime import datetime

class Role(str, Enum):
    USER = "USER"
    INSTRUCTOR = "INSTRUCTOR"
    ADMIN = "ADMIN"

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Role = Role.USER

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Config:
        from_attributes = True
