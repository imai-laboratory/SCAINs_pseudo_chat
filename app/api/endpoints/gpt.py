from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import SessionLocal
from app.prompt import *
from app.tasks import *

router = APIRouter()


# schemasではあるが、少し特殊なためこのファイルで明示
class Conversation(BaseModel):
    conversation: list
    agent: str


class ImageChatPayload(BaseModel):
    chat_history: list
    image_name: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
async def generate_response(request: Conversation):
    try:
        prompt = generate_answer(request.conversation, request.agent)
        task = fetch_openai_data.delay(prompt)
        return {"task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/result/{task_id}")
async def get_generate_response_result(task_id: str):
    task = fetch_openai_data.AsyncResult(task_id)
    if task.state == 'PENDING':
        return {"state": task.state, "result": None}
    elif task.state != 'FAILURE':
        return {"state": task.state, "result": task.result}
    else:
        return {"state": task.state, "result": str(task.info)}


@router.post("/image-task")
async def generate_response_with_image(payload: ImageChatPayload):
    try:
        chat_history = payload.chat_history
        image_name = payload.image_name
        prompt = topic11(chat_history)
        task = fetch_openai_data_with_image.apply_async(args=[image_name, prompt])
        return {"task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/image-task/result/{task_id}")
async def get_generate_response_result_with_image(task_id: str):
    task = fetch_openai_data_with_image.AsyncResult(task_id)
    if task.state == 'PENDING':
        return {"state": task.state, "result": None}
    elif task.state == 'FAILURE':
        raise HTTPException(status_code=500, detail=str(task.info))
    else:
        return {"state": task.state, "result": task.result}


@router.post("/check-scains")
async def check_scains():
    return [1, 3]
