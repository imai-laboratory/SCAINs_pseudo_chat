from datetime import timedelta
from typing import List

import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request, status, Form
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
import openai
import re

from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from database import crud
from database.auth import create_access_token, verify_token
from database.crud import authenticate_user
from database.models import *
from prompt import generate_answer
from core.config import get_settings
from database.database import SessionLocal, engine, Base
from database.schemas import *

Base.metadata.create_all(bind=engine)

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.local_url, settings.prod_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="./front/build/static"), name="static")


class Conversation(BaseModel):
    conversation: list
    agent: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/user/list", response_model=List[UserBase])
def list_users(db: Session = Depends(get_db)):
    return crud.list_users(db=db)


@app.post("/user/create", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user)


@app.post("/login", response_model=LoginResponse)
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


@app.get("/user/me", response_model=UserResponse)
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


@app.get("/conversation/list", response_model=List[ConversationResponse])
def list_conversations(db: Session = Depends(get_db)):
    return crud.list_conversations(db=db)


@app.post("/conversation/create")
def create_conversation(file_names: FileNames, db: Session = Depends(get_db)):
    for file_name in file_names.fileNames:
        crud.get_or_create_conversation(db, file_name)
    return {"message": "File names saved successfully"}


@app.post("/chat-message-history/create", response_model=ChatMessageHistoryResponse)
def create_chat_message_history(chat_message_history: ChatMessageHistoryCreate, db: Session = Depends(get_db)):
    return crud.create_chat_message_history(db=db, chat_message_history=chat_message_history)


@app.post("/api/generate-response")
async def generate_response(request: Conversation):
    try:
        prompt = generate_answer(request.conversation, request.agent)

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0,
            stop=["\n"],
        )
        content = response['choices'][0]['message']['content']
        # 「B: 」などを除く
        cleaned_content = re.sub(r'^.*?: ', '', content)
        return {"response": cleaned_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"loc": e["loc"], "msg": e["msg"], "type": e["type"]} for e in exc.errors()]
    return JSONResponse(
        status_code=422,
        content={"detail": errors},
    )

if __name__ == '__main__':
    uvicorn.run("run:app", port=8000, reload=True)