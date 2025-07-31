'use client';

import React, { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import GameControls from '@/components/GameControls';
import { GameApi } from '@/lib/api';
import { GameState, Player } from '@/types';
import '@/styles/App.css';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aiOpponentEnabled, setAiOpponentEnabled] = useState<boolean>(false);
  const [aiDifficulty, setAiDifficulty] = useState<string>('medium');
  const [boardSize, setBoardSize] = useState<number>(19);
  const [aiPassNotification, setAiPassNotification] = useState<boolean>(false);

  useEffect(() => {
    loadGameState();
  }, []);

  const loadGameState = async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await GameApi.getGameState();
      setGameState(state);
    } catch (err) {
      setError('Failed to load game state');
      console.error('Error loading game state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (row: number, col: number) => {
    if (!gameState) return;

    try {
      setError(null);
      setAiPassNotification(false);
      const response = await GameApi.makeMove(row, col);
      setGameState(response.game_state);

      // Auto-play AI move after a short delay if enabled and game hasn't ended
      if (
        aiOpponentEnabled &&
        response.game_state.current_player === Player.WHITE &&
        !response.game_state.game_ended
      ) {
        setTimeout(() => {
          handleAiMove(aiDifficulty);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make move');
      console.error('Error making move:', err);
    }
  };

  const handleAiMove = async (difficulty: string) => {
    try {
      const response = await GameApi.aiMove(difficulty);
      setGameState(response.game_state);
      if (response.ai_passed) {
        setAiPassNotification(true);
        setTimeout(() => {
          setAiPassNotification(false);
        }, 3000);
      }
    } catch (err) {
      setError('Failed to make AI move');
      console.error('Error making AI move:', err);
    }
  };

  const handlePass = async () => {
    try {
      setError(null);
      const response = await GameApi.pass();
      setGameState(response.game_state);
    } catch (err) {
      setError('Failed to pass turn');
      console.error('Error passing turn:', err);
    }
  };

  const handleNewGame = async (newBoardSize?: number) => {
    try {
      setError(null);
      setAiPassNotification(false);
      const size = newBoardSize || boardSize;
      const response = await GameApi.newGame(size);
      setGameState(response.game_state);
      setBoardSize(size);
    } catch (err) {
      setError('Failed to start new game');
      console.error('Error starting new game:', err);
    }
  };

  const handleReset = async () => {
    try {
      setError(null);
      setAiPassNotification(false);
      const response = await GameApi.resetGame();
      setGameState(response.game_state);
    } catch (err) {
      setError('Failed to reset game');
      console.error('Error resetting game:', err);
    }
  };

  const handleBoardSizeChange = async (newSize: number) => {
    setBoardSize(newSize);
    await handleNewGame(newSize);
  };

  const toggleAiOpponent = () => {
    setAiOpponentEnabled(!aiOpponentEnabled);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading game...</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="app">
        <div className="error">
          {error || 'Failed to load game'}
          <button onClick={loadGameState}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Go Game - Next.js</h1>
        {error && <div className="error-message">{error}</div>}
        {aiPassNotification && (
          <div className="ai-pass-notification">
            🤖 AI Opponent passed their turn
          </div>
        )}
      </div>

      <div className="game-container">
        <GameControls
          currentPlayer={gameState.current_player}
          capturedStones={gameState.captured_stones}
          onPass={handlePass}
          onNewGame={handleNewGame}
          onReset={handleReset}
          aiOpponentEnabled={aiOpponentEnabled}
          onToggleAi={toggleAiOpponent}
          aiDifficulty={aiDifficulty}
          onSetAiDifficulty={setAiDifficulty}
          onAiMove={handleAiMove}
          boardSize={boardSize}
          onSetBoardSize={handleBoardSizeChange}
          gameEnded={gameState.game_ended || false}
          consecutivePasses={gameState.consecutive_passes || 0}
        />

        <GameBoard
          board={gameState.board}
          onMove={handleMove}
          currentPlayer={gameState.current_player}
        />
      </div>
    </div>
  );
}
