import uvicorn
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles

from app.database.database import engine, Base
from app.core.config import get_settings
from app.api.endpoints import router as api_router

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

app.include_router(api_router)

app.mount("/static", StaticFiles(directory="./front/build/static"), name="static")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"loc": e["loc"], "msg": e["msg"], "type": e["type"]} for e in exc.errors()]
    return JSONResponse(
        status_code=422,
        content={"detail": errors},
    )

if __name__ == '__main__':
    uvicorn.run("run:app", port=8000, reload=True)