import React from "react";
import { Player } from "@/types";
import "./GameControls.css";

interface GameControlsProps {
  currentPlayer: Player;
  capturedStones: { black: number; white: number };
  onPass: () => void;
  onNewGame: (boardSize?: number) => void;
  onReset: () => void;
  aiOpponentEnabled: boolean;
  onToggleAi: () => void;
  aiDifficulty: string;
  onSetAiDifficulty: (difficulty: string) => void;
  onAiMove: (difficulty: string) => void;
  boardSize: number;
  onSetBoardSize: (size: number) => void;
  gameEnded: boolean;
  consecutivePasses: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  capturedStones,
  onPass,
  onNewGame,
  onReset,
  aiOpponentEnabled,
  onToggleAi,
  aiDifficulty,
  onSetAiDifficulty,
  onAiMove,
  boardSize,
  onSetBoardSize,
  gameEnded,
  consecutivePasses,
}) => {
  const getCurrentPlayerName = (): string => {
    return currentPlayer === Player.BLACK ? "Black" : "White";
  };

  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value);
    onSetBoardSize(size);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSetAiDifficulty(e.target.value);
  };

  return (
    <div className="game-controls">
      <div className="game-info">
        <h2>Game Status</h2>
        <div className="current-player">
          Current Player: <span className={getCurrentPlayerName().toLowerCase()}>{getCurrentPlayerName()}</span>
        </div>
        <div className="captured-stones">
          <div>Black captured: {capturedStones.black}</div>
          <div>White captured: {capturedStones.white}</div>
        </div>
        {consecutivePasses > 0 && (
          <div className="consecutive-passes">
            Consecutive passes: {consecutivePasses}
          </div>
        )}
        {gameEnded && (
          <div className="game-ended">
            🎯 Game Ended!
          </div>
        )}
      </div>

      <div className="game-actions">
        <h3>Game Actions</h3>
        <button onClick={onPass} disabled={gameEnded}>
          Pass Turn
        </button>
        <button onClick={() => onNewGame()}>
          New Game
        </button>
        <button onClick={onReset}>
          Reset Game
        </button>
      </div>

      <div className="board-settings">
        <h3>Board Settings</h3>
        <div className="setting-group">
          <label htmlFor="board-size">Board Size:</label>
          <select
            id="board-size"
            value={boardSize}
            onChange={handleBoardSizeChange}
          >
            <option value={9}>9x9</option>
            <option value={13}>13x13</option>
            <option value={19}>19x19</option>
          </select>
        </div>
      </div>

      <div className="ai-settings">
        <h3>AI Opponent</h3>
        <div className="setting-group">
          <label>
            <input
              type="checkbox"
              checked={aiOpponentEnabled}
              onChange={onToggleAi}
            />
            Enable AI Opponent
          </label>
        </div>
        
        {aiOpponentEnabled && (
          <>
            <div className="setting-group">
              <label htmlFor="ai-difficulty">AI Difficulty:</label>
              <select
                id="ai-difficulty"
                value={aiDifficulty}
                onChange={handleDifficultyChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <button
              onClick={() => onAiMove(aiDifficulty)}
              disabled={gameEnded || currentPlayer !== Player.WHITE}
              className="ai-move-button"
            >
              🤖 Make AI Move
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameControls;
