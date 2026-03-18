# AI Friend Backend

Бэкенд для AI Friend приложения на FastAPI + GROQ AI.

## 🚀 Быстрый старт

### 1. Создание виртуального окружения

```bash
cd ai_friend_backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 3. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```env
GROQ_API_KEY=your_api_key_here
JWT_SECRET_KEY=your_secret_key
```

### 4. Запуск сервера

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Проверка работы

Откройте в браузере:
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 📁 Структура проекта

```
ai_friend_backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Точка входа FastAPI
│   ├── config.py            # Конфигурация
│   ├── database.py          # Подключение к БД
│   ├── models/              # SQLAlchemy модели
│   ├── schemas/             # Pydantic схемы
│   ├── routes/              # API эндпоинты
│   ├── services/            # Бизнес-логика
│   └── utils/               # Утилиты
├── tests/                   # Тесты
├── .env                     # Переменные окружения
├── .env.example             # Шаблон env
├── requirements.txt         # Зависимости
├── Dockerfile               # Docker образ
└── README.md                # Документация
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход (получение токена)
- `GET /api/auth/me` - Текущий пользователь

### Chat
- `POST /api/chat/send` - Отправить сообщение
- `GET /api/chat/history/{friend_id}` - История чата

### Friends
- `GET /api/friends/` - Список друзей
- `POST /api/friends/` - Создать друга
- `GET /api/friends/{friend_id}` - Получить друга
- `PUT /api/friends/{friend_id}` - Обновить друга
- `DELETE /api/friends/{friend_id}` - Удалить друга

## 🧪 Тестирование

```bash
pytest
```

## 📦 Docker

```bash
docker build -t ai_friend_backend .
docker run -p 8000:8000 --env-file .env ai_friend_backend
```
