"""Add workspace_id to automation_reports

Revision ID: 003
Revises: 002
Create Date: 2026-08-04

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "automation_reports",
        sa.Column("workspace_id", sa.Integer(), sa.ForeignKey("workspaces.id"), nullable=True)
    )
    op.create_index(
        op.f("ix_automation_reports_workspace_id"), "automation_reports", ["workspace_id"]
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_automation_reports_workspace_id"), table_name="automation_reports")
    op.drop_column("automation_reports", "workspace_id")
