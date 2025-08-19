from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class Role(str, Enum):
    USER = "USER"
    INSTRUCTOR = "INSTRUCTOR"
    ADMIN = "ADMIN"

class User(BaseModel):
    id: Optional[str] = None
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Role = Role.USER
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
