# MythEdit Quick Start Guide

## ✅ What's Already Set Up

You've successfully completed the initial setup! Here's what's running:

### Databases (Docker) ✅
- **PostgreSQL** - localhost:5432 (User: mythuser, Pass: mythpass, DB: mythedit_db)
- **Neo4j** - localhost:7474 (Browser UI) & localhost:7687 (Bolt)
  - Username: `neo4j`
  - Password: `mythpass123`
- **Redis** - localhost:6379

### Backend (Node.js) ✅
- Fastify API server configured
- Prisma ORM set up with database schema
- TypeScript configured
- Basic health check endpoint

### Frontend (React) ✅
- Vite + React + TypeScript
- Tailwind CSS configured
- Environment variables set up
- Test UI with backend connection check

## 🚀 How to Run Everything

### Start Databases (if not running)
```bash
cd docker
docker compose up -d
```

###Start the Backend
Open a new terminal:
```bash
cd backend
npm run dev
```

Backend will run on **http://localhost:3000**

### Start the Frontend
Open another terminal:
```bash
cd frontend
npm run dev
```

Frontend will run on **http://localhost:5173**

### View the Application
Open your browser to: **http://localhost:5173**

You should see the MythEdit dashboard showing:
- ✅ Frontend status
- ✅ Backend API status (connected to your API)
- ✅ Database status

## 🧪 Test the Setup

### Test Backend API Directly
```bash
# Health check
curl http://localhost:3000/health

# Test endpoint
curl http://localhost:3000/api/test
```

### Access Neo4j Browser
1. Open http://localhost:7474
2. Login with:
   - Username: `neo4j`
   - Password: `mythpass123`
3. You should see the Neo4j Browser interface

### Check Database Connection
```bash
# PostgreSQL
cd docker
docker exec mythedit-postgres psql -U mythuser -d mythedit_db -c "SELECT version();"

# Redis
docker exec mythedit-redis redis-cli ping
# Should return: PONG
```

## 📋 Next Steps: Python NLP Service

The last component to set up is the Python NLP service. Here's how:

### 1. Create Python Virtual Environment
```bash
cd nlp-service
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows Command Prompt:**
```bash
venv\Scripts\activate.bat
```

**Windows PowerShell:**
```bash
venv\Scripts\Activate.ps1
```

**Git Bash / WSL:**
```bash
source venv/bin/activate
```

### 3. Create requirements.txt
```bash
# This file will be created with necessary dependencies
```

### 4. Install Dependencies
```bash
pip install fastapi uvicorn[standard] pydantic
pip install spacy spacy-transformers
pip install gliner fastcoref
pip install python-dateutil
```

### 5. Download spaCy Model
```bash
python -m spacy download en_core_web_trf
```
⚠️ This downloads a ~400MB model and may take several minutes

### 6. Create main.py
```bash
# Basic NLP service will be created next
```

### 7. Run NLP Service
```bash
uvicorn main:app --reload --port 8000
```

NLP service will run on **http://localhost:8000**

## 🛑 Stopping Everything

### Stop Frontend & Backend
Press `Ctrl+C` in each terminal

### Stop Databases
```bash
cd docker
docker compose down
```

### Deactivate Python Virtual Environment
```bash
deactivate
```

## 📊 Ports Used

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Neo4j Browser | 7474 | http://localhost:7474 |
| Neo4j Bolt | 7687 | bolt://localhost:7687 |
| Redis | 6379 | localhost:6379 |
| Python NLP | 8000 | http://localhost:8000 (not yet set up) |

## 🔧 Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Make sure .env file exists in backend folder
- Run `npm install` again in backend folder

### Frontend won't connect to backend
- Make sure backend is running on port 3000
- Check VITE_API_URL in frontend/.env
- Check browser console for errors

### Database connection errors
- Make sure Docker containers are running: `docker compose ps`
- Check Docker Desktop is running
- Restart containers: `docker compose restart`

### Neo4j password issues
- Delete the volume and restart:
  ```bash
  docker compose down -v
  docker compose up -d
  ```

## 📁 Project Structure

```
MythEdit/
├── backend/          ← Node.js API (Port 3000)
│   ├── src/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env
├── frontend/         ← React App (Port 5173)
│   ├── src/
│   │   └── App.tsx
│   └── .env
├── nlp-service/      ← Python NLP (Port 8000) - To be set up
├── docker/           ← Database containers
│   └── docker-compose.yml
└── docs/
```

## 🎯 Current Status

| Component | Status |
|-----------|--------|
| Docker Databases | ✅ Running |
| Backend API | ✅ Configured |
| Frontend UI | ✅ Running |
| Python NLP | ⏳ Next step |
| Git Repository | ✅ Initialized |

---

**You're ready to start development!** 🎉

The foundation is set up. Next, you'll create the Python NLP service and then start building the core features like chapter upload and entity extraction.
