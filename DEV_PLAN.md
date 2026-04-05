# 🚀 План разработки AI Friend

**Стек:** Python + FastAPI (бэкенд) + GROQ AI + React (фронтенд)
**Версия плана:** 3.0
**Дата обновления:** 5 апреля 2026
**Структура:** Monorepo (frontend/, backend/)

---

## 📁 Структура проекта

```
ai_friend_1.0.1/
├── frontend/                 # React + Vite приложение
│   ├── src/
│   │   ├── components/      # UI компоненты
│   │   │   ├── account/     # Кабинет пользователя
│   │   │   ├── chat/        # Чат компоненты
│   │   │   └── landing/     # Лендинг компоненты
│   │   ├── pages/           # Страницы приложения
│   │   │   ├── Account*.tsx # Страницы кабинета
│   │   │   ├── Chat.tsx
│   │   │   ├── Friends.tsx
│   │   │   └── ...
│   │   ├── hooks/           # React хуки
│   │   ├── services/        # API сервисы
│   │   ├── types/           # TypeScript типы
│   │   ├── contexts/        # React контексты (Language, Theme)
│   │   ├── locales/         # Переводы (ru.json, en.json)
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
│   │   │   ├── utils/       # Утилиты (security, datetime)
│   │   │   └── main.py      # Точка входа
│   │   ├── tests/           # Тесты
│   │   └── requirements.txt
│   ├── personality.py       # Пресеты личностей и системные промпты
│   └── Dockerfile
│
├── .env.example             # Шаблон переменных окружения
├── docker-compose.yml       # Docker Compose конфигурация
├── DEPLOYMENT.md            # Инструкция по деплою
└── README.md
```

---

## ✅ Реализованные функции

### 1. Аутентификация
- Регистрация / Вход / Refresh токена
- JWT access + refresh токены
- `GET /api/auth/me` — информация о пользователе
- `PUT /api/auth/profile` — смена email
- `POST /api/auth/change-password` — смена пароля
- `DELETE /api/auth/account` — удаление аккаунта (каскад)

### 2. AI-друзья
- CRUD друзей (создание, просмотр, удаление)
- Настройка личности: характер, пол, возраст, интересы, сценарий
- Быстрый выбор пресета личности
- **Имя друга включается в системный промпт**

### 3. Чат
- Отправка сообщений с AI-ответами через GROQ
- История чата (последние 20-50 сообщений)
- **Долговременная память** — извлечение фактов, релевантные воспоминания
- **Время сообщений** — корректно отображается в локальном часовом поясе (UTC → локальное)
- Лимит бесплатных сообщений (5)

### 4. Подписка
- Бесплатный тариф: 5 сообщений
- Платная подписка через Stripe (monthly / yearly)
- Stripe Checkout + Customer Portal
- Webhook обработка событий Stripe
- Демо-режим активации (для тестирования)

### 5. Кабинет пользователя (`/account`)
- **Обзор** — подписка, быстрые действия, статистика
- **Профиль** — email, пароль, дата регистрации, удаление аккаунта
- **Подписка** — статус, счётчик сообщений, Stripe checkout/portal
- **Друзья** — список всех друзей, удаление, переход в чат
- **Настройки** — выбор языка (RU / EN)

### 6. Мультиязычность
- Два языка интерфейса: русский и английский
- Базовый язык — **английский**
- Переключатель языка в шапке и в настройках
- AI отвечает на языке пользователя

### 7. Системные промпты
- Модульная сборка промпта из компонентов (личность, пол, возраст, интересы, сценарий)
- **Правило местоимений** — AI использует «я/ты» вместо имён
- Инструкции по языку (RU / EN)

### 8. Тема оформления
- Светлая / Тёмная / Системная тема

---

## 🎯 API эндпоинты

### Auth
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/refresh` | Refresh токена |
| GET | `/api/auth/me` | Текущий пользователь |
| PUT | `/api/auth/profile` | Обновить email |
| POST | `/api/auth/change-password` | Сменить пароль |
| DELETE | `/api/auth/account` | Удалить аккаунт |
| GET | `/api/auth/stats` | Статистика пользователя |

### Friends
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/friends/` | Список друзей |
| POST | `/api/friends/` | Создать друга |
| GET | `/api/friends/{id}` | Получить друга |
| PUT | `/api/friends/{id}` | Обновить друга |
| DELETE | `/api/friends/{id}` | Удалить друга |

### Chat
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/chat/send` | Отправить сообщение |
| GET | `/api/chat/history/{friend_id}` | История чата |
| GET | `/api/chat/memories/{friend_id}` | Воспоминания друга |

### Subscription
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/subscription/` | Информация о подписке |
| POST | `/api/subscription/create-checkout` | Создать Stripe checkout |
| GET | `/api/subscription/portal` | Stripe Customer Portal |
| POST | `/api/subscription/activate` | Демо активация |
| POST | `/api/subscription/reset-counter` | Сброс счётчика (тест) |
| GET | `/api/subscription/success` | Страница успеха |
| GET | `/api/subscription/cancel` | Страница отмены |
| POST | `/api/subscription/webhook` | Stripe webhook |

---

## 🗄️ Модели данных

### User
- id, email, hashed_password, created_at, is_active, messages_count

### Friend
- id, name, personality, tone, gender, age, interests (JSON), scenario, user_id, created_at

### Message
- id, content, role (user/assistant), user_id, friend_id, created_at (UTC)

### Memory
- id, content, memory_type, user_id, friend_id, importance, created_at, last_accessed_at, access_count

### Subscription
- id, user_id, is_premium, plan_type, started_at, expires_at, payment_provider, subscription_id

---

## 🌐 Фронтенд страницы

| Маршрут | Описание | Защищённый |
|---------|----------|------------|
| `/` | Лендинг | Нет |
| `/login` | Вход | Нет |
| `/register` | Регистрация | Нет |
| `/friends` | Мои друзья | Да |
| `/chat/:friendId?` | Чат | Да |
| `/create-friend` | Создать друга | Да |
| `/account` | Кабинет: Обзор | Да |
| `/account/profile` | Кабинет: Профиль | Да |
| `/account/subscription` | Кабинет: Подписка | Да |
| `/account/friends` | Кабинет: Друзья | Да |
| `/account/settings` | Кабинет: Настройки | Да |
| `/subscription/success` | Подписка: успех | Нет |
| `/subscription/cancel` | Подписка: отмена | Нет |

---

## 🔧 Технологии

### Backend
- **FastAPI** — веб-фреймворк
- **SQLAlchemy** (async) — ORM
- **PostgreSQL** / SQLite — база данных
- **GROQ** (llama-3.3-70b-versatile) — AI модель
- **bcrypt** — хеширование паролей
- **JWT** — аутентификация
- **Stripe** — платежи

### Frontend
- **React 18** + **TypeScript**
- **Vite** — сборщик
- **Tailwind CSS** + **shadcn/ui** — UI компоненты
- **React Router** — маршрутизация
- **TanStack Query** — управление данными
- **Axios** — HTTP клиент
- **i18n** (custom) — переводы RU/EN

---

## 📅 Timeline

| Этап | Задачи | Статус |
|------|--------|--------|
| 1 | Настройка бэкенда, БД, Auth | ✅ |
| 2 | GROQ интеграция, системные промпты | ✅ |
| 3 | API эндпоинты (друзья, чат) | ✅ |
| 4 | Фронтенд: чат, друзья, лендинг | ✅ |
| 5 | Долговременная память | ✅ |
| 6 | Подписка (Stripe) | ✅ |
| 7 | Кабинет пользователя | ✅ |
| 8 | Мультиязычность (RU/EN) | ✅ |
| 9 | Исправление времени, промпты, UX | ✅ |
| 10 | Тестирование, оптимизация | 🔄 |

---

## 🔒 Безопасность

- [x] Хеширование паролей (bcrypt)
- [x] JWT аутентификация (access + refresh)
- [x] CORS настройки
- [x] Валидация входных данных (Pydantic)
- [x] HTTPS в продакшене
- [ ] Rate limiting
- [ ] Email верификация
- [ ] 2FA

---

## 📝 Следующие шаги

1. [ ] Email верификация при регистрации
2. [ ] Rate limiting для API
3. [ ] Уведомления (email/push)
4. [ ] Векторный поиск воспоминаний (pgvector)
5. [ ] Мобильная адаптация / PWA
6. [ ] Аналитика и мониторинг

---

## 📚 Ресурсы

- [GROQ документация](https://console.groq.com/docs)
- [FastAPI документация](https://fastapi.tiangolo.com)
- [SQLAlchemy документация](https://docs.sqlalchemy.org)
- [Stripe документация](https://stripe.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
