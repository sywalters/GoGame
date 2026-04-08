<script setup lang="ts">
import { computed } from 'vue'
import { Player } from '../types'

const props = defineProps<{
  board: number[][]
  currentPlayer: Player
}>()

const emit = defineEmits<{
  move: [payload: { row: number; col: number }]
}>()

const boardSize = computed(() => props.board.length)
const cellSize = computed(() => Math.min(600 / boardSize.value, 30))
const boardWidth = computed(() => cellSize.value * boardSize.value)

function handleCellClick(row: number, col: number) {
  if (props.board[row][col] === Player.EMPTY) {
    emit('move', { row, col })
  }
}

function isStarPoint(row: number, col: number): boolean {
  if (boardSize.value !== 19) return false
  const stars = [3, 9, 15]
  return stars.includes(row) && stars.includes(col)
}

function getCellClass(row: number, col: number): string {
  const classes = ['board-cell']
  if (row === 0) classes.push('top-edge')
  if (row === boardSize.value - 1) classes.push('bottom-edge')
  if (col === 0) classes.push('left-edge')
  if (col === boardSize.value - 1) classes.push('right-edge')
  if (isStarPoint(row, col)) classes.push('star-point')
  return classes.join(' ')
}

function getStoneClass(cell: number): string {
  if (cell === Player.EMPTY) return ''
  return cell === Player.BLACK ? 'stone black' : 'stone white'
}
</script>

<template>
  <div class="game-board-container">
    <div
      class="game-board"
      :style="{
        width: `${boardWidth}px`,
        height: `${boardWidth}px`,
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
      }"
    >
      <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        v-fragment
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="`${rowIndex}-${colIndex}`"
          :class="getCellClass(rowIndex, colIndex)"
          :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
          @click="handleCellClick(rowIndex, colIndex)"
        >
          <div
            v-if="cell !== Player.EMPTY"
            :class="getStoneClass(cell)"
            :style="{ width: `${cellSize * 0.8}px`, height: `${cellSize * 0.8}px` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-board {
  display: grid;
  background-color: #dcb35c;
  border: 2px solid #8b4513;
  position: relative;
}

.board-cell {
  background-color: #dcb35c;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;
}

.board-cell:hover {
  background-color: #d4a853;
}

.board-cell::before {
  content: '';
  position: absolute;
  background-color: #000;
  z-index: 1;
  width: 100%;
  height: 1px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.board-cell::after {
  content: '';
  position: absolute;
  background-color: #000;
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 1;
}

.board-cell.left-edge::before { width: 50%; left: 50%; }
.board-cell.right-edge::before { width: 50%; left: 0; }
.board-cell.top-edge::after { height: 50%; top: 50%; }
.board-cell.bottom-edge::after { height: 50%; top: 0; }

.board-cell.star-point::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #000;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.stone {
  border-radius: 50%;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 3;
  position: relative;
}

.stone.black {
  background: radial-gradient(circle at 30% 30%, #555, #000);
  border: 1px solid #000;
}

.stone.white {
  background: radial-gradient(circle at 30% 30%, #fff, #ddd);
  border: 1px solid #ccc;
}

.stone:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
</style>
