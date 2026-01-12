# MythEdit Setup Guide

## Prerequisites Installation

### 1. Install Docker Desktop

Docker is required to run the database services (PostgreSQL, Neo4j, Redis).

**Download and Install:**
1. Visit: https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Windows
3. Run the installer
4. Restart your computer when prompted
5. Launch Docker Desktop and wait for it to start

**Verify Installation:**
Open PowerShell or Command Prompt and run:
```bash
docker --version
docker compose version
```

You should see version numbers for both commands.

### 2. Install Node.js

**Download and Install:**
1. Visit: https://nodejs.org/
2. Download the LTS version (20.x or newer)
3. Run the installer (accept all defaults)

**Verify Installation:**
```bash
node --version
npm --version
```

### 3. Install Python

**Download and Install:**
1. Visit: https://www.python.org/downloads/
2. Download Python 3.11 or newer
3. **IMPORTANT**: Check "Add Python to PATH" during installation
4. Run the installer

**Verify Installation:**
```bash
python --version
pip --version
```

## Getting Started

### Step 1: Start the Databases

Open PowerShell or Command Prompt (NOT Git Bash) and navigate to the docker folder:

```bash
cd C:\Coding\MythEdit\docker
docker compose up -d
```

Wait for all containers to start (about 30-60 seconds).

**Check Status:**
```bash
docker compose ps
```

All services should show as "healthy" or "running".

**View Logs (if needed):**
```bash
docker compose logs -f
```

### Step 2: Access the Databases

#### Neo4j Browser
1. Open browser: http://localhost:7474
2. Login:
   - Username: `neo4j`
   - Password: `mythpass123`
3. You should see the Neo4j Browser interface

#### PostgreSQL
Connect using any PostgreSQL client with:
- Host: `localhost`
- Port: `5432`
- Username: `mythuser`
- Password: `mythpass`
- Database: `mythedit_db`

Or test via Docker CLI:
```bash
docker exec -it mythedit-postgres psql -U mythuser -d mythedit_db
```

#### Redis
Test connection:
```bash
docker exec -it mythedit-redis redis-cli ping
```

Should respond with: `PONG`

### Step 3: Setup Backend (Node.js)

```bash
cd C:\Coding\MythEdit\backend
npm init -y
npm install fastify @fastify/cors @fastify/multipart @fastify/websocket
npm install prisma @prisma/client bull bullmq neo4j-driver ioredis
npm install mammoth axios zod
npm install -D typescript @types/node tsx nodemon
npm install -D @types/bull @types/neo4j-driver

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init
```

### Step 4: Setup Frontend (React)

```bash
cd C:\Coding\MythEdit\frontend
npm create vite@latest . -- --template react-ts
npm install

# Install dependencies
npm install zustand immer @tanstack/react-query axios
npm install reactflow d3 @types/d3
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-highlight
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install react-dropzone react-hook-form zod
```

### Step 5: Setup Python NLP Service

```bash
cd C:\Coding\MythEdit\nlp-service
python -m venv venv

# Activate virtual environment
# On Windows Command Prompt:
venv\Scripts\activate.bat
# On Windows PowerShell:
venv\Scripts\Activate.ps1

# Install dependencies
pip install fastapi uvicorn[standard] pydantic
pip install spacy spacy-transformers
pip install gliner fastcoref
pip install python-dateutil

# Download spaCy model (this will take a few minutes)
python -m spacy download en_core_web_trf
```

## Next Steps

Once all prerequisites are installed:

1. ✅ Databases running in Docker
2. ✅ Backend dependencies installed
3. ✅ Frontend dependencies installed
4. ✅ Python NLP dependencies installed

Continue to development setup in the README.md file.

## Stopping Services

To stop the databases:
```bash
cd C:\Coding\MythEdit\docker
docker compose down
```

To stop and remove all data (CAUTION - deletes everything):
```bash
docker compose down -v
```

## Troubleshooting

### Docker Desktop not starting
- Make sure WSL 2 is enabled (Windows Subsystem for Linux)
- Check Windows features: Hyper-V and Windows Hypervisor Platform
- Restart your computer

### Docker containers fail to start
- Check if ports 5432, 6379, 7474, or 7687 are already in use
- Run: `netstat -ano | findstr "5432"` to check port usage
- Close any applications using those ports

### Python not found
- Make sure you checked "Add Python to PATH" during installation
- Restart your terminal/PowerShell after installation

### npm not found
- Restart your terminal after installing Node.js
- Verify Node.js installation in System Environment Variables

## Support

If you encounter issues:
1. Check the logs: `docker compose logs [service-name]`
2. Restart Docker Desktop
3. Verify all prerequisites are installed correctly
