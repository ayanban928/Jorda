#!/bin/bash
echo "Starting Jorda Application..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
  echo "Starting PostgreSQL..."
  brew services start postgresql
  sleep 2
fi

# Check if database exists, create if not
if ! psql -lqt | cut -d \| -f 1 | grep -qw jorda; then
  echo "Creating database 'jorda'..."
  createdb jorda
fi

# Navigate to server directory
cd server

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing server dependencies..."
  npm install
fi

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Start backend server
echo "Starting backend server on port 3001..."
npm run dev &
BACKEND_PID=$!

# Navigate to client directory
cd ../client

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start frontend client
echo "Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Jorda is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait