from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import crud
from app.database.database import SessionLocal
from app.database.schemas import ChatMessageHistoryCreate, ChatMessageHistoryResponse
from typing import List

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 未使用
@router.post("/create", response_model=ChatMessageHistoryResponse)
def create_chat_message_history(chat_message_history: ChatMessageHistoryCreate, db: Session = Depends(get_db)):
    return crud.create_chat_message_history(db=db, chat_message_history=chat_message_history)


# まとめて対話履歴保存
@router.post("/batch-create")
def create_chat_message_history(chat_message_histories: List[ChatMessageHistoryCreate], db: Session = Depends(get_db)):
    try:
        return crud.batch_create_chat_message_history(db, chat_message_histories)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list", response_model=List[ChatMessageHistoryResponse])
def list_chat_message_histories(db: Session = Depends(get_db)):
    return crud.list_chat_message_histories(db=db)
