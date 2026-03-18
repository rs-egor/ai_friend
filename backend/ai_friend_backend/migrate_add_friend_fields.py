"""
Скрипт миграции: добавляет новые поля в таблицу friends
- gender
- age
- interests
- scenario
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'ai_friend.db')

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Проверяем, существуют ли уже колонки
    cursor.execute("PRAGMA table_info(friends)")
    columns = [col[1] for col in cursor.fetchall()]

    # Добавляем новые колонки, если их нет
    if 'gender' not in columns:
        cursor.execute("ALTER TABLE friends ADD COLUMN gender TEXT DEFAULT 'neutral'")
        print("Добавлена колонка: gender")

    if 'age' not in columns:
        cursor.execute("ALTER TABLE friends ADD COLUMN age TEXT DEFAULT 'adult'")
        print("Добавлена колонка: age")

    if 'interests' not in columns:
        cursor.execute("ALTER TABLE friends ADD COLUMN interests TEXT DEFAULT '[]'")
        print("Добавлена колонка: interests")

    if 'scenario' not in columns:
        cursor.execute("ALTER TABLE friends ADD COLUMN scenario TEXT DEFAULT 'casual'")
        print("Добавлена колонка: scenario")

    conn.commit()
    conn.close()
    print("Миграция успешно завершена!")

if __name__ == "__main__":
    migrate()
