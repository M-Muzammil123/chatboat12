#!/bin/bash

# Kill previous
pkill -f uvicorn
pkill -f "npm run dev"
pkill -f next-server

# Ensure we are in the script's directory (study_visa_bot)
cd "$(dirname "$0")"

# Start Backend
echo "Starting Backend..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "Study Visa Bot is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"

wait $BACKEND_PID $FRONTEND_PID
