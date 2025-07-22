import React from "react";
import { Player } from "../types";
import "./GameBoard.css";

interface GameBoardProps {
  board: number[][];
  onMove: (row: number, col: number) => void;
  currentPlayer: Player;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onMove,
  currentPlayer,
}) => {
  const boardSize = board.length;
  const cellSize = Math.min(600 / boardSize, 30);
  const boardWidth = cellSize * boardSize;

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] === Player.EMPTY) {
      onMove(row, col);
    }
  };

  const renderStone = (player: Player) => {
    if (player === Player.EMPTY) return null;

    return (
      <div
        className={`stone ${player === Player.BLACK ? "black" : "white"}`}
        style={{
          width: cellSize * 0.8,
          height: cellSize * 0.8,
        }}
      />
    );
  };

  return (
    <div className="game-board-container">
      <div
        className="game-board"
        style={{
          width: boardWidth,
          height: boardWidth,
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`board-cell ${rowIndex === 0 ? "top-edge" : ""} ${
                rowIndex === boardSize - 1 ? "bottom-edge" : ""
              } ${colIndex === 0 ? "left-edge" : ""} ${
                colIndex === boardSize - 1 ? "right-edge" : ""
              } ${
                // Add star points for 19x19 board
                boardSize === 19 &&
                ((rowIndex === 3 &&
                  (colIndex === 3 || colIndex === 9 || colIndex === 15)) ||
                  (rowIndex === 9 &&
                    (colIndex === 3 || colIndex === 9 || colIndex === 15)) ||
                  (rowIndex === 15 &&
                    (colIndex === 3 || colIndex === 9 || colIndex === 15)))
                  ? "star-point"
                  : ""
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: cellSize,
                height: cellSize,
              }}
            >
              {renderStone(cell as Player)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
