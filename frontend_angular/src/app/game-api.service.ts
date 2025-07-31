import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GameState, MoveResponse, ApiResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class GameApiService {
  private readonly API_BASE_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getGameState(): Observable<GameState> {
    console.log('Attempting to fetch game state from:', `${this.API_BASE_URL}/game/state`);
    return this.http.get<GameState>(`${this.API_BASE_URL}/game/state`).pipe(
      tap(response => console.log('Game state response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('HTTP Error:', error);
    if (error.status === 0) {
      console.error('Network error - likely CORS or server not running');
    }
    return throwError(() => error);
  };

  makeMove(row: number, col: number): Observable<MoveResponse> {
    return this.http.post<MoveResponse>(`${this.API_BASE_URL}/game/move`, {
      row,
      col
    });
  }

  pass(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_BASE_URL}/game/pass`, {});
  }

  newGame(boardSize: number = 19): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_BASE_URL}/game/new`, {
      board_size: boardSize
    });
  }

  resetGame(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_BASE_URL}/game/reset`, {});
  }

  aiMove(difficulty: string = 'medium'): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_BASE_URL}/game/ai_move`, {
      difficulty
    });
  }
}
