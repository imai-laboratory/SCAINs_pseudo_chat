from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import SessionLocal
from app.prompt import generate_answer
from app.tasks import fetch_openai_data

router = APIRouter()


# schemasではあるが、少し特殊なためこのファイルで明示
class Conversation(BaseModel):
    conversation: list
    agent: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/api/generate-response")
async def generate_response(request: Conversation):
    try:
        prompt = generate_answer(request.conversation, request.agent)
        task = fetch_openai_data.delay(prompt)
        return {"task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/generate-response/result/{task_id}")
async def get_generate_response_result(task_id: str):
    task = fetch_openai_data.AsyncResult(task_id)
    if task.state == 'PENDING':
        return {"state": task.state, "result": None}
    elif task.state != 'FAILURE':
        return {"state": task.state, "result": task.result}
    else:
        return {"state": task.state, "result": str(task.info)}
