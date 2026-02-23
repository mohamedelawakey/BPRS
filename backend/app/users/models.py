from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "user"
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    hashed_password: str
    interests: List[str] = []


class UserResponse(UserBase):
    id: str
    created_at: datetime
    interests: List[str] = []


class UserInterestsUpdate(BaseModel):
    interests: List[str]
