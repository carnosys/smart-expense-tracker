import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def required(name: str) -> str:
    """Read required env var and fail fast when missing."""
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing value for: {name}")
    return value


def to_int(name: str, default: int) -> int:
    """Read optional integer env var with fallback."""
    value = os.getenv(name)
    if value is None:
        return default
    return int(value)


def to_bool(name: str, default: bool) -> bool:
    """Read optional boolean env var with common truthy values."""
    value_str = os.getenv(name)
    if value_str is None:
        return default
    return value_str.strip().lower() in {"1", "true", "yes", "y", "on"}


@dataclass(frozen=True)
class Settings:
    # Database settings
    POSTGRES_USER: str = required("POSTGRES_USER")
    POSTGRES_PASSWORD: str = required("POSTGRES_PASSWORD")
    POSTGRES_DB: str = required("POSTGRES_DB")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "db")
    POSTGRES_PORT: int = to_int("POSTGRES_PORT", 5432)

    # JWT settings
    JWT_SECRET: str = required("JWT_SECRET")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = to_int("ACCESS_TOKEN_EXPIRE_MINUTES", 15)

    # Password settings
    PASSWORD_HASH_SCHEME: str = os.getenv("PASSWORD_HASH_SCHEME", "bcrypt")

    # CORS policy settings
    CORS_ALLOW_CREDENTIALS: bool = to_bool("CORS_ALLOW_CREDENTIALS", False)

    @property
    def db_url(self) -> str:
        """Build SQLAlchemy async DSN."""
        return (
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


settings = Settings()
