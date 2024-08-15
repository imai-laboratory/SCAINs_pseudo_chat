from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import SessionLocal
from app.utils.prompt import *
from app.tasks import *
import app.scains_algorism.scains_core as scains_core

router = APIRouter()
params = DefaultParams()


# schemasではあるが、少し特殊なためこのファイルで明示
class Conversation(BaseModel):
    conversation: list
    agent: str


class ImageChatPayload(BaseModel):
    chat_history: list
    image_name: str
    is_scains: bool
    person: str


class Dialogue(BaseModel):
    person: str
    content: str


class CheckScainsRequest(BaseModel):
    conversation: list[Dialogue]
    sessionId: str


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
        if payload.is_scains:
            prompt = topic11_to_b(chat_history)
            print(f"prompt: {prompt}")
        else:
            prompt = topic11(chat_history, payload.person)
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
async def check_scains(request: CheckScainsRequest):
    """
    コア発言の行数と、SCAINSの行数を返す
    SCAINSが存在しなかったら何も返さない
    :param request:
    :return:
    {
        "core_index": 6,
        "scains_index": [2, 3, 4]
    }
    """
    if len(request.conversation) >= params.RELATIVE_POSITION + 2:
        joined_dialogue = [f"{entry.person}: {entry.content}" for entry in request.conversation]
        SCAINExtractor = scains_core.SCAINExtractor(joined_dialogue, request.sessionId)
        return SCAINExtractor.distance_extract()
    return
