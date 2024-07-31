from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import crud
from app.database.database import SessionLocal
from app.database.schemas import UserCreate, UserResponse, UserBase

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/list", response_model=List[UserBase])
def list_users(db: Session = Depends(get_db)):
    return crud.list_users(db=db)


@router.post("/create", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)
