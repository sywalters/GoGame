# Next.js Go Game Frontend

This is a Next.js 15 version of the Go game frontend, providing the same functionality as the React and Angular versions but built with the Next.js framework.

## Features

- Interactive Go board with multiple size options (9x9, 13x13, 19x19)
- AI opponent with configurable difficulty levels (Easy, Medium, Hard)
- Real-time game state management
- Move validation and capture detection
- Pass functionality and game ending detection
- Responsive design that works on desktop and mobile
- Server-side rendering capabilities with Next.js

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── GameBoard.tsx      # Game board component
│   ├── GameBoard.css      # Board styles
│   ├── GameControls.tsx   # Game controls component
│   └── GameControls.css   # Controls styles
├── lib/
│   └── api.ts            # API service for backend communication
├── types/
│   └── index.ts          # TypeScript interfaces and enums
└── styles/
    ├── App.css           # Application styles
    └── globals.css       # Global styles
```

## Development

### Quick Start Options

**Option 1: Using npm scripts**
```bash
npm run dev
```

**Option 2: Using the convenient shell script**
```bash
./start-dev.sh
```

**Option 3: Using Turbopack (faster builds)**
```bash
npm run dev:open
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:open` - Start with Turbopack for faster builds
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Backend Requirement

This frontend requires the Python FastAPI backend to be running on `http://localhost:8000`. Make sure to start the backend server before using the frontend.

## Key Features of Next.js Implementation

- **App Router**: Uses Next.js 15's App Router for modern routing
- **Server Components**: Leverages React Server Components where applicable
- **TypeScript**: Full TypeScript support for type safety
- **Tailwind CSS**: Integrated Tailwind CSS for utility-first styling
- **Turbopack**: Optional Turbopack support for faster development builds
- **SEO Friendly**: Built-in SEO optimizations with Next.js

## Differences from React/Angular Versions

- **Framework**: Built on Next.js 15 with React 19
- **Routing**: Uses file-based routing with App Router
- **Rendering**: Supports both client and server-side rendering
- **Build System**: Uses Next.js build system with Webpack/Turbopack
- **Deployment**: Can be deployed as static site or with server-side rendering

## Components

### GameBoard
Renders the interactive Go board with stones and handles click events for moves.

### GameControls  
Provides all game controls including:
- AI opponent toggle and difficulty settings
- Board size selection
- Game actions (Pass, Reset, New Game)
- Current player display
- Captured stones counter

### API Service
Handles all HTTP communication with the backend API endpoints using native fetch API.

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- CSS Modules
- Native Fetch API
