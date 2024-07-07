from __future__ import annotations

from pydantic import BaseModel


class ConversationCreate(BaseModel):
    name: str


class ConversationResponse(BaseModel):
    id: int
    name: str
