#!/bin/bash

# ==========================================
# Lumina - Setup Script
# ==========================================

set -e

echo "🚀 Lumina Setup Script"
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from env.example...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ .env file created. Please update it with your credentials.${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Start services with Docker Compose
echo ""
echo -e "${YELLOW}🐳 Starting Docker services...${NC}"
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Install Node.js dependencies for API Gateway
echo ""
echo -e "${YELLOW}📦 Installing API Gateway dependencies...${NC}"
cd apps/api-gateway
npm install
npx prisma generate
npx prisma db push
cd ../..

# Install Node.js dependencies for Web
echo ""
echo -e "${YELLOW}📦 Installing Web dependencies...${NC}"
cd apps/web
npm install
cd ../..

# Install Python dependencies for NLP Engine
echo ""
echo -e "${YELLOW}🐍 Installing NLP Engine dependencies...${NC}"
cd apps/nlp-engine
python -m venv venv
source venv/bin/activate || source venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt
python -m spacy download pt_core_news_lg
python -m spacy download en_core_web_lg
cd ../..

echo ""
echo -e "${GREEN}=============================="
echo "✅ Setup completed successfully!"
echo "=============================="
echo ""
echo "To start all services, run:"
echo "  npm run dev (in apps/web)"
echo "  npm run dev (in apps/api-gateway)"
echo "  python main.py (in apps/nlp-engine)"
echo ""
echo "Or use Docker Compose:"
echo "  docker-compose up -d"
echo ""
echo "Access the app at: http://localhost:3000"
echo -e "${NC}"
