import random
import string

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.models import User
from app.database.schemas import UserCreate


# ユーザ一覧
def list_users(db: Session):
    users = db.query(User).all()
    return users


# ユーザ作成
def create_user(db: Session, user: UserCreate):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    login_id = generate_login_id(db)
    db_user = User(name=user.name, email=user.email, role=user.role, login_id=login_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ログイン
def authenticate_user(db: Session, login_id: str):
    user = db.query(User).filter(User.login_id == login_id).first()
    if not user:
        return False
    return user


# ランダムかつユニークなログインIDを生成
def generate_login_id(db: Session, length: int = 15):
    letters = string.ascii_letters + string.digits
    while True:
        login_id = ''.join(random.choice(letters) for i in range(length))
        if not db.query(User).filter(User.login_id == login_id).first():
            return login_id
