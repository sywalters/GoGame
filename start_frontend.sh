#!/bin/bash

echo "Go Game Frontend Launcher"
echo "========================"
echo

# Prompt user to choose frontend
echo "Please choose which frontend to start:"
echo "1) React (TypeScript) - http://localhost:3000"
echo "2) Angular 20 - http://localhost:4200"
echo
read -p "Enter your choice (1 or 2): " choice
echo

case $choice in
    1)
        echo "Starting React Frontend..."
        FRONTEND_DIR="frontend_react"
        FRONTEND_NAME="React"
        PORT="3000"
        ;;
    2)
        echo "Starting Angular Frontend..."
        FRONTEND_DIR="frontend_angular"
        FRONTEND_NAME="Angular"
        PORT="4200"
        ;;
    *)
        echo "Invalid choice. Please run the script again and choose 1 or 2."
        exit 1
        ;;
esac

# Check if the chosen frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: $FRONTEND_DIR directory not found!"
    echo "Please make sure both frontend directories exist."
    exit 1
fi

# Navigate to chosen frontend directory
cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies for $FRONTEND_NAME..."
    npm install
fi

# Start the development server
echo "Starting $FRONTEND_NAME development server on http://localhost:$PORT..."
echo "Press Ctrl+C to stop the server"
echo
npm start
