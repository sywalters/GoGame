# Go Game Web Application

A web-based implementation of the ancient board game Go (Weiqi/Baduk) with both React and Angular frontends and a Python FastAPI backend.

## Features

- **Full Go Game Implementation**: Complete rule enforcement including:
  - Stone placement and capture
  - Ko rule prevention
  - Suicide move detection
  - Turn-based gameplay
  - Automatic game end detection (consecutive passes)
- **Multiple Board Sizes**: Support for standard Go board sizes:
  - 19×19 (Standard)
  - 13×13 (Medium)
  - 9×9 (Small)
  - Dynamic board size switching
- **AI Opponent**: Intelligent computer opponent with:
  - Three difficulty levels (Easy, Medium, Hard)
  - Strategic move evaluation
  - Opening game patterns
  - Endgame detection and passing logic
  - Visual notifications when AI passes
- **Interactive Web Interface**: 
  - Dynamic board rendering for any size
  - Click-to-place stones
  - Real-time game state updates
  - Score tracking (captured stones)
  - Game status indicators
  - Consecutive pass tracking
- **Game Controls**:
  - Pass turn
  - Reset game
  - New game with board size selection
  - AI opponent toggle and difficulty settings
- **User Experience Features**:
  - Game end notifications
  - AI pass notifications with animations
  - Visual feedback for game state
  - Responsive design
- **Modern Tech Stack**:
  - **Dual Frontend Options**: Choose between React or Angular
  - TypeScript React frontend (frontend_react)
  - Angular 20 frontend (frontend_angular)
  - Python FastAPI backend
  - REST API communication
  - Asynchronous AI processing

## Project Structure

```
GoGame/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── go_game.py           # Go game logic
│   └── requirements.txt     # Python dependencies
├── frontend_react/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx          # Main application
│   │   ├── api.ts           # API client
│   │   └── types.ts         # TypeScript types
│   ├── package.json         # Node dependencies
│   └── tsconfig.json        # TypeScript config
├── frontend_angular/        # Angular 20 frontend
│   ├── src/app/
│   │   ├── game-board/      # Board component
│   │   ├── game-controls/   # Controls component
│   │   ├── game-api.service.ts # HTTP service
│   │   ├── types.ts         # TypeScript types
│   │   └── app.ts           # Main app component
│   └── package.json         # Node dependencies
├── start_backend.sh         # Backend startup script
├── start_frontend.sh        # React frontend startup script
└── README.md               # This file
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm

## Setup and Installation

### Backend Setup

1. Make the backend script executable:
```bash
chmod +x start_backend.sh
```

2. Start the backend server:
```bash
./start_backend.sh
```

This will:
- Create a Python virtual environment
- Install required dependencies
- Start the FastAPI server on http://localhost:8000

### Frontend Setup

#### Interactive Frontend Launcher (Recommended)

1. Make the frontend script executable:
```bash
chmod +x start_frontend.sh
```

2. Run the interactive frontend launcher:
```bash
./start_frontend.sh
```

The script will prompt you to choose between:
- **Option 1**: React (TypeScript) on http://localhost:3000
- **Option 2**: Angular 20 on http://localhost:4200

#### Manual Frontend Setup

Alternatively, you can start each frontend manually:

**React Frontend:**
```bash
cd frontend_react
npm install
npm start
```

**Angular Frontend:**
```bash
cd frontend_angular
npm install
npm start
```

### Manual Setup

If you prefer manual setup:

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**React Frontend:**
```bash
cd frontend_react
npm install
npm start
```

**Angular Frontend:**
```bash
cd frontend_angular
npm install
npm start
```

## Usage

1. Start the backend server
2. Start your preferred frontend server:
   - React: http://localhost:3000
   - Angular: http://localhost:4200
3. Click on empty intersections to place stones
4. Use the control panel to:
   - Pass your turn
   - Reset the current game
   - Start a new game  
   - Toggle AI opponent and adjust difficulty
   - Change board size
5. The game tracks captured stones and enforces all Go rules

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /game/state` - Get current game state
- `POST /game/move` - Make a move (requires row, col)
- `POST /game/pass` - Pass the current turn
- `POST /game/new` - Start a new game
- `POST /game/reset` - Reset the current game

## Game Rules Implemented

- **Stone Placement**: Click empty intersections to place stones
- **Capture**: Stones or groups with no liberties are captured
- **Ko Rule**: Prevents immediate recapture of single stones
- **Suicide Prevention**: Illegal moves that would result in immediate capture
- **Turn-based Play**: Alternating between black and white players

## Development

### Backend Development

The backend uses:
- FastAPI for the web framework
- Pydantic for data validation
- Python enums for game states
- Object-oriented design for game logic

### Frontend Development

**React Frontend** (`frontend_react`):
- React 18 with TypeScript
- CSS Grid for board layout
- Fetch API for backend communication
- Component-based architecture with hooks

**Angular Frontend** (`frontend_angular`):
- Angular 20 with TypeScript
- CSS Grid for board layout
- HttpClient with RxJS observables
- Component-based architecture with services and dependency injection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
