from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Conversation(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    chat_message_history = relationship("ChatMessageHistory", back_populates="conversation")
