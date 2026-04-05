import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { useLang } from "@/contexts/LanguageContext";

interface MessageBubbleProps {
  message: Message;
}

/**
 * Парсит дату из строки API.
 * Бэкенд отдаёт naive UTC datetime без "Z", поэтому добавляем его вручную,
 * чтобы браузер корректно конвертировал в локальный часовой пояс.
 */
function parseUtcDate(dateStr: string): Date {
  const normalized = dateStr.endsWith('Z') || dateStr.includes('+') || dateStr.includes('-', 10)
    ? dateStr
    : `${dateStr}Z`;
  return new Date(normalized);
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { lang } = useLang();
  const isUser = message.role === 'user';

  const timeLocale = lang === 'ru' ? 'ru-RU' : 'en-US';

  const localDate = parseUtcDate(message.created_at);

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            "text-xs mt-1",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {localDate.toLocaleTimeString(timeLocale, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
