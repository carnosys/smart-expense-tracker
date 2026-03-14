from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Shared declarative base for ORM models."""

    pass


# Import ORM modules so Base.metadata is populated for Alembic autogenerate.
import models.categories  # noqa: E402,F401
import models.expense  # noqa: E402,F401
import models.goals  # noqa: E402,F401
import models.user  # noqa: E402,F401
