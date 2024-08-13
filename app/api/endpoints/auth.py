from datetime import timedelta

from fastapi import HTTPException, Depends, status, Form, APIRouter
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import crud
from app.auth import create_access_token, verify_token
from app.database.crud import authenticate_user
from app.core.config import get_settings
from app.database.database import SessionLocal
from app.database.schemas import LoginResponse, UserResponse

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login", response_model=LoginResponse)
def login_for_access_token(login_id: str = Form(...), db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, login_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid login_id",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.login_id}, expires_delta=access_token_expires
    )
    user_response = UserResponse.from_orm(db_user)
    return {"access_token": access_token, "token_type": "bearer", "user": user_response}


@router.get("/user/me", response_model=UserResponse)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    user = authenticate_user(db, login_id=token_data.login_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
