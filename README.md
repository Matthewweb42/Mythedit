# MythEdit - AI Story Continuity & Worldbuilding Assistant

An incremental, chapter-by-chapter analysis tool that builds a living knowledge graph of your story, catches inconsistencies, and helps maintain worldbuilding coherence across a multi-book series.

## 🎯 Core Features

- **Automatic Entity Extraction**: Characters, locations, objects, and factions
- **Knowledge Graph**: Visual relationship mapping between all story elements
- **Conflict Detection**: Catches contradictions in descriptions, timelines, and plot points
- **Timeline Construction**: Automatic chronological ordering of events
- **AI Suggestions**: Context-aware writing assistance and continuity prompts
- **Series Support**: Maintain consistency across multiple books

## 📋 Quick Start

### Prerequisites

Before starting, make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/downloads/)

**See [SETUP.md](SETUP.md) for detailed installation instructions.**

### 1. Start Databases

```bash
cd docker
docker compose up -d
```

Verify all services are healthy:
```bash
docker compose ps
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Backend runs on: http://localhost:3000

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### 4. NLP Service Setup

```bash
cd nlp-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_trf
uvicorn main:app --reload --port 8000
```

NLP service runs on: http://localhost:8000

## 🏗️ Architecture

```
┌─────────────┐
│   React     │  Frontend (Port 5173)
│  Frontend   │
└──────┬──────┘
       │
       ↓ REST/WebSocket
┌──────────────┐
│   Node.js    │  Backend API (Port 3000)
│   Backend    │
└──────┬───────┘
       │
       ├──→ PostgreSQL (Port 5432)  - User data, chapters
       ├──→ Neo4j (Port 7687)       - Knowledge graph
       ├──→ Redis (Port 6379)       - Queue/cache
       └──→ Python NLP (Port 8000)  - Entity extraction
```

## 📁 Project Structure

```
MythEdit/
├── frontend/          # React + TypeScript UI
├── backend/           # Node.js + Fastify API
├── nlp-service/       # Python NLP pipeline
├── docker/            # Database containers
├── docs/              # Documentation
└── story-continuity-assistant-requirements.md
```

## 🗄️ Database Access

### Neo4j Browser
- URL: http://localhost:7474
- Username: `neo4j`
- Password: `mythpass123`

### PostgreSQL
- Host: `localhost:5432`
- Database: `mythedit_db`
- Username: `mythuser`
- Password: `mythpass`

### Redis
```bash
docker exec -it mythedit-redis redis-cli
```

## 🔧 Development

### Running All Services

```bash
# Terminal 1: Databases
cd docker && docker compose up

# Terminal 2: NLP Service
cd nlp-service && source venv/bin/activate && uvicorn main:app --reload

# Terminal 3: Backend
cd backend && npm run dev

# Terminal 4: Backend Worker (for background jobs)
cd backend && npm run worker

# Terminal 5: Frontend
cd frontend && npm run dev
```

### Stopping Services

```bash
# Stop databases
cd docker && docker compose down

# Stop all other services: Ctrl+C in each terminal
```

## 📝 Usage Example

1. Create a new project in the UI
2. Upload a chapter (.docx, .txt, or .md)
3. Wait 30-60 seconds for analysis
4. View extracted entities in the Knowledge Graph
5. Review any detected conflicts
6. Continue with next chapter

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Python tests
cd nlp-service && pytest
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed installation instructions
- [Requirements](story-continuity-assistant-requirements.md) - Full project specification
- [Docker README](docker/README.md) - Database management

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Zustand (state management)
- TailwindCSS + Radix UI
- ReactFlow (graph visualization)
- D3.js (timeline visualization)

### Backend
- Node.js + Fastify
- Prisma (PostgreSQL ORM)
- Neo4j (graph database)
- Bull (job queue)

### NLP
- Python + FastAPI
- spaCy (NLP pipeline)
- GLiNER (entity extraction)
- fastcoref (coreference resolution)

### Infrastructure
- Docker + Docker Compose
- PostgreSQL 16
- Neo4j 5.15
- Redis 7

## 🚀 Roadmap

### Phase 1: MVP (Current)
- ✅ Basic chapter upload
- ✅ Entity extraction
- ✅ Simple conflict detection
- 🔄 Knowledge graph browsing
- 🔄 Timeline construction

### Phase 2: Advanced Features
- ⏳ Relationship mapping
- ⏳ Timeline conflict detection
- ⏳ Physical description tracking
- ⏳ Inline chapter annotations

### Phase 3: AI Assistance
- ⏳ Context-aware suggestions
- ⏳ Foreshadowing tracker
- ⏳ Pacing insights
- ⏳ Smart search queries

## 📄 License

[Choose your license - MIT, Apache 2.0, etc.]

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📧 Contact

- Project Lead: [Your Name]
- GitHub: https://github.com/Matthewweb42/Mythedit
- Issues: https://github.com/Matthewweb42/Mythedit/issues

---

**Status**: 🚧 In Development - MVP Phase
