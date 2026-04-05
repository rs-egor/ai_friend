# 🚀 Инструкция по деплою AI Friend

**Бэкенд:** Render (PostgreSQL + FastAPI)
**Фронтенд:** Vercel (React + Vite)

---

## ⚠️ Критически важно: Проблема с SQLite на Render

**Проблема:** Render использует **ephemeral filesystem** (временную файловую систему). После каждого деплоя или перезапуска контейнера все файлы, включая `ai_friend.db`, **удаляются**. Это приводит к потере всех данных пользователей.

**Решение:** Используйте **PostgreSQL** для хранения данных.

| Хранилище   | Сохранение данных | Для production |
|-------------|-------------------|----------------|
| SQLite      | ❌ Удаляется       | ❌ Нет         |
| PostgreSQL  | ✅ Сохраняется     | ✅ Да          |

---

## 📦 Архитектура деплоя

```
┌─────────────────┐     ┌──────────────────┐
│   Vercel        │────▶│   Render         │
│   (Frontend)    │ API │   (Backend)      │
│   React + Vite  │◀────│   FastAPI + GROQ │
└─────────────────┘     └──────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   PostgreSQL     │
                        │   (Render DB)    │
                        └──────────────────┘
```

---

## 🔧 Backend Deployment на Render

### 1. Подготовка репозитория

Убедитесь, что в корне backend есть:
- `requirements.txt` — зависимости Python
- `Procfile` или `render.yaml` — команда запуска

**Procfile:**
```
web: uvicorn ai_friend_backend.app.main:app --host 0.0.0.0 --port $PORT
```

### 2. Создание проекта на Render

1. Войдите на https://render.com
2. Нажмите **New +** → **Web Service**
3. Подключите GitHub репозиторий `ai_friend`
4. Настройки:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn ai_friend_backend.app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3

### 3. Создание базы данных PostgreSQL

1. В проекте Render нажмите **New +** → **PostgreSQL**
2. Выберите регион и план (Free для тестирования)
3. Render создаст базу и автоматически добавит `DATABASE_URL` в переменные

### 4. Переменные окружения (Backend)

В панели Render → Settings → Environment:

```env
# GROQ API (обязательно)
GROQ_API_KEY=your_groq_api_key_here

# Database (обязательно PostgreSQL!)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT (обязательно)
JWT_SECRET_KEY=your_super_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (обязательно — URL вашего Vercel frontend)
FRONTEND_URL=https://your-app.vercel.app

# Stripe (для платежей)
STRIPE_SECRET_KEY=sk_live_xxx или sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx или pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_MONTHLY=price_xxx
STRIPE_PRICE_ID_YEARLY=price_xxx

# Application
APP_NAME=AI Friend
DEBUG=false
```

**⚠️ Важно:**
- `FRONTEND_URL` должен совпадать с доменом Vercel (без trailing slash)
- `STRIPE_*` переменные нужны только если подключены платежи

### 5. Проверка backend

После деплоя:
- API: `https://your-app.onrender.com`
- Swagger docs: `https://your-app.onrender.com/docs`
- Health check: `https://your-app.onrender.com/health`

---

## 🎨 Frontend Deployment на Vercel

### 1. Подготовка

1. Войдите на https://vercel.com
2. Нажмите **Add New Project**
3. Импортируйте GitHub репозиторий `ai_friend`

### 2. Настройка проекта

- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3. Переменные окружения (Frontend)

В Vercel Settings → Environment Variables:

```env
VITE_API_URL=https://your-app.onrender.com/api
```

### 4. Обновление vercel.json

Перед деплоем обновите `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-app.onrender.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Замените** `your-app.onrender.com` на ваш актуальный Render URL.

### 5. Деплой

```bash
cd frontend

# Vercel CLI (опционально)
npm i -g vercel
vercel login
vercel --prod
```

Или через веб-интерфейс Vercel — деплой автоматический при push в main.

### 6. Проверка

- Frontend: `https://your-app.vercel.app`
- API через proxy: `https://your-app.vercel.app/api/health`

---

## 🐳 Docker Compose (Local Development)

### Запуск локально

```bash
# Копирование .env
cp .env.example .env

# Редактирование .env — укажите GROQ_API_KEY

# Запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

---

## 📋 Environment Variables Reference

### Backend (.env)

```env
# Required
GROQ_API_KEY=your_api_key
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET_KEY=change_this_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:8080

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_MONTHLY=
STRIPE_PRICE_ID_YEARLY=

# Application
APP_NAME=AI Friend
DEBUG=true
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## ✅ Checklist перед деплоем

- [ ] Получить GROQ API Key (https://console.groq.com)
- [ ] Создать проект на Render
- [ ] Создать PostgreSQL базу на Render
- [ ] Настроить переменные окружения backend
- [ ] Задеплоить backend
- [ ] Проверить API через /docs
- [ ] Обновить vercel.json с backend URL
- [ ] Создать проект на Vercel
- [ ] Настроить VITE_API_URL для frontend
- [ ] Задеплоить frontend
- [ ] Протестировать полный цикл (регистрация, чат, кабинет)
- [ ] Настроить Stripe (если нужны платежи)

---

## 🔍 Troubleshooting

### CORS ошибки

Убедитесь, что `FRONTEND_URL` в backend точно совпадает с вашим Vercel доменом (без trailing slash).

### 401 Unauthorized

Проверьте, что JWT токен передаётся в заголовке `Authorization: Bearer <token>`. Токен должен быть валидным и не истёкшим.

### 307 Redirect → 401 на /api/subscription/

FastAPI делает редирект с `/subscription` на `/subscription/`, при котором теряется `Authorization` заголовок. Фронтенд теперь вызывает `/subscription/` напрямую (с trailing slash).

### Database migration error

При первом запуске таблицы создаются автоматически. Если ошибка — проверьте `DATABASE_URL` (должен быть PostgreSQL, не SQLite).

### Время сообщений отображается неверно

Бэкенд сохраняет время в UTC (naive datetime). Фронтенд добавляет `Z` к строке даты и корректно конвертирует в локальный часовой пояс браузера.

### Vite build failed

Убедитесь, что все зависимости установлены: `npm install` в папке frontend. Проверьте, что `VITE_API_URL` задан.

### Stripe не работает

Проверьте, что все `STRIPE_*` переменные заданы в Render. Для тестирования используйте `sk_test_*` и `pk_test_*` ключи.

---

## 📊 Мониторинг

### Render Dashboard
- Логи: Render → Your Service → Logs
- Метрики: Render → Your Service → Metrics
- Деплои: Render → Your Service → Deploys

### Vercel Dashboard
- Логи: Vercel → Your Project → Functions → Logs
- Аналитика: Vercel → Your Project → Analytics

---

## 🔄 CI/CD

Оба сервиса (Render и Vercel) поддерживают **автоматический деплой** при push в ветку `main`.

Для отключения авто-деплоя:
- Render: Settings → Git → Auto-Deploy
- Vercel: Settings → Git → Auto Deploy
