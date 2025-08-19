from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None
    role: str = "USER"
