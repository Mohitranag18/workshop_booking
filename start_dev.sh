#!/bin/bash

# Workshop Booking System - Development Startup Script

echo "🚀 Starting Workshop Booking System..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo "📡 Starting Django backend server..."
cd backend
python manage.py runserver 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "⚛️  Starting React frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting up..."
echo "🌐 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"
echo "📊 API: http://localhost:8000/api/"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
