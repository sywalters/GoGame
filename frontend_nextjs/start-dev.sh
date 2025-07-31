#!/bin/bash

# Start Next.js Development Server
# This script will start the Next.js dev server

echo "🚀 Starting Next.js Development Server..."
echo "📁 Working directory: $(pwd)"
echo "🌐 Server will be available at: http://localhost:3000"
echo ""

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔥 Starting server..."
npm run dev
