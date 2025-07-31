import React from "react";
import { Player } from "@/types";
import "./GameBoard.css";

interface GameBoardProps {
  board: number[][];
  onMove: (row: number, col: number) => void;
  currentPlayer: Player;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onMove,
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

  const isStarPoint = (row: number, col: number): boolean => {
    if (boardSize !== 19) return false;
    const starPoints = [3, 9, 15];
    return starPoints.includes(row) && starPoints.includes(col);
  };

  const getCellClasses = (row: number, col: number): string => {
    const classes = ["board-cell"];
    
    if (row === 0) classes.push("top-edge");
    if (row === boardSize - 1) classes.push("bottom-edge");
    if (col === 0) classes.push("left-edge");
    if (col === boardSize - 1) classes.push("right-edge");
    if (isStarPoint(row, col)) classes.push("star-point");
    
    return classes.join(" ");
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
              className={getCellClasses(rowIndex, colIndex)}
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
