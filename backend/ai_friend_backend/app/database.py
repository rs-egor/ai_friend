import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings

logger = logging.getLogger(__name__)

# Настройка движка для SQLite
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False},
    )
    logger.info("Using SQLite database")
else:
    # Для PostgreSQL используем asyncpg
    # Если DATABASE_URL начинается с postgresql://, заменяем на postgresql+asyncpg://
    database_url = settings.DATABASE_URL
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    logger.info(f"Connecting to PostgreSQL: {database_url[:30]}...")
    
    try:
        engine = create_async_engine(
            database_url,
            echo=settings.DEBUG,
            pool_pre_ping=True,  # Проверка подключения перед использованием
            pool_size=10,
            max_overflow=20,
        )
        logger.info("PostgreSQL engine created successfully")
    except Exception as e:
        logger.error(f"Failed to create PostgreSQL engine: {e}")
        raise

# Сессия для работы с БД
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Базовый класс для моделей
Base = declarative_base()


async def get_db() -> AsyncSession:
    """Зависимость для получения сессии БД"""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
