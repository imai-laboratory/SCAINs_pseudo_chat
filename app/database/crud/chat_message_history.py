from typing import List

from sqlalchemy.orm import Session

from app.database.models import ChatMessageHistory
from app.database.schemas import ChatMessageHistoryCreate


# 対話履歴一覧
def list_chat_message_histories(db: Session):
    chatMessageHistories = db.query(ChatMessageHistory).all()
    return chatMessageHistories


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


def batch_create_chat_message_history(db: Session, chat_message_histories: List[ChatMessageHistoryCreate]):
    created_histories = []
    for chat_message_history in chat_message_histories:
        db_chat_message_history = ChatMessageHistory(
            conversation_id=chat_message_history.conversation_id,
            user_id=chat_message_history.user_id,
            message_number=chat_message_history.message_number,
            content=[item.dict() for item in chat_message_history.content]
        )

        db.add(db_chat_message_history)
        db.commit()
        db.refresh(db_chat_message_history)
        created_histories.append(db_chat_message_history)
    return created_histories
