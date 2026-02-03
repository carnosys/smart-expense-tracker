from sqlalchemy.orm import mapped_column, Mapped, validates
from sqlalchemy import Integer, String, ForeignKey, UniqueConstraint
from db.base import Base

class Category(Base):
    __tablename__="categories"
    __table_args__= (
        UniqueConstraint("user_id", "name", name="userid__name_constraint"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(20))

    @validates("name")
    def validate_name(self, key, value):
        if len(value) == 0:
            raise ValueError("Name of the category cannot be left empty")
        return value
