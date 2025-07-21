import { GameState, MoveResponse, ApiResponse } from './types';

const API_BASE_URL = 'http://localhost:8000';

export class GameApi {
  static async getGameState(): Promise<GameState> {
    const response = await fetch(`${API_BASE_URL}/game/state`);
    if (!response.ok) {
      throw new Error('Failed to get game state');
    }
    return response.json();
  }

  static async makeMove(row: number, col: number): Promise<MoveResponse> {
    const response = await fetch(`${API_BASE_URL}/game/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ row, col }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to make move');
    }
    
    return response.json();
  }

  static async pass(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/game/pass`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to pass turn');
    }
    
    return response.json();
  }

  static async newGame(boardSize: number = 19): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/game/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board_size: boardSize }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to start new game');
    }
    
    return response.json();
  }

  static async resetGame(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/game/reset`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset game');
    }
    
    return response.json();
  }
  static async aiMove(difficulty: string = "medium"): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/game/ai_move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty }),
    });

    if (!response.ok) {
      throw new Error('Failed to make AI move');
    }

    return response.json();
  }
}
