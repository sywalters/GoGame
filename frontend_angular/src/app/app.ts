import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './game-board/game-board';
import { GameControlsComponent } from './game-controls/game-controls';
import { GameApiService } from './game-api.service';
import { GameState, Player } from './types';

@Component({
  selector: 'app-root',
  imports: [CommonModule, GameBoardComponent, GameControlsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  gameState: GameState | null = null;
  loading = true;
  error: string | null = null;
  aiOpponentEnabled = false;
  aiDifficulty = 'medium';
  boardSize = 19;
  aiPassNotification = false;

  constructor(private gameApiService: GameApiService) {}

  ngOnInit() {
    this.loadGameState();
  }

  sanitizeLogMessage(value: unknown): string {
    const message = typeof value === 'string' ? value : String(value);
    return message.replace(/[\r\n]+/g, ' ');
  }

  loadGameState() {
    this.loading = true;
    this.error = null;
    this.gameApiService.getGameState().subscribe({
      next: (state) => {
        this.gameState = state;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load game state';
        this.loading = false;
        console.error('Error loading game state:', this.sanitizeLogMessage(err?.message ?? err));
      }
    });
  }

  handleMove(event: {row: number, col: number}) {
    if (!this.gameState) return;

    this.error = null;
    this.aiPassNotification = false;
    
    this.gameApiService.makeMove(event.row, event.col).subscribe({
      next: (response) => {
        this.gameState = response.game_state;
        
        // Auto-play AI move after a short delay if enabled and game hasn't ended
        if (
          this.aiOpponentEnabled &&
          response.game_state.current_player === Player.WHITE &&
          !response.game_state.game_ended
        ) {
          setTimeout(() => {
            this.handleAiMove(this.aiDifficulty);
          }, 1000);
        }
      },
      error: (err) => {
        this.error = err.error?.error || err.error?.detail || 'Failed to make move';
        console.error('Error making move:', this.sanitizeLogMessage(err?.message ?? err));
      }
    });
  }

  handleAiMove(difficulty: string) {
    this.gameApiService.aiMove(difficulty).subscribe({
      next: (response) => {
        this.gameState = response.game_state;
        if (response.ai_passed) {
          this.aiPassNotification = true;
          setTimeout(() => {
            this.aiPassNotification = false;
          }, 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to make AI move';
        console.error('Error making AI move:', this.sanitizeLogMessage(err?.message ?? err));
      }
    });
  }

  handlePass() {
    this.error = null;
    this.gameApiService.pass().subscribe({
      next: (response) => {
        this.gameState = response.game_state;
      },
      error: (err) => {
        this.error = 'Failed to pass turn';
        console.error('Error passing turn:', this.sanitizeLogMessage(err?.message ?? err));
      }
    });
  }

  handleNewGame(newBoardSize?: number) {
    this.error = null;
    this.aiPassNotification = false;
    const size = newBoardSize || this.boardSize;
    
    this.gameApiService.newGame(size).subscribe({
      next: (response) => {
        this.gameState = response.game_state;
        this.boardSize = size;
      },
      error: (err) => {
        this.error = 'Failed to start new game';
        console.error('Error starting new game:', this.sanitizeLogMessage(err?.message ?? err));
      }
    });
  }

  handleReset() {
    this.error = null;
    this.aiPassNotification = false;
    
    this.gameApiService.resetGame().subscribe({
      next: (response) => {
        this.gameState = response.game_state;
      },
      error: (err) => {
        this.error = 'Failed to reset game';
        console.error('Error resetting game:', this.sanitizeLogMessage(err?.message ?? err));
      }
    });
  }

  handleBoardSizeChange(newSize: number) {
    this.boardSize = newSize;
    this.handleNewGame(newSize);
  }

  toggleAiOpponent() {
    this.aiOpponentEnabled = !this.aiOpponentEnabled;
  }

  setAiDifficulty(difficulty: string) {
    this.aiDifficulty = difficulty;
  }

  // Expose Player enum to template
  Player = Player;
}
