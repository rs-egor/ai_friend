# Поддержка языка в AI-друге

## Обзор

AI-друг теперь поддерживает общение на русском и английском языках. Язык общения определяется на основе языка интерфейса, выбранного пользователем.

## Изменения в backend

### 1. personality.py

Добавлены инструкции по языку:

```python
LANGUAGE_INSTRUCTIONS = {
    "ru": """
    
ВАЖНО: Общайся на русском языке. Отвечай на том же языке, на котором пишет пользователь.""",
    "en": """
    
IMPORTANT: Communicate in English. Respond in the same language the user writes in."""
}
```

Обновлена функция `build_system_prompt`:
```python
def build_system_prompt(
    personality: str, 
    gender: str, 
    age: str, 
    interests: list, 
    scenario: str, 
    language: str = "ru"
) -> str:
```

### 2. groq_service.py

Добавлен параметр `language` в методы:
- `get_friend_response(language: str = "ru")`
- `get_friend_response_with_memory(language: str = "ru")`

### 3. chat_service.py

Обновлён метод `send_message`:
```python
async def send_message(
    self,
    user: User,
    friend_id: int,
    user_message: str,
    language: str = "ru",
) -> dict:
```

### 4. schemas/chat.py

Добавлено поле `language` в схему запроса:
```python
class ChatRequest(BaseModel):
    message: str
    friend_id: int
    language: Optional[str] = "ru"
```

### 5. routes/chat.py

Передача языка в сервис:
```python
result = await chat_service.send_message(
    user=current_user,
    friend_id=request.friend_id,
    user_message=request.message,
    language=request.language or "ru",
)
```

## Изменения в frontend

### 1. services/api.ts

Обновлён метод `chatApi.send`:
```typescript
send: async (message: string, friendId: number, language?: string) => {
  const response = await api.post('/chat/send', { 
    message, 
    friend_id: friendId,
    language: language || 'ru',
  });
  return response.data;
}
```

### 2. hooks/useChat.ts

Добавлено использование хука языка:
```typescript
import { useLang } from '@/contexts/LanguageContext';

export const useChat = (friendId: number | null) => {
  const { lang } = useLang();
  
  const sendMessage = useCallback(async (content: string) => {
    // ...
    const response: ChatResponse = await chatApi.send(content, friendId, lang);
    // ...
  }, [friendId, lang]);
}
```

## Как это работает

1. Пользователь выбирает язык интерфейса в меню пользователя (RU/EN)
2. Язык сохраняется в `localStorage` и контексте `LanguageContext`
3. При отправке сообщения текущий язык передаётся в API через параметр `language`
4. Backend добавляет соответствующую инструкцию в системный промпт
5. AI отвечает на том же языке, на котором пишет пользователь

## API

### POST /api/chat/send

```json
{
  "message": "Привет, как дела?",
  "friend_id": 1,
  "language": "ru"
}
```

Параметры:
- `message` (string) — текст сообщения
- `friend_id` (int) — ID друга
- `language` (string, optional) — код языка ("ru" или "en"), по умолчанию "ru"

## Тестирование

1. Откройте приложение
2. Переключите язык в меню пользователя (иконка человека → Язык)
3. Отправьте сообщение AI-другу
4. AI ответит на выбранном языке интерфейса

## Поддерживаемые языки

- **ru** — Русский (по умолчанию)
- **en** — English

## Добавление новых языков

Для добавления нового языка:

1. Добавьте инструкцию в `personality.py`:
```python
LANGUAGE_INSTRUCTIONS = {
    "ru": "...",
    "en": "...",
    "fr": """
    
IMPORTANT: Communiquez en français. Répondez dans la même langue que l'utilisateur.""",
}
```

2. Добавьте переводы в `frontend/src/locales/fr.json`

3. Добавьте опцию языка в `LanguageContext.tsx`
