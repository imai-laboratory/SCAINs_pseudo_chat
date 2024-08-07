from sqlalchemy.orm import Session

from app.database.models import Conversation
from app.database.schemas import ConversationCreate


# 対話一覧
def list_conversations(db: Session):
    conversations = db.query(Conversation).all()
    return conversations


# 対話登録
def create_conversation(db: Session, conversation: ConversationCreate):
    db_conversation = Conversation(name=conversation.name)
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation


# 対話自動登録
def get_or_create_conversation(db: Session, name: str):
    conversation = db.query(Conversation).filter_by(name=name).first()
    if not conversation:
        conversation_create = ConversationCreate(name=name)
        conversation = create_conversation(db, conversation_create)
    return conversation
