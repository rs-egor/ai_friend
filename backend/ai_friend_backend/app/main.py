import sys
import os

# Добавляем backend в PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.abspath(os.path.join(current_dir, '..'))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, get_db
from app.routes import auth, chat, friends

# Создание таблиц БД
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(title=settings.APP_NAME)

# CORS - разрешаем все localhost порты для разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роуты
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(friends.router, prefix="/api/friends", tags=["Friends"])


@app.on_event("startup")
async def on_startup():
    """Инициализация БД при запуске"""
    await init_db()


@app.get("/")
async def root():
    return {"message": "AI Friend API is running", "docs": "/docs"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
