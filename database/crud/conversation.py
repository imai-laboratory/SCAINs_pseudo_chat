from sqlalchemy.orm import Session
from database.models import *
from database.schemas import ConversationCreate


# 対話登録
def create_conversation(db: Session, conversation: ConversationCreate):
    db_conversation = Conversation(name=conversation.name)
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation