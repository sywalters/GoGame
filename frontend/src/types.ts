export enum Player {
  EMPTY = 0,
  BLACK = 1,
  WHITE = 2
}

export interface GameState {
  board: number[][];
  current_player: Player;
  captured_stones: {
    black: number;
    white: number;
  };
  board_size: number;
  game_ended?: boolean;
  consecutive_passes?: number;
}

export interface MoveResponse {
  success: boolean;
  game_state: GameState;
}

export interface ApiResponse {
  success: boolean;
  game_state: GameState;
  ai_passed?: boolean;
  message?: string;
}
