#!/bin/bash

# Start Angular Development Server
# This script will start the Angular dev server and open it in your default browser

echo "🚀 Starting Angular Development Server..."
echo "📁 Working directory: $(pwd)"
echo "🌐 Server will be available at: http://localhost:4200"
echo ""

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server with browser auto-open
echo "🔥 Starting server..."
npm run dev
