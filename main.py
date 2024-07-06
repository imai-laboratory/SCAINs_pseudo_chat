import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import openai
import re

from prompt import generate_answer
from core.config import get_settings
from database.database import SessionLocal, engine, Base

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


if __name__ == '__main__':
    uvicorn.run("run:app", port=8000, reload=True)