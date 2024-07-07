from sqlalchemy.orm import Session
from database.models import *
from database.schemas import ChatMessageHistoryCreate


# 対話履歴保存
def create_chat_message_history(db: Session, chat_message_history: ChatMessageHistoryCreate):
    db_chat_message_history = ChatMessageHistory(
        conversation_id=chat_message_history.conversation_id,
        user_id=chat_message_history.user_id,
        message_number=chat_message_history.message_number,
        content=chat_message_history.content
    )
    db.add(db_chat_message_history)
    db.commit()
    db.refresh(db_chat_message_history)
    return db_chat_message_history
