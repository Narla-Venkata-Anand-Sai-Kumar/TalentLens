#!/bin/bash

# TalentLens Development Startup Script
echo "🎯 Starting TalentLens Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if required directories exist
if [ ! -d "clients" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: clients or backend directory not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo -e "${BLUE}📋 Checking system status...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed!${NC}"
    exit 1
fi

# Check ports
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use (Frontend)${NC}"
fi

if check_port 8001; then
    echo -e "${YELLOW}⚠️  Port 8001 is already in use (Backend)${NC}"
fi

echo -e "${GREEN}✅ System checks passed!${NC}"

# Start backend
echo -e "${BLUE}🚀 Starting Django backend server...${NC}"
cd backend
if [ ! -d "venv" ]; then
    echo -e "${RED}❌ Virtual environment not found!${NC}"
    echo "Please run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment and start server in background
source venv/bin/activate
echo -e "${YELLOW}📦 Activating Python virtual environment...${NC}"
python manage.py runserver 8001 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID) on http://localhost:8001${NC}"

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${BLUE}🚀 Starting Next.js frontend server...${NC}"
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend server in background
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID) on http://localhost:3000${NC}"

echo ""
echo -e "${GREEN}🎉 TalentLens is now running!${NC}"
echo ""
echo -e "${BLUE}📡 Services:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:8001${NC}"
echo -e "   Test Page: ${GREEN}http://localhost:3000/test${NC}"
echo -e "   API Test:  ${GREEN}http://localhost:8001/api/auth/test/${NC}"
echo ""
echo -e "${YELLOW}📝 Useful Commands:${NC}"
echo -e "   View logs: tail -f backend/django.log"
echo -e "   Stop servers: kill $BACKEND_PID $FRONTEND_PID"
echo -e "   Or press Ctrl+C to stop this script"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped. Goodbye!${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for user to stop the script
echo -e "${BLUE}Press Ctrl+C to stop both servers...${NC}"
wait
