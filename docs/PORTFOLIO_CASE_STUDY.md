# Portfolio Case Study: AI Business Copilot

> **Role:** AI Product Engineer / Technical Specialist  
> **Timeline:** Full product lifecycle — architecture, implementation, production hardening  
> **Stack:** React 19 · FastAPI · PostgreSQL · OpenAI · Docker

---

## 1. Project Summary

AI Business Copilot is a full-stack SaaS platform that helps businesses identify AI automation opportunities. It combines multi-LLM orchestration, RAG knowledge retrieval, and agentic workflows into a coherent product delivered through web and Telegram channels.

---

## 2. Problem Solved

Small and medium businesses know they should adopt AI but lack:
- The technical expertise to evaluate which processes can be automated
- A structured method to assess automation ROI
- Clear implementation roadmaps

The platform solves this by providing an intelligent diagnostic → analysis → report pipeline that turns business information into actionable automation plans in minutes, not weeks.

---

## 3. Architecture Decisions

### Why FastAPI?

| Requirement | Decision |
|-------------|----------|
| Async I/O for AI calls | FastAPI native async support |
| Automatic API documentation | OpenAPI/Swagger generation |
| Request validation | Pydantic integration (zero boilerplate) |
| Performance | Uvicorn + gunicorn workers |

**Alternative considered:** Django REST Framework — rejected due to sync-first design, heavier footprint, and more complex async setup.

### Why PostgreSQL + pgvector?

| Requirement | Decision |
|-------------|----------|
| Relational data integrity | PostgreSQL proven reliability |
| Vector search capability | pgvector extension (production path) |
| Single database for all data | Reduces operational complexity |
| JSONB for flexible schemas | Rapid iteration without schema changes |

**Current approach:** Embeddings stored as JSON arrays with cosine similarity in application code. Architecture designed for seamless migration to native pgvector VECTOR type.

### Why RAG Instead of Fine-Tuning?

| Aspect | RAG | Fine-Tuning |
|--------|-----|-------------|
| Knowledge updates | Instant — upload new documents | Requires retraining |
| Cost | Pay per token | Training + hosting costs |
| Accuracy | Source-attributed answers | May hallucinate |
| Data privacy | Documents stay in your DB | Sent to provider |

**Verdict:** RAG is the correct choice for a knowledge base that needs to evolve with the business. Fine-tuning would be appropriate for specialized behavior (e.g., custom response format).

### Why Agent Architecture?

The multi-agent system (Orchestrator + StrategyAgent + ResearchAgent) enables:
- Separation of concerns (strategy vs. research)
- Independent execution tracking per agent
- Extensibility (add agents without modifying existing ones)
- Observability (each run stored in `agent_runs` table)

### Why Docker Compose?

Four services (db, backend, frontend, telegram-bot) with dependency management, health checks, and shared networking — production-ready local development.

---

## 4. Technical Challenges & Solutions

### Challenge 1: Async AI Provider Calls

**Problem:** AI API calls are I/O-bound but can timeout or fail.

**Solution:** Abstract provider pattern with:
- Configurable timeouts (30s default)
- Automatic retries (2 attempts)
- Provider fallback (OpenAI ↔ OpenRouter via env var)
- Structured error responses (502 AIProviderError)

### Challenge 2: Refresh Token Rotation with Race Conditions

**Problem:** Concurrent refresh requests could reuse the same token.

**Solution:** Delete-before-issue pattern — old token hash is deleted before creating a new one. If a reused token is detected, all tokens for that user are invalidated.

### Challenge 3: Mock vs. Real Embeddings

**Problem:** Development without API keys should still work.

**Solution:** Provider pattern with `MockEmbeddingProvider` fallback (SHA-256 based deterministic embeddings) and real `OpenAIEmbeddingProvider` when `OPENAI_API_KEY` is set. Selected at runtime via `get_embedding_provider()`.

### Challenge 4: Database Schema Evolution

**Problem:** Initial development used `Base.metadata.create_all` — no migration history.

**Solution:** Alembic with two migrations:
- `001_initial.py` — original 5 core tables
- `002_missing_tables_and_columns.py` — all new tables + missing columns for auth, workspace, agents, knowledge

---

## 5. AI Implementation Details

### Multi-LLM Orchestration

```
POST /api/analyze/{user_id}
  → Builds prompt with business context (type, team size, processes, tools)
  → Calls AIProvider.generate_structured_response() with AnalysisResult schema
  → OpenAI: uses beta.chat.completions.parse (native structured output)
  → OpenRouter: uses JSON response_format with schema validation
  → Returns report with opportunities + roadmap
```

### RAG Pipeline

```
Document Upload → Chunk (500 chars) → Embed (OpenAI text-embedding-3-small)
  → Store (JSON in PostgreSQL) → Query → Embed → Cosine Similarity
  → Top 5 chunks → LLM with context → Answer with source attribution
```

### Embedding Provider Pattern

```python
class EmbeddingProvider(ABC):
    async def embed(text) -> list[float]
    async def embed_batch(texts) -> list[list[float]]

# Implementations:
# - OpenAIEmbeddingProvider (production — text-embedding-3-small, 1536 dims)
# - MockEmbeddingProvider (development — SHA-256, 128 dims)
```

### Agent Workflow

```
POST /api/agents/analyze
  → Orchestrator.run_all(input_data)
    → StrategyAgent.execute() — business strategy analysis
    → ResearchAgent.execute() — automation opportunity research
  → Each agent stores run in agent_runs table
  → Returns OrchestratorResult with per-agent summary
  → All runs tracked: status, input, output, timing
```

---

## 6. Why This Architecture Can Scale

| Dimension | Scaling Strategy |
|-----------|-----------------|
| **API Throughput** | Gunicorn with multiple uvicorn workers (2*CPU+1) |
| **Database** | Connection pooling (10-20 connections), async queries |
| **AI Calls** | Timeout + retry per provider, configurable models |
| **Knowledge Base** | pgvector native indexing (IVFFlat, HNSW) |
| **Multi-tenant** | Workspace isolation at database level |
| **Async Processing** | Queue system for long-running agent tasks |

---

## 7. Engineering Decisions

### How did you use AI in this project?

> *AI is used as an engineering accelerator, not a replacement for engineering decisions.*

- Architecture decisions (stack, patterns, trade-offs) are human-made
- Implementation code is AI-assisted (boilerplate, CRUD, tests)  
- All AI-generated code undergoes human review
- Production hardening (migrations, rate limiting, security) is intentionally human-driven

The key insight: AI excels at implementation speed, but architecture, validation, and production decisions require human judgment.

### What would you improve next?

1. **Native pgvector** — Replace JSON embedding storage with VECTOR column type and IVFFlat indexing for faster similarity search
2. **Async queue** — Long-running agent orchestrations should use Celery/Redis for background processing
3. **Monitoring** — Prometheus metrics + structured JSON logging for production observability
4. **CI/CD** — GitHub Actions for linting, testing, and automated deployment
5. **Caching** — Redis for prompt templates, frequent queries, and rate limiter storage

### How would you scale this?

**Short-term (current architecture):**
- Increase gunicorn workers for CPU-bound operations
- Add connection pooling tuning for PostgreSQL
- Implement pagination and query optimization

**Medium-term:**
- Background task queue for AI analysis (avoid blocking workers)
- pgvector native indexing for semantic search at scale (10k+ documents)
- Redis caching for frequent queries and rate limiting

**Long-term:**
- Horizontal scaling: multiple backend instances behind a load balancer
- Read replicas for analytics queries
- Event-driven architecture for webhook/Telegram integrations

### What testing strategy do you use?

- **Unit tests:** Pytest with async fixtures (SQLite for speed)
- **Integration tests:** Test files cover auth (register, login, refresh, logout, token security) and workspace CRUD
- **Test structure:** `tests/conftest.py` provides async test client + test database
- **Coverage target:** API endpoints, auth flows, business logic

---

## 8. Interview Talking Points

### "Walk me through your tech stack and why you chose it."

> *FastAPI for async AI calls and automatic OpenAPI docs. React 19 with shadcn/ui for a polished, component-driven frontend. PostgreSQL for reliable data storage with pgvector-ready architecture. OpenAI and OpenRouter for flexible LLM access. Docker Compose for reproducible environments.*

### "How do you handle AI provider failures?"

> *Provider abstraction with interface-based design. Timeout configs, retries, and structured error responses. The system degrades gracefully — returns 502 with descriptive error instead of crashing. Provider fallback via env var without code changes.*

### "Tell me about a difficult engineering problem you solved."

> *The embedding provider abstraction. Needed real embeddings for production (OpenAI) but also wanted the system to work without API keys during development. Solution: Provider pattern with runtime selection. Production uses text-embedding-3-small with 1536 dimensions, development falls back to deterministic mock embeddings. Zero code changes to switch.*

### "What would you do differently if you started over?"

> *Start with Alembic migrations from day one instead of create_all. The migration retro-fit was straightforward but ideally migrations evolve with the schema. Also would use a queue system earlier for AI analysis — blocking HTTP requests during LLM calls limits throughput.*

### "How do you ensure code quality?"

> *Structured review process: AI generates → human reviews → tests pass → deploy. Production hardening (migrations, rate limiting, security headers, global exception handlers) is always human-implemented. Type hints everywhere, strict TypeScript, consistent error handling patterns.*

### "How do you stay current with AI developments?"

> *Follow LLM provider changelogs (OpenAI, Anthropic), experiment with new capabilities (structured outputs, agents, RAG patterns), and apply engineering judgment to separate hype from practical value. Every new technique is evaluated against real use cases in this codebase.*

---

## 9. Project Structure Overview

```
/
├── frontend/           React 19 + Vite + Tailwind + shadcn/ui
│   ├── src/pages/      Landing, Diagnostic, Report, Dashboard, Auth, etc.
│   ├── src/components/ UI primitives, admin layout, auth
│   ├── src/lib/        API client, auth context, utils
│   └── src/types/      TypeScript interfaces
├── backend/            FastAPI async monolith
│   ├── app/api/v1/     REST endpoints (10 router files)
│   ├── app/core/       Config, security, middleware, exceptions
│   ├── app/database/   SQLAlchemy models (7 + 5 module models)
│   ├── app/modules/    Business logic (auth, workspace, agents, ai, etc.)
│   ├── alembic/        Database migrations (2 versions)
│   └── tests/          Async pytest suite
├── telegram-bot/       aiogram 3 with FSM diagnostic flow
└── docker-compose.yml  PostgreSQL + Backend + Frontend + Bot
```

---

## 10. Production Checklist Status

| Item | Status |
|------|--------|
| Alembic migrations | ✅ Done |
| Rate limiting (slowapi) | ✅ Done |
| Security headers | ✅ Done |
| Global exception handler | ✅ Done |
| Environment validation | ✅ Done |
| Structured startup logging | ✅ Done |
| Health check with DB status | ✅ Done |
| Gunicorn + uvicorn workers | ✅ Configured |
| Docker setup | ✅ Done |
| Real embeddings (OpenAI) | ✅ Done |
| JWT auth with refresh rotation | ✅ Done |
| CORS configuration | ✅ Done |

---

*AI Business Copilot — A portfolio project demonstrating end-to-end AI product engineering.*
