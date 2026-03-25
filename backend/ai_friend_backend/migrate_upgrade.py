#!/usr/bin/env python3
"""
Скрипт для миграции базы данных.
Добавляет новые колонки и таблицы для системы подписки.

Использование:
    python migrate_upgrade.py
"""

import asyncio
import sys
import os

# Добавляем backend в PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.abspath(current_dir)
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from sqlalchemy import text
from app.database import engine


async def migrate():
    """Выполнение миграции"""
    print("🔄 Подключение к базе данных...")
    
    async with engine.begin() as conn:
        # 1. Добавляем колонку messages_count в таблицу users
        print("📦 Добавление колонки messages_count в таблицу users...")
        try:
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN messages_count INTEGER DEFAULT 0"
            ))
            print("✅ Колонка messages_count добавлена")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("ℹ️  Колонка messages_count уже существует")
            else:
                raise
        
        # 2. Создаём таблицу subscriptions (если не существует)
        print("📦 Создание таблицы subscriptions...")
        await conn.execute(text("""
            CREATE TABLE IF NOT EXISTS subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE,
                is_premium BOOLEAN DEFAULT FALSE,
                plan_type VARCHAR(50) DEFAULT 'monthly',
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                payment_provider VARCHAR(50),
                subscription_id VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """))
        print("✅ Таблица subscriptions создана")
        
        # 3. Создаём все остальные таблицы (для новых инсталляций)
        print("📦 Создание остальных таблиц...")
        from app.database import Base
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Таблицы созданы")
    
    print("✅ Миграция успешно выполнена!")


if __name__ == "__main__":
    try:
        asyncio.run(migrate())
    except Exception as e:
        print(f"❌ Ошибка выполнения миграции: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
