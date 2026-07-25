from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class Lead(Base, TimestampMixin):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    workspace_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("workspaces.id"), nullable=True, index=True
    )
    status: Mapped[str] = mapped_column(
        String(50), default="new", index=True
    )

    user = relationship("User", back_populates="leads")

    def __repr__(self) -> str:
        return f"<Lead id={self.id} user_id={self.user_id} status={self.status!r}>"