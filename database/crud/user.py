from sqlalchemy.orm import Session
from database.models import *
from database.schemas import UserCreate


# ユーザ作成
def create_user(db: Session, user: UserCreate):
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ログイン
def authenticate_user(db: Session, name: str, email: str):
    user = db.query(User).filter(User.email == email, User.name == name).first()
    if not user:
        return False
    return user
