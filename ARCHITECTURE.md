# Architecture

## Overview

AI Business Copilot — SaaS-платформа с микросервисной архитектурой, ориентированная на extensibility.

### Core Principles

1. **AI Provider Abstraction** — любая AI-модель подключается через единый интерфейс
2. **Module Isolation** — каждый бизнес-модуль независим (leads, ai, analytics, knowledge)
3. **API-First** — все функции доступны через REST API
4. **Multi-Channel** — Web + Telegram из одного backend
5. **RAG-Ready** — встроенная поддержка Retrieval-Augmented Generation

---

## System Architecture

### Phase 1 & 2 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                              │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────────┐ │
│  │  React   │  │  Telegram  │  │  Admin Dashboard         │ │
│  │  Landing │  │    Bot     │  │  (Leads/Reports/Analytics)│ │
│  └────┬─────┘  └─────┬──────┘  └───────────┬──────────────┘ │
└───────┼──────────────┼──────────────────────┼────────────────┘
        │              │                      │
        ▼              ▼                      ▼
┌───────────────────────────────────────────────────────────────┐
│                     FastAPI Gateway                            │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │ Health │ │ Leads  │ │ Analyze  │ │ Knowledge (RAG)      │ │
│  │ /api   │ │ /api   │ │ /api     │ │ /api/knowledge/*     │ │
│  └────────┘ └────────┘ └──────────┘ └──────────────────────┘ │
└──────────────────────────┬────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────────┐
        ▼                  ▼                      ▼
┌──────────────┐ ┌──────────────────┐ ┌────────────────────┐
│  PostgreSQL  │ │   AI Providers   │ │  Document Store    │
│  (Data)      │ │  (OpenAI/OpenRouter) │  (Knowledge Base) │
└──────────────┘ └──────────────────┘ └────────────────────┘
```

### Data Flow

```
Diagnostic Flow:
  Client → POST /api/leads/diagnostic → Create User + Profile + Lead
         → POST /api/analyze/{user_id} → AI analysis → Save Report
         → Response with report_id → Client views report

RAG Chat Flow:
  Client → POST /api/knowledge/chat
         → 1. Embed query (mock → real embeddings)
         → 2. Search similar document chunks
         → 3. Build context from chunks
         → 4. Call LLM with context + question
         → 5. Return answer + sources

Telegram Bot Flow:
  /start → greeting → "Начать диагностику"
         → FSM: name → business_type → problem_processes
         → POST /api/users + POST /api/leads + POST /api/analyze
         → Send report link + buttons
```

---

## Database Schema

### Phase 1 Tables

```
users
├── id: int (PK)
├── name: str
├── email: str (unique, indexed)
├── telegram_username: str?
├── created_at: datetime
└── updated_at: datetime?

business_profiles
├── id: int (PK)
├── user_id: int (FK → users, unique)
├── company_name: str
├── business_type: str
├── team_size: int
├── created_at: datetime
└── updated_at: datetime?

leads
├── id: int (PK)
├── user_id: int (FK → users, indexed)
├── status: str (indexed: new, in_progress, completed, archived)
├── created_at: datetime
└── updated_at: datetime?

automation_reports
├── id: int (PK)
├── user_id: int (FK → users, indexed)
├── lead_id: int? (FK → leads, indexed)
├── report_json: jsonb
├── created_at: datetime
└── updated_at: datetime?

analytics_events
├── id: int (PK)
├── event_name: str (indexed)
├── event_data: jsonb
├── created_at: datetime
└── updated_at: datetime?
```

### Phase 2 Tables (RAG)

```
knowledge_documents
├── id: int (PK)
├── title: str (unique)
├── content: text
├── doc_type: str (markdown, txt, pdf)
├── created_at: datetime
└── updated_at: datetime?

document_embeddings
├── id: int (PK)
├── document_id: int (FK → knowledge_documents, CASCADE, indexed)
├── embedding: jsonb (vector of floats)
├── chunk_text: text
├── chunk_index: int
├── created_at: datetime
└── updated_at: datetime?
```

---

## AI Layer

### Provider Interface

```python
class AIProvider(ABC):
    async def generate_completion(self, prompt: str, **kwargs) -> str: ...
    async def generate_structured_response(
        self, prompt: str, response_schema: Type[BaseModel], **kwargs
    ) -> BaseModel: ...
```

### Implementations

| Provider | API | Models | Timeout | Retries |
|----------|-----|--------|---------|---------|
| OpenAIProvider | OpenAI API | gpt-4o, gpt-4o-mini | 30s | 2 |
| OpenRouterProvider | OpenRouter API | Любые модели | 30s | 2 |

### RAG Pipeline

```
1. Document Ingestion:
   Document → Chunking (500 chars) → Mock Embedding → Store in DB

2. Query Flow:
   User Query → Embed query → Cosine Similarity Search
   → Top 5 chunks → Build context → LLM with context → Answer

3. Future: Replace mock embeddings with:
   - OpenAI Embeddings API (text-embedding-3-small)
   - pgvector for native vector search
   - GIN index on content for hybrid search
```

---

## Module Structure

```
modules/
├── leads/          # Lead management, CRUD
│   ├── schemas.py     # Pydantic models (DiagnosticData, LeadRead, etc.)
│   ├── service.py     # Business logic + diagnostic submission
│   └── repository.py  # DB operations
├── ai/             # AI orchestration
│   ├── interfaces.py  # AIProvider ABC
│   ├── providers.py   # OpenAI, OpenRouter (cached singleton)
│   ├── prompts.py     # Prompt templates
│   ├── service.py     # Analysis orchestration
│   └── schemas.py     # Analysis schemas (AnalysisResult, etc.)
├── analytics/      # Event tracking, stats
│   ├── service.py
│   └── schemas.py
└── knowledge/      # RAG Knowledge Base
    ├── schemas.py     # DocumentCreate, ChatQuery, etc.
    └── service.py     # Document ingestion, similarity search, chat
```

---

## API Endpoints

### Phase 1

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check with DB status |
| POST | /api/leads | Create lead |
| POST | /api/leads/diagnostic | Submit full diagnostic |
| GET | /api/leads | List leads (with user info) |
| PATCH | /api/leads/{id} | Update lead status |
| POST | /api/analyze/{user_id} | Run AI analysis |
| GET | /api/reports/{id} | Get report |
| GET | /api/reports | List reports |
| GET | /api/analytics/summary | Analytics summary |

### Phase 2 (RAG)

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/knowledge/documents | Upload document |
| GET | /api/knowledge/documents | List documents |
| DELETE | /api/knowledge/documents/{id} | Delete document |
| POST | /api/knowledge/reindex | Reindex all documents |
| POST | /api/knowledge/chat | RAG Chat query |

---

## Security

- CORS configured via `BACKEND_CORS_ORIGINS`
- JWT token support (ready, not enforced on all endpoints)
- AI Provider API keys stored in environment variables
- Passwords hashed via bcrypt (via passlib)
- SQLAlchemy ORM prevents SQL injection
- Rate limiting recommended for production (not yet implemented)

---

## Future Phases

| Phase | Features |
|-------|----------|
| **Phase 2** | ✅ RAG Knowledge Base, Document Upload, AI Chat |
| **Phase 3** | AI Consultants, Multi-niche Support, Auth |
| **Phase 4** | Educational Content, Marketplace |

---

## Deployment

```bash
# Development
docker compose up --build

# Production
docker compose -f docker-compose.yml up --build -d

# With custom env
docker compose --env-file .env.production up -d
```

### Production Checklist

- [ ] Replace `create_all` with Alembic migrations
- [ ] Add authentication middleware
- [ ] Add rate limiting
- [ ] Replace mock embeddings with real embeddings
- [ ] Use production-grade WSGI (gunicorn + uvicorn workers)
- [ ] Frontend production build (npm run build)
- [ ] Add `.dockerignore` files
- [ ] Configure logging aggregation
- [ ] Add monitoring and alerting