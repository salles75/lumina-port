#!/bin/bash

# ==========================================
# Lumina - Development Script
# ==========================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Starting Lumina in development mode..."

# Start Docker services (PostgreSQL and Redis)
echo -e "${YELLOW}🐳 Starting Docker services (PostgreSQL, Redis)...${NC}"
docker-compose up -d postgres redis

# Wait for services to be ready
sleep 3

# Start NLP Engine in background
echo -e "${YELLOW}🐍 Starting NLP Engine...${NC}"
cd apps/nlp-engine
if [ -d "venv" ]; then
    source venv/bin/activate || source venv/Scripts/activate 2>/dev/null
fi
python main.py &
NLP_PID=$!
cd ../..

# Start API Gateway in background
echo -e "${YELLOW}📡 Starting API Gateway...${NC}"
cd apps/api-gateway
npm run dev &
API_PID=$!
cd ../..

# Start Web Frontend
echo -e "${YELLOW}🌐 Starting Web Frontend...${NC}"
cd apps/web
npm run dev &
WEB_PID=$!
cd ../..

echo ""
echo -e "${GREEN}=============================="
echo "✅ All services started!"
echo "=============================="
echo ""
echo "Services running:"
echo "  - Web Frontend:  http://localhost:3000"
echo "  - API Gateway:   http://localhost:4000"
echo "  - NLP Engine:    http://localhost:8000"
echo "  - PostgreSQL:    localhost:5432"
echo "  - Redis:         localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"
echo -e "${NC}"

# Wait for Ctrl+C
trap "kill $NLP_PID $API_PID $WEB_PID 2>/dev/null; docker-compose stop; exit 0" SIGINT SIGTERM

wait
