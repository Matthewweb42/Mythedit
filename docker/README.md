# Docker Database Setup

This directory contains Docker Compose configuration for MythEdit's databases.

## Services

- **PostgreSQL** (Port 5432): Main relational database for users, projects, chapters
- **Neo4j** (Ports 7474, 7687): Graph database for knowledge graph
- **Redis** (Port 6379): Cache and job queue

## Quick Start

### Start all databases:
```bash
cd docker
docker-compose up -d
```

### Stop all databases:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Stop and remove all data (CAUTION):
```bash
docker-compose down -v
```

## Access Services

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **User**: mythuser
- **Password**: mythpass
- **Database**: mythedit_db

Connect via CLI:
```bash
docker exec -it mythedit-postgres psql -U mythuser -d mythedit_db
```

### Neo4j Browser
- **URL**: http://localhost:7474
- **Username**: neo4j
- **Password**: mythpass123

### Redis CLI
```bash
docker exec -it mythedit-redis redis-cli
```

## Health Checks

Check if all services are healthy:
```bash
docker-compose ps
```

All services should show `healthy` status.

## Troubleshooting

### PostgreSQL connection issues:
```bash
docker-compose logs postgres
```

### Neo4j not starting:
```bash
docker-compose logs neo4j
```

### Reset Neo4j password:
```bash
docker-compose down
docker volume rm docker_neo4j_data
docker-compose up -d
```
