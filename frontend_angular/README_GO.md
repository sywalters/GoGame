# Angular Go Game Frontend

This is an Angular version of the Go game frontend, providing the same functionality as the React version but built with Angular 20.

## Features

- Interactive Go board with multiple size options (9x9, 13x13, 19x19)
- AI opponent with configurable difficulty levels (Easy, Medium, Hard)
- Real-time game state management
- Move validation and capture detection
- Pass functionality and game ending detection
- Responsive design that works on desktop and mobile

## Project Structure

```
src/
├── app/
│   ├── game-api.service.ts      # HTTP service for backend communication
│   ├── types.ts                 # TypeScript interfaces and enums
│   ├── game-board/             # Game board component
│   │   ├── game-board.ts
│   │   ├── game-board.html
│   │   └── game-board.css
│   ├── game-controls/          # Game controls component
│   │   ├── game-controls.ts
│   │   ├── game-controls.html
│   │   └── game-controls.css
│   ├── app.ts                  # Main app component
│   ├── app.html
│   ├── app.css
│   └── app.config.ts           # App configuration
└── styles.css                  # Global styles
```

## Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Backend Requirement

This frontend requires the Python FastAPI backend to be running on `http://localhost:8000`. Make sure to start the backend server before using the frontend.

## Key Differences from React Version

- **State Management**: Uses Angular's built-in reactive forms and component state instead of React hooks
- **HTTP Client**: Uses Angular's HttpClient service with RxJS observables instead of fetch API
- **Styling**: Same CSS styles but organized in component-specific files
- **Template Syntax**: Uses Angular template syntax with directives like `*ngIf`, `*ngFor`, and event binding with `()`
- **Component Architecture**: Uses Angular components with decorators and dependency injection

## Components

### GameBoardComponent
Renders the interactive Go board with stones and handles click events for moves.

### GameControlsComponent  
Provides all game controls including:
- AI opponent toggle and difficulty settings
- Board size selection
- Game actions (Pass, Reset, New Game)
- Current player display
- Captured stones counter

### GameApiService
Handles all HTTP communication with the backend API endpoints.

## Technologies Used

- Angular 20
- TypeScript
- RxJS
- Angular HttpClient
- CSS Grid for board layout
