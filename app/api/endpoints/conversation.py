from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import crud
from app.database.database import SessionLocal
from app.database.schemas import ConversationResponse, FileNames
from typing import List

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/list", response_model=List[ConversationResponse])
def list_conversations(db: Session = Depends(get_db)):
    return crud.list_conversations(db=db)


@router.post("/create")
def create_conversation(file_names: FileNames, db: Session = Depends(get_db)):
    for file_name in file_names.fileNames:
        crud.get_or_create_conversation(db, file_name)
    return {"message": "File names saved successfully"}
