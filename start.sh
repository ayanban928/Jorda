#!/bin/bash

echo "Starting backend server..."
cd server && npm run dev &

echo "Starting frontend client..."
cd client && npm run dev &

# Wait for both processes
wait
