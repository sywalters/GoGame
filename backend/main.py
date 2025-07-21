from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor
from go_game import GoGame
from ai_opponent import GoAI, Player

app = FastAPI(title="Go Game API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global game instance
game = GoGame(19)
executor = ThreadPoolExecutor(max_workers=1)

def get_ai_move_sync(ai, game_state):
    """Synchronous wrapper for AI move calculation"""
    try:
        return ai.get_move(game_state)
    except Exception as e:
        print(f"Error in AI move calculation: {e}")
        return None

class MoveRequest(BaseModel):
    row: int
    col: int
    player: Optional[str] = "human"

class AIMoveRequest(BaseModel):
    difficulty: Optional[str] = "medium"

class NewGameRequest(BaseModel):
    board_size: int = 19

@app.get("/")
async def root():
    return {"message": "Go Game API"}

@app.get("/game/state")
async def get_game_state():
    """Get current game state"""
    return game.get_board_state()

@app.post("/game/move")
async def make_move(move: MoveRequest):
    """Make a move on the board"""
    success = game.make_move(move.row, move.col)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid move")
    
    return {
        "success": True,
        "game_state": game.get_board_state()
    }

@app.post("/game/ai_move")
async def ai_move(request: AIMoveRequest):
    """Let the AI make a move with timeout"""
    # Check if game has ended
    if game.game_ended:
        print("Game has ended, AI cannot make a move")
        return {
            "success": True,
            "game_state": game.get_board_state(),
            "message": "Game has ended"
        }
    
    ai = GoAI(difficulty=request.difficulty, player=game.current_player)
    
    ai_passed = False
    try:
        # Run AI move calculation with timeout
        loop = asyncio.get_event_loop()
        ai_move = await asyncio.wait_for(
            loop.run_in_executor(executor, get_ai_move_sync, ai, game),
            timeout=10.0  # 10 second timeout
        )
        
        if ai_move:
            row, col = ai_move
            success = game.make_move(row, col)
            if not success:
                # If move is invalid, just pass
                game.pass_turn()
                ai_passed = True
        else:
            game.pass_turn()  # Pass turn if no move
            ai_passed = True
            
    except asyncio.TimeoutError:
        print("AI move calculation timed out, passing turn")
        game.pass_turn()
        ai_passed = True
    except Exception as e:
        print(f"Error in AI move: {e}")
        game.pass_turn()
        ai_passed = True

    return {
        "success": True,
        "game_state": game.get_board_state(),
        "ai_passed": ai_passed
    }

@app.post("/game/pass")
async def pass_turn():
    """Pass the current turn"""
    game.pass_turn()
    return {
        "success": True,
        "game_state": game.get_board_state()
    }

@app.post("/game/new")
async def new_game(request: NewGameRequest):
    """Start a new game"""
    global game
    game = GoGame(request.board_size)
    return {
        "success": True,
        "game_state": game.get_board_state()
    }

@app.post("/game/reset")
async def reset_game():
    """Reset the current game"""
    game.reset_game()
    return {
        "success": True,
        "game_state": game.get_board_state()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
