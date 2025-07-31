#!/bin/bash

# Build Next.js for Production
# This script will build the Next.js app for production deployment

echo "🏗️  Building Next.js for Production..."
echo "📁 Working directory: $(pwd)"
echo ""

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build for production
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "You can now:"
    echo "1. Start production server: npm start"
    echo "2. Deploy the .next directory to your hosting provider"
else
    echo ""
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
