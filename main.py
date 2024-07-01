import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
import re

from prompt import generate_answer

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
local_url = os.getenv("LOCAL_URL")
prod_url = os.getenv("PROD_URL")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[local_url, prod_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="./front/build", html=True), name="build")


class Conversation(BaseModel):
    conversation: list
    agent: str


@app.get("/", response_class=FileResponse)
async def serve_react_app():
    index_file_path = "./front/build/index.html"
    return FileResponse(index_file_path)


@app.get("/result", response_class=FileResponse)
async def serve_react_app():
    index_file_path = "./front/build/index.html"
    return FileResponse(index_file_path)


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