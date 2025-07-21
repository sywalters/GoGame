# Go Game Web Application

A web-based implementation of the ancient board game Go (Weiqi/Baduk) with a TypeScript React frontend and Python FastAPI backend.

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
  - TypeScript React frontend
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
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx          # Main application
│   │   ├── api.ts           # API client
│   │   └── types.ts         # TypeScript types
│   ├── package.json         # Node dependencies
│   └── tsconfig.json        # TypeScript config
├── start_backend.sh         # Backend startup script
├── start_frontend.sh        # Frontend startup script
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

1. Make the frontend script executable:
```bash
chmod +x start_frontend.sh
```

2. Start the frontend development server:
```bash
./start_frontend.sh
```

This will:
- Install Node.js dependencies
- Start the React development server on http://localhost:3000

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

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Usage

1. Start both the backend and frontend servers
2. Open your browser to http://localhost:3000
3. Click on empty intersections to place stones
4. Use the control panel to:
   - Pass your turn
   - Reset the current game
   - Start a new game
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

The frontend uses:
- React with TypeScript
- CSS Grid for board layout
- Fetch API for backend communication
- Component-based architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
