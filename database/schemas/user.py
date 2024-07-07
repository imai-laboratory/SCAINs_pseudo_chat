from __future__ import annotations

from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: EmailStr | None = None


class UserLogin(BaseModel):
    name: str
    email: EmailStr


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
