from __future__ import annotations

from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    id: int
    name: str
    email: str
    role: int
    login_id: str


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: int


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: int
    login_id: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    login_id: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
