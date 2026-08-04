"""Add workspace_id to business_profiles

Revision ID: 004
Revises: 003
Create Date: 2026-08-04

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "business_profiles",
        sa.Column("workspace_id", sa.Integer(), sa.ForeignKey("workspaces.id"), nullable=True)
    )
    op.create_index(
        op.f("ix_business_profiles_workspace_id"), "business_profiles", ["workspace_id"]
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_business_profiles_workspace_id"), table_name="business_profiles")
    op.drop_column("business_profiles", "workspace_id")
