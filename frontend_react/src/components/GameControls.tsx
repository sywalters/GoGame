import React from "react";
import { Player } from "../types";
import "./GameControls.css";

interface GameControlsProps {
  currentPlayer: Player;
  capturedStones: {
    black: number;
    white: number;
  };
  onPass: () => void;
  onNewGame: (boardSize?: number) => void;
  onReset: () => void;
  onAiMove?: (difficulty: string) => void;
  aiOpponentEnabled?: boolean;
  onToggleAi?: () => void;
  aiDifficulty?: string;
  onSetAiDifficulty?: (difficulty: string) => void;
  boardSize?: number;
  onSetBoardSize?: (size: number) => void;
  gameEnded?: boolean;
  consecutivePasses?: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  capturedStones,
  onPass,
  onNewGame,
  onReset,
  onAiMove,
  aiOpponentEnabled = false,
  onToggleAi,
  aiDifficulty = "medium",
  onSetAiDifficulty,
  boardSize = 19,
  onSetBoardSize,
  gameEnded = false,
  consecutivePasses = 0,
}) => {
  const getCurrentPlayerName = () => {
    return currentPlayer === Player.BLACK ? "Black" : "White";
  };

  return (
    <div className="game-controls">
      <div className="game-status">
        <h2>Go Game</h2>
        {gameEnded ? (
          <div className="game-ended">
            <span className="game-status-indicator ended">🏁 Game Ended</span>
            <small>Both players passed consecutively</small>
          </div>
        ) : (
          <div className="current-player">
            <span>Current Player: </span>
            <span
              className={`player-indicator ${
                currentPlayer === Player.BLACK ? "black" : "white"
              }`}
            >
              {getCurrentPlayerName()}
            </span>
            {consecutivePasses > 0 && (
              <small className="pass-indicator">
                ({consecutivePasses} consecutive pass
                {consecutivePasses > 1 ? "es" : ""})
              </small>
            )}
          </div>
        )}
      </div>

      <div className="captured-stones">
        <h3>Captured Stones</h3>
        <div className="capture-count">
          <div className="capture-item">
            <span className="stone-indicator black"></span>
            <span>Black captured: {capturedStones.white}</span>
          </div>
          <div className="capture-item">
            <span className="stone-indicator white"></span>
            <span>White captured: {capturedStones.black}</span>
          </div>
        </div>
      </div>

      <div className="ai-controls">
        <h3>AI Opponent</h3>
        <div className="ai-toggle">
          <label>
            <input
              type="checkbox"
              checked={aiOpponentEnabled}
              onChange={onToggleAi}
            />
            Enable AI Opponent (plays as White)
          </label>
        </div>

        {aiOpponentEnabled && (
          <div className="ai-settings">
            <div className="difficulty-selector">
              <label>Difficulty:</label>
              <select
                value={aiDifficulty}
                onChange={(e) => onSetAiDifficulty?.(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {currentPlayer === Player.WHITE && (
              <div className="ai-status">
                <span>🤖 AI is thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="game-settings">
        <h3>Game Settings</h3>
        <div className="board-size-selector">
          <label>Board Size:</label>
          <select
            value={boardSize}
            onChange={(e) => onSetBoardSize?.(parseInt(e.target.value))}
          >
            <option value={9}>9×9 (Small)</option>
            <option value={13}>13×13 (Medium)</option>
            <option value={19}>19×19 (Standard)</option>
          </select>
        </div>
        <div className="size-info">
          <small>
            Current board: {boardSize}×{boardSize}
          </small>
        </div>
      </div>

      <div className="game-actions">
        <button className="game-button pass-button" onClick={onPass}>
          Pass Turn
        </button>
        <button className="game-button reset-button" onClick={onReset}>
          Reset Game
        </button>
        <button
          className="game-button new-game-button"
          onClick={() => onNewGame(boardSize)}
        >
          New Game ({boardSize}×{boardSize})
        </button>
      </div>
    </div>
  );
};

export default GameControls;
