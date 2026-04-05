from datetime import datetime, timezone, timedelta


def utcnow() -> datetime:
    """
    Получить текущее UTC время как naive datetime (без tzinfo).
    Совместимо с колонками DateTime без timezone=True.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)


def utcnow_plus(days: int = 0, hours: int = 0, minutes: int = 0) -> datetime:
    """
    Получить UTC время + смещение как naive datetime.
    """
    return utcnow() + timedelta(days=days, hours=hours, minutes=minutes)


def is_expired(dt: datetime) -> bool:
    """
    Проверить, истёк ли срок datetime.
    Работает с naive datetime (предполагается UTC).
    """
    if dt is None:
        return True
    # Если datetime aware — убираем tzinfo для сравнения
    if dt.tzinfo is not None:
        dt = dt.replace(tzinfo=None)
    return dt < utcnow()
