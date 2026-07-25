"""Add missing tables and columns for v2 models

Revision ID: 002
Revises: 001
Create Date: 2026-07-25

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add missing columns to users
    op.add_column("users", sa.Column("password_hash", sa.String(255), nullable=False, server_default=""))
    op.add_column("users", sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")))
    op.add_column("users", sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True))

    # Add missing columns to leads
    op.add_column("leads", sa.Column("business_type", sa.String(255), nullable=True))
    op.add_column("leads", sa.Column("team_size", sa.String(50), nullable=True))
    op.add_column("leads", sa.Column("problem_processes", postgresql.JSONB(), nullable=True))
    op.add_column("leads", sa.Column("tools", postgresql.JSONB(), nullable=True))
    op.add_column("leads", sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True))

    # Add missing columns to business_profiles
    op.add_column("business_profiles", sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True))

    # Add missing columns to automation_reports
    op.add_column("automation_reports", sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True))

    # Add missing columns to analytics_events
    op.add_column("analytics_events", sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True))

    # Create knowledge_documents table
    op.create_table(
        "knowledge_documents",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("doc_type", sa.String(50), nullable=False, server_default="markdown"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("title", name="uq_document_title"),
    )

    # Create document_embeddings table
    op.create_table(
        "document_embeddings",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("document_id", sa.Integer(), sa.ForeignKey("knowledge_documents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("embedding", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("chunk_text", sa.Text(), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_document_embeddings_document_id"), "document_embeddings", ["document_id"])

    # Create refresh_tokens table
    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_hash", sa.String(255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash"),
    )
    op.create_index(op.f("ix_refresh_tokens_user_id"), "refresh_tokens", ["user_id"])

    # Create workspaces table
    op.create_table(
        "workspaces",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create workspace_members table
    op.create_table(
        "workspace_members",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("workspace_id", sa.Integer(), sa.ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.String(50), nullable=False, server_default="admin"),
        sa.Column("invited_by", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_workspace_members_workspace_id"), "workspace_members", ["workspace_id"])
    op.create_index(op.f("ix_workspace_members_user_id"), "workspace_members", ["user_id"])

    # Create diagnostic_sessions table
    op.create_table(
        "diagnostic_sessions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("workspace_id", sa.Integer(), sa.ForeignKey("workspaces.id"), nullable=True),
        sa.Column("session_data", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("status", sa.String(50), nullable=False, server_default="completed"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_diagnostic_sessions_user_id"), "diagnostic_sessions", ["user_id"])
    op.create_index(op.f("ix_diagnostic_sessions_workspace_id"), "diagnostic_sessions", ["workspace_id"])

    # Create agent_runs table
    op.create_table(
        "agent_runs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("session_id", sa.Integer(), sa.ForeignKey("diagnostic_sessions.id"), nullable=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("workspace_id", sa.Integer(), sa.ForeignKey("workspaces.id"), nullable=True),
        sa.Column("agent_name", sa.String(100), nullable=False),
        sa.Column("input_data", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("output_data", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("error", sa.String(500), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_agent_runs_user_id"), "agent_runs", ["user_id"])
    op.create_index(op.f("ix_agent_runs_workspace_id"), "agent_runs", ["workspace_id"])
    op.create_index(op.f("ix_agent_runs_session_id"), "agent_runs", ["session_id"])


def downgrade() -> None:
    op.drop_table("agent_runs")
    op.drop_table("diagnostic_sessions")
    op.drop_table("workspace_members")
    op.drop_table("workspaces")
    op.drop_table("refresh_tokens")
    op.drop_table("document_embeddings")
    op.drop_table("knowledge_documents")

    op.drop_column("analytics_events", "updated_at")
    op.drop_column("automation_reports", "updated_at")
    op.drop_column("business_profiles", "updated_at")
    op.drop_column("leads", "tools")
    op.drop_column("leads", "problem_processes")
    op.drop_column("leads", "team_size")
    op.drop_column("leads", "business_type")
    op.drop_column("leads", "updated_at")
    op.drop_column("users", "updated_at")
    op.drop_column("users", "is_verified")
    op.drop_column("users", "password_hash")
