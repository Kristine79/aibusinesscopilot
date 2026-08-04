"""Add workspace_id to leads

Revision ID: 005
Revises: 004
Create Date: 2026-08-04

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "leads",
        sa.Column("workspace_id", sa.Integer(), sa.ForeignKey("workspaces.id"), nullable=True)
    )
    op.create_index(
        op.f("ix_leads_workspace_id"), "leads", ["workspace_id"]
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_leads_workspace_id"), table_name="leads")
    op.drop_column("leads", "workspace_id")
