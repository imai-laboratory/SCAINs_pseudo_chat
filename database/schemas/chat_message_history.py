from __future__ import annotations

from pydantic import BaseModel
from datetime import datetime


class ChatMessageHistoryCreate(BaseModel):
    conversation_id: int
    user_id: int
    message_number: int
    content: dict
    created_at: datetime


class ChatMessageHistoryResponse(BaseModel):
    id: int
    conversation_id: int
    user_id: int
    message_number: int
    content: dict
    created_at: datetime
