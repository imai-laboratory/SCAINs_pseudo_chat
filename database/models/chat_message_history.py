from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from datetime import datetime
from database import Base


class ChatMessageHistory(Base):
    __tablename__ = 'chat_message_history'

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    message_number = Column(Integer)
    content = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    conversation = relationship("Conversation", back_populates="chat_message_history")
    user = relationship("User", back_populates="chat_message_history")
