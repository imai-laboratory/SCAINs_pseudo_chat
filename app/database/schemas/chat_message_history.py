from __future__ import annotations

from typing import List

from pydantic import BaseModel
from datetime import datetime


class ContentItem(BaseModel):
    index: int
    content: str
    person: str
    role: str


class ChatMessageHistoryCreate(BaseModel):
    conversation_id: int
    user_id: int
    message_number: int
    content: List[ContentItem]


class ChatMessageHistoryResponse(BaseModel):
    id: int
    conversation_id: int
    user_id: int
    message_number: int
    content: List[ContentItem]
    created_at: datetime
