from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class BusinessProfile(Base, TimestampMixin):
    __tablename__ = "business_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    workspace_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("workspaces.id"), nullable=True, index=True
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    business_type: Mapped[str] = mapped_column(String(255), nullable=False)
    team_size: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    __table_args__ = (UniqueConstraint("user_id", name="uq_business_profile_user"),)

    user = relationship("User", back_populates="business_profiles")

    def __repr__(self) -> str:
        return f"<BusinessProfile id={self.id} type={self.business_type!r} user_id={self.user_id}>"