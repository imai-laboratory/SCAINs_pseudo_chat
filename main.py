import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import openai
import re

from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from database import crud
from database.auth import create_access_token
from database.models import User
from prompt import generate_answer
from core.config import get_settings
from database.database import SessionLocal, engine, Base
from database.schemas import UserCreate, UserResponse, Token, UserLogin

Base.metadata.create_all(bind=engine)

settings = get_settings()

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


@app.post("/user/create", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/login", response_model=Token)
def login_for_access_token(user: UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.name, user.email)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid name or email",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


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