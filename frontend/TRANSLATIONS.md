# Руководство по использованию переводов

## Обзор

Проект поддерживает два языка: русский (ru) и английский (en). Переключение языка доступно в меню пользователя.

## Структура

Файлы переводов находятся в директории `src/locales/`:
- `ru.json` — русские переводы
- `en.json` — английские переводы

## Использование

### В компонентах

Для использования переводов в компонентах импортируйте и используйте хук `useLang`:

```tsx
import { useLang } from "@/contexts/LanguageContext";

const MyComponent = () => {
  const { t } = useLang();
  
  return (
    <div>
      <h1>{t("landing.hero_title")}</h1>
      <p>{t("landing.hero_description")}</p>
    </div>
  );
};
```

### Ключи переводов

Ключи имеют иерархическую структуру:
- `auth.login.title` — заголовок страницы входа
- `auth.register.title` — заголовок страницы регистрации
- `friends.page_title` — заголовок страницы друзей
- `create_friend.name_label` — метка поля имени
- `landing.hero_title` — заголовок главного экрана

### Добавление нового перевода

1. Откройте файлы `src/locales/ru.json` и `src/locales/en.json`
2. Добавьте новый ключ в соответствующую секцию:
   ```json
   {
     "my_section": {
       "my_key": "Текст на русском",
       "my_other_key": "Text in English"
     }
   }
   ```
3. Используйте в компоненте: `t("my_section.my_key")`

## Переключение языка

### В меню пользователя

Переключатель языка находится в меню пользователя (иконка человека в правом верхнем углу):
1. Нажмите на иконку пользователя
2. Выберите "Язык" → "Русский" или "English"

### Программно

```tsx
import { useLang } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  
  return (
    <button onClick={() => setLang("en")}>
      Switch to English
    </button>
  );
};
```

## Хранение выбора

Выбранный язык сохраняется в `localStorage` под ключом `lang` и восстанавливается при загрузке страницы.

## Структура ключей

### auth
- `auth.login.*` — страница входа
- `auth.register.*` — страница регистрации
- `auth.logout.*` — выход

### user_menu
- `user_menu.label` — метка пользователя
- `user_menu.theme` — тема
- `user_menu.language` — язык

### friends
- `friends.page_title` — заголовок страницы
- `friends.create_button` — кнопка создания
- `friends.chat_button` — кнопка чата

### create_friend
- `create_friend.page_title` — заголовок страницы
- `create_friend.name_label` — метка имени
- `create_friend.gender_label` — метка пола
- `create_friend.age_label` — метка возраста
- `create_friend.interests_label` — метка интересов
- `create_friend.scenario_label` — метка сценария

### chat
- `chat.sidebar_title` — заголовок боковой панели
- `chat.memory_button` — кнопка памяти
- `chat.message_input_placeholder` — поле ввода сообщения

### landing
- `landing.hero_*` — главный экран
- `landing.problem_*` — секция проблем
- `landing.for_whom_*` — секция "Для кого"
- `landing.memory_*` — секция памяти
- `landing.letter_*` — секция писем
- `landing.pricing_*` — секция тарифов
- `landing.testimonials_*` — секция отзывов

## Советы

1. **Всегда добавляйте переводы для обоих языков**
2. **Используйте осмысленные ключи**, отражающие назначение текста
3. **Группируйте ключи по секциям** для удобства навигации
4. **Избегайте хардкода** текстов в компонентах
