import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../types';

@Component({
  selector: 'app-game-board',
  imports: [CommonModule],
  templateUrl: './game-board.html',
  styleUrl: './game-board.css'
})
export class GameBoardComponent {
  @Input() board: number[][] = [];
  @Input() currentPlayer: Player = Player.BLACK;
  @Output() move = new EventEmitter<{row: number, col: number}>();

  get boardSize(): number {
    return this.board.length;
  }

  get cellSize(): number {
    return Math.min(600 / this.boardSize, 30);
  }

  get boardWidth(): number {
    return this.cellSize * this.boardSize;
  }

  handleCellClick(row: number, col: number): void {
    if (this.board[row][col] === Player.EMPTY) {
      this.move.emit({row, col});
    }
  }

  isStarPoint(row: number, col: number): boolean {
    if (this.boardSize !== 19) return false;
    const starPoints = [3, 9, 15];
    return starPoints.includes(row) && starPoints.includes(col);
  }

  getStoneClass(player: number): string {
    if (player === Player.EMPTY) return '';
    return player === Player.BLACK ? 'stone black' : 'stone white';
  }

  getCellClass(row: number, col: number): string {
    let classes = ['board-cell'];
    
    if (row === 0) classes.push('top-edge');
    if (row === this.boardSize - 1) classes.push('bottom-edge');
    if (col === 0) classes.push('left-edge');
    if (col === this.boardSize - 1) classes.push('right-edge');
    if (this.isStarPoint(row, col)) classes.push('star-point');
    
    return classes.join(' ');
  }

  // Expose Player enum to template
  Player = Player;

  trackByIndex(index: number): number {
    return index;
  }
}
