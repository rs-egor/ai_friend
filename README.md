# 🚀 AI Friend

**AI Friend** — это приложение для создания персонализированных AI-друзей с долговременной памятью.

## 📋 Оглавление

- [Возможности](#-возможности)
- [Структура проекта](#-структура-проекта)
- [Быстрый старт](#-быстрый-старт)
- [Разработка](#-разработка)
- [Docker](#-docker)
- [API Документация](#-api-документация)
- [Технологии](#-технологии)

## ✨ Возможности

- 🎭 **6 пресетов личности**: Друг, Помощник, Наставник, Спутник, Репетитор, Творец
- 👤 **Настройка профиля**: Пол, возраст, интересы, сценарий общения
- 🧠 **Долговременная память**: AI запоминает факты о пользователе
- 💬 **Естественное общение**: Поддержка контекста диалога
- 🔒 **Безопасность**: JWT аутентификация

## 📁 Структура проекта

```
ai_friend_1.0.1/
├── frontend/                 # React + Vite приложение
│   ├── src/
│   │   ├── components/      # UI компоненты
│   │   ├── pages/           # Страницы приложения
│   │   ├── hooks/           # React хуки
│   │   ├── services/        # API сервисы
│   │   ├── types/           # TypeScript типы
│   │   └── App.tsx          # Корневой компонент
│   ├── public/              # Статические файлы
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── backend/                  # FastAPI приложение
│   ├── ai_friend_backend/
│   │   ├── app/
│   │   │   ├── routes/      # API эндпоинты
│   │   │   ├── services/    # Бизнес-логика
│   │   │   ├── models/      # SQLAlchemy модели
│   │   │   ├── schemas/     # Pydantic схемы
│   │   │   └── main.py      # Точка входа
│   │   ├── tests/           # Тесты
│   │   └── requirements.txt
│   ├── personality.py       # Пресеты личностей
│   └── Dockerfile
│
├── .env.example             # Шаблон переменных окружения
├── docker-compose.yml       # Docker Compose конфигурация
└── README.md
```

## 🚀 Быстрый старт

### Предварительные требования

- **Python 3.11+**
- **Node.js 18+**
- **GROQ API Key** (получить на https://console.groq.com)

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd ai_friend_1.0.1
```

### 2. Настройка Backend

```bash
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate   # Linux/Mac

# Установка зависимостей
pip install -r ai_friend_backend/requirements.txt

# Копирование .env
cp ../.env.example .env

# Редактирование .env - укажите ваш GROQ_API_KEY
```

### 3. Настройка Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Копирование .env (опционально)
cp ../.env.example .env
```

### 4. Запуск приложения

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate  # Windows
uvicorn ai_friend_backend.app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Открыть в браузере

- **Frontend**: http://localhost:8080
- **Backend API Docs**: http://localhost:8000/docs

## 🛠 Разработка

### Frontend команды

```bash
cd frontend

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Запуск тестов
npm run test

# Линтинг
npm run lint
```

### Backend команды

```bash
cd backend
source venv/Scripts/activate

# Запуск сервера
uvicorn ai_friend_backend.app.main:app --reload

# Запуск тестов
pytest

# Форматирование кода
black ai_friend_backend/
isort ai_friend_backend/
```

## 🐳 Docker

### Запуск с Docker Compose

```bash
# Копирование .env
cp .env.example .env

# Редактирование .env - укажите GROQ_API_KEY

# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Production сборка

```bash
docker-compose --profile production up -d
```

## 📚 API Документация

После запуска backend, документация доступна по адресу:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Основные эндпоинты

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация пользователя |
| POST | `/api/auth/login` | Вход (получение JWT токена) |
| GET | `/api/auth/me` | Информация о текущем пользователе |
| GET | `/api/friends/` | Список друзей |
| POST | `/api/friends/` | Создание друга |
| DELETE | `/api/friends/{id}` | Удаление друга |
| POST | `/api/chat/send` | Отправка сообщения |
| GET | `/api/chat/history/{id}` | История чата |
| GET | `/api/chat/memories/{id}` | Воспоминания |

## 🧠 Память и извлечение фактов

AI автоматически извлекает факты из сообщений пользователя:

- **"Я люблю..."** → Предпочтения
- **"Мне нравится..."** → Предпочтения  
- **"Я работаю..."** → Факты о работе
- **"Я живу..."** → Факты о месте жительства
- **"Я умею..."** → Навыки
- **"Моя любимая..."** → Предпочтения

## 🔧 Технологии

### Frontend
- **React 18** + TypeScript
- **Vite** - сборщик
- **React Router** - маршрутизация
- **Tailwind CSS** - стилизация
- **Radix UI** - UI компоненты
- **TanStack Query** - управление данными
- **Axios** - HTTP клиент

### Backend
- **FastAPI** - веб-фреймворк
- **SQLAlchemy** - ORM
- **SQLite/PostgreSQL** - база данных
- **GROQ API** - AI модель (Llama 3.3)
- **Pydantic** - валидация данных
- **JWT** - аутентификация

## 📝 Лицензия

MIT

## 🤝 Вклад

Приветствуются PR и Issues!
