from fastapi import APIRouter
from app.api.endpoints import auth, user, conversation, chat, gpt

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(user.router, prefix="/user", tags=["user"])
router.include_router(conversation.router, prefix="/conversation", tags=["conversation"])
router.include_router(chat.router, prefix="/chat-message-history", tags=["chat"])
router.include_router(gpt.router, prefix="/api/generate-response",  tags=["gpt"])
