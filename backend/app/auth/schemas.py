from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class UserSessionBase(BaseModel):
    user_id: UUID | str
    refresh_jti: str
    is_revoked: bool = False
    expires_at: datetime
    device_info: Optional[str] = None


class UserSessionCreate(UserSessionBase):
    pass


class UserSession(UserSessionBase):
    id: UUID | str
    created_at: datetime


class RefreshTokenRequest(BaseModel):
    refresh_token: str
