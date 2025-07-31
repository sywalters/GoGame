import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../types';

@Component({
  selector: 'app-game-controls',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-controls.html',
  styleUrl: './game-controls.css'
})
export class GameControlsComponent {
  @Input() currentPlayer: Player = Player.BLACK;
  @Input() capturedStones: { black: number; white: number } = { black: 0, white: 0 };
  @Input() aiOpponentEnabled: boolean = false;
  @Input() aiDifficulty: string = 'medium';
  @Input() boardSize: number = 19;
  @Input() gameEnded: boolean = false;
  @Input() consecutivePasses: number = 0;

  @Output() pass = new EventEmitter<void>();
  @Output() newGame = new EventEmitter<number>();
  @Output() reset = new EventEmitter<void>();
  @Output() toggleAi = new EventEmitter<void>();
  @Output() setAiDifficulty = new EventEmitter<string>();
  @Output() aiMove = new EventEmitter<string>();
  @Output() setBoardSize = new EventEmitter<number>();

  getCurrentPlayerName(): string {
    return this.currentPlayer === Player.BLACK ? 'Black' : 'White';
  }

  onDifficultyChange(difficulty: string): void {
    this.setAiDifficulty.emit(difficulty);
  }

  onBoardSizeChange(size: number): void {
    this.setBoardSize.emit(size);
  }

  onNewGame(): void {
    this.newGame.emit(this.boardSize);
  }

  onPass(): void {
    this.pass.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  onToggleAi(): void {
    this.toggleAi.emit();
  }

  // Expose Player enum to template
  Player = Player;
}
