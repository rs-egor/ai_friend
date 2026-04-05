from datetime import datetime, timezone


def ensure_timezone_aware(dt: datetime) -> datetime:
    """
    Гарантировать, что datetime имеет timezone info.
    Если datetime naive (без tz), добавляем UTC.
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        # Naive datetime — добавляем UTC
        return dt.replace(tzinfo=timezone.utc)
    return dt


def is_expired(dt: datetime) -> bool:
    """
    Проверить, истёк ли срок datetime.
    Безопасно сравнивает naive и aware datetime.
    """
    if dt is None:
        return True
    dt_aware = ensure_timezone_aware(dt)
    return dt_aware < datetime.now(timezone.utc)
