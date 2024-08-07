from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, unique=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(Integer, index=True, nullable=False)
    login_id = Column(String, index=True, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    chat_message_history = relationship("ChatMessageHistory", back_populates="user")
