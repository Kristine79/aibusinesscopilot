import logging

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)

from app.api.v1 import analyses, analytics, health, knowledge, leads, users
from app.api.v1.analyses import analyze_router
from app.api.v1.health import record_startup
from app.modules.auth.router import router as auth_router
from app.modules.workspace.router import router as workspace_router
from app.modules.agents.router import router as agents_router
from app.core.config import settings
from app.core.validation import validate_environment
from app.database.session import engine

import app.database.models  # noqa: F401 — register all models with SQLAlchemy metadata


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 50)
    logger.info("AI Business Copilot API v1.0.0")
    logger.info("=" * 50)
    logger.info("Database: %s", settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://").split("@")[-1] if "@" in settings.DATABASE_URL else "configured")
    logger.info("AI Provider: %s", settings.DEFAULT_AI_PROVIDER)
    logger.info("CORS Origins: %s", settings.BACKEND_CORS_ORIGINS)

    validate_environment()
    record_startup()

    logger.info("Run migrations: cd backend && alembic upgrade head")
    logger.info("API docs: http://localhost:%d/docs", settings.BACKEND_PORT)
    logger.info("=" * 50)
    yield
    await engine.dispose()


app = FastAPI(
    title="AI Business Copilot API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.core.middleware import setup_middleware
setup_middleware(app)

app.include_router(health.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(leads.router, prefix="/api")
app.include_router(analyses.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(workspace_router, prefix="/api")
app.include_router(agents_router, prefix="/api")
