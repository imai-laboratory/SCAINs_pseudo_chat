from __future__ import annotations

from pydantic import BaseModel


class ConversationResponse(BaseModel):
    id: int
    name: str


class ConversationCreate(BaseModel):
    name: str


class FileNames(BaseModel):
    fileNames: list[str]
