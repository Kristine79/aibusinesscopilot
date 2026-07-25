# AI Business Copilot

> AI-powered platform for business process analysis and automation discovery.

---

## Product Overview

**Problem:** Small and medium businesses struggle to identify which processes can be automated with AI. They lack the technical expertise to evaluate automation opportunities and create implementation roadmaps.

**Solution:** A full-stack AI platform that conducts intelligent business diagnostics, generates detailed automation reports with AI-powered recommendations, and delivers results via web dashboard and Telegram.

**Target Users:** Business owners, operations managers, and consultants looking to leverage AI for operational efficiency.

**Business Value:** Reduces the time to identify and plan AI automation from weeks to minutes. Provides structured, actionable insights without requiring technical expertise.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **AI Business Diagnostics** | Multi-step form collects business context, processes, and pain points |
| **AI Reports** | LLM-powered analysis generates automation opportunities with priority and roadmap |
| **Telegram Automation** | Full diagnostic flow via Telegram bot with aiogram 3 FSM |
| **Knowledge Base** | Document upload with chunking and vector search |
| **RAG Chat** | Context-aware Q&A over uploaded documents using retrieval-augmented generation |
| **AI Agents** | Multi-agent orchestration for complex business analysis tasks |
| **Admin Dashboard** | Lead management, report history, analytics, knowledge base UI |
| **Analytics** | Aggregate statistics on leads, reports, events, and business type distribution |

---

## Architecture

```
                         ┌─────────────────┐
                         │    Frontend      │
                         │  React 19 + Vite │
                         │  Tailwind/shadcn │
                         └────────┬────────┘
                                  │ HTTP/REST
                         ┌────────▼────────┐
                         │  FastAPI Layer   │
                         │  (API Gateway)   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
             ┌──────▼────┐ ┌──────▼────┐ ┌──────▼──────┐
             │  Business  │ │   AI      │ │  Knowledge   │
             │  Services  │ │ Services  │ │  (RAG)       │
             │ (Leads,    │ │ (Analysis,│ │ (Documents,  │
             │  Auth,     │ │  Agents,  │ │  Chunks,     │
             │  Workspace)│ │  Embed)   │ │  Search)     │
             └──────┬─────┘ └──────┬────┘ └──────┬───────┘
                    │             │             │
             ┌──────▼─────────────▼──────────────▼───────┐
             │            AI Orchestration Layer          │
             │  ┌──────────┐ ┌──────────┐ ┌────────────┐ │
             │  │  OpenAI  │ │OpenRouter│ │ Embeddings  │ │
             │  │  GPT-4o  │ │  Claude  │ │ text-embed │ │
             │  └──────────┘ └──────────┘ │ -3-small   │ │
             │                            └────────────┘ │
             └──────────────────┬─────────────────────────┘
                                │
             ┌──────────────────▼─────────────────────────┐
             │         PostgreSQL 16 + pgvector            │
             │  Users · Leads · Reports · Analytics        │
             │  Documents · Embeddings · Workspaces        │
             └────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │  Telegram Bot    │
                         │  aiogram 3       │
                         └─────────────────┘
```

---

## AI Architecture

### AI Provider Abstraction

All AI operations go through abstract interfaces:

```python
class AIProvider(ABC):
    async def generate_completion(prompt) -> str ...
    async def generate_structured_response(prompt, schema) -> BaseModel ...

class EmbeddingProvider(ABC):
    async def embed(text) -> list[float] ...
    async def embed_batch(texts) -> list[list[float]] ...
```

**Implementations:**
- `OpenAIProvider` — GPT-4o / GPT-4o-mini for text generation
- `OpenRouterProvider` — Claude, Gemini, and other models via OpenRouter
- `OpenAIEmbeddingProvider` — text-embedding-3-small for vector embeddings
- `MockEmbeddingProvider` — fallback for development without API keys

### RAG Pipeline

```
Document Upload → Text Chunking (500 chars) → OpenAI Embedding
→ Store in PostgreSQL (JSON array)
→ Query: Embed user question → Cosine Similarity Search
→ Top 5 chunks → LLM with context → Answer + Sources
```

### Agent Orchestration

```
POST /api/agents/analyze
  → Orchestrator runs agents sequentially:
    1. StrategyAgent — analyzes business strategy
    2. ResearchAgent — researches automation opportunities
  → Each agent stores execution in agent_runs table
  → Returns aggregated results with per-agent status
```

---

## Engineering Approach

### AI-Assisted Engineering Workflow

This project was built using a structured AI-assisted engineering process:

1. **Architecture-first** — System design documented before code (see ARCHITECTURE.md)
2. **AI-assisted coding** — LLMs used for implementation, not decision-making
3. **Human review** — Every AI-generated change reviewed for correctness
4. **Production validation** — Docker, Alembic migrations, rate limiting, security headers
5. **Documentation-driven** — README, architecture docs, and case studies maintained alongside code

### Key Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| **FastAPI** | Async-native, automatic OpenAPI docs, Pydantic integration |
| **SQLAlchemy 2.0 async** | Production-grade ORM with async PostgreSQL support |
| **pgvector-ready** | Architecture supports native vector search (current: JSON + cosine similarity) |
| **Provider pattern** | AI providers are swappable via env var — no code changes |
| **Modular monolith** | Business logic in isolated modules (auth, workspace, agents, knowledge) |
| **REST API-first** | All functionality accessible via API — web and Telegram share the same backend |

---

## Production Status

### Completed

- Core platform (FastAPI + React SPA)
- AI layer (OpenAI, OpenRouter, structured outputs)
- RAG Knowledge Base (document upload, chunking, semantic search)
- AI Agents (multi-agent orchestration)
- Telegram bot (full diagnostic flow)
- Auth system (JWT, refresh tokens, role-based)
- Workspace system (multi-tenant)
- Admin dashboard (leads, reports, analytics, knowledge base)
- Docker Compose (4 services)
- Database migrations (Alembic)
- Production hardening (rate limiting, security headers, structured logging)

### Remaining for Production

- Real pgvector native column type (currently JSON + cosine similarity)
- Horizontal scaling (workers, queue system)
- Extended monitoring (Prometheus, Grafana)
- CI/CD pipeline
- Additional AI providers and embedding models

---

## Quick Start

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env — add API keys (OPENAI_API_KEY required for AI features)

# 2. Start with Docker
docker compose up --build

# 3. Run database migrations
docker compose exec backend alembic upgrade head
```

Services will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs
- **Telegram Bot:** runs when TELEGRAM_BOT_TOKEN is set

---

## Demo Scenario

```
User enters business information (web form or Telegram)
  ↓
AI diagnostics collects: business type, team size, processes, tools
  ↓
AI analysis generates automation opportunities with priorities
  ↓
Structured report with implementation roadmap
  ↓
Report accessible via web dashboard or Telegram link
```

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Python, FastAPI, SQLAlchemy 2.0 async, Alembic |
| Database | PostgreSQL 16, pgvector |
| AI | OpenAI API, OpenRouter API, text-embedding-3-small |
| Bot | aiogram 3 (FSM, inline keyboards, callback handlers) |
| Infra | Docker, docker-compose, gunicorn + uvicorn workers |

---

## Project Structure

```
/
├── frontend/           React 19 SPA with shadcn/ui components
├── backend/            FastAPI async server with modular architecture
│   ├── app/
│   │   ├── api/v1/     REST endpoint definitions
│   │   ├── core/       Configuration, security, middleware
│   │   ├── database/   SQLAlchemy models, session, Alembic
│   │   └── modules/    Business logic: auth, workspace, agents,
│   │                       leads, ai, analytics, knowledge
│   ├── alembic/        Database migrations
│   └── tests/          Pytest async tests
├── telegram-bot/       aiogram 3 bot (FSM diagnostic flow)
└── docker-compose.yml  Multi-service orchestration
```

---

## License

MIT
