# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements
COPY ai_friend_backend/requirements.txt .

# Установка Python зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода приложения
COPY ai_friend_backend/ ./ai_friend_backend/
COPY personality.py .

# Создание директории для данных
RUN mkdir -p /app/ai_friend_backend/data

# Переменная окружения для Python
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Порт приложения
EXPOSE 8000

# Запуск приложения
CMD ["uvicorn", "ai_friend_backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
