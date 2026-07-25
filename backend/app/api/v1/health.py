import logging
import time

from fastapi import APIRouter, Depends
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db

logger = logging.getLogger(__name__)
router = APIRouter(tags=["health"])

start_time: float = 0.0


@router.on_event("startup")
async def record_startup():
    global start_time
    start_time = time.time()


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    db_ok = False
    db_latency = 0.0
    try:
        t0 = time.time()
        await db.execute(select(1))
        db_latency = round((time.time() - t0) * 1000, 1)
        db_ok = True
    except Exception as e:
        logger.warning("Health check DB error: %s", e)

    uptime = round(time.time() - start_time, 1) if start_time else 0

    return {
        "status": "ok" if db_ok else "degraded",
        "version": "1.0.0",
        "uptime_seconds": uptime,
        "database": {
            "status": "connected" if db_ok else "disconnected",
            "latency_ms": db_latency,
        },
    }
