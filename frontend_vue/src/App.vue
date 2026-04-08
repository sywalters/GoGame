<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameBoard from './components/GameBoard.vue'
import GameControls from './components/GameControls.vue'
import { GameApi } from './api'
import { type GameState, Player } from './types'

const gameState = ref<GameState | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const aiOpponentEnabled = ref(false)
const aiDifficulty = ref('medium')
const boardSize = ref(19)
const aiPassNotification = ref(false)

onMounted(() => {
  loadGameState()
})

async function loadGameState() {
  try {
    loading.value = true
    error.value = null
    gameState.value = await GameApi.getGameState()
  } catch (err) {
    error.value = 'Failed to load game state'
    console.error('Error loading game state:', err)
  } finally {
    loading.value = false
  }
}

async function handleMove(row: number, col: number) {
  if (!gameState.value) return
  try {
    error.value = null
    aiPassNotification.value = false
    const response = await GameApi.makeMove(row, col)
    gameState.value = response.game_state

    if (
      aiOpponentEnabled.value &&
      response.game_state.current_player === Player.WHITE &&
      !response.game_state.game_ended
    ) {
      setTimeout(() => handleAiMove(aiDifficulty.value), 1000)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to make move'
    console.error('Error making move:', err)
  }
}

async function handleAiMove(difficulty: string) {
  try {
    const response = await GameApi.aiMove(difficulty)
    gameState.value = response.game_state
    if (response.ai_passed) {
      aiPassNotification.value = true
      setTimeout(() => { aiPassNotification.value = false }, 3000)
    }
  } catch (err) {
    error.value = 'Failed to make AI move'
    console.error('Error making AI move:', err)
  }
}

async function handlePass() {
  try {
    error.value = null
    const response = await GameApi.pass()
    gameState.value = response.game_state
  } catch (err) {
    error.value = 'Failed to pass turn'
    console.error('Error passing turn:', err)
  }
}

async function handleNewGame(newBoardSize?: number) {
  try {
    error.value = null
    aiPassNotification.value = false
    const size = newBoardSize || boardSize.value
    const response = await GameApi.newGame(size)
    gameState.value = response.game_state
    boardSize.value = size
  } catch (err) {
    error.value = 'Failed to start new game'
    console.error('Error starting new game:', err)
  }
}

async function handleReset() {
  try {
    error.value = null
    aiPassNotification.value = false
    const response = await GameApi.resetGame()
    gameState.value = response.game_state
  } catch (err) {
    error.value = 'Failed to reset game'
    console.error('Error resetting game:', err)
  }
}

function handleBoardSizeChange(newSize: number) {
  boardSize.value = newSize
  handleNewGame(newSize)
}

function toggleAiOpponent() {
  aiOpponentEnabled.value = !aiOpponentEnabled.value
}
</script>

<template>
  <div class="app">
    <div v-if="loading" class="loading">Loading game...</div>

    <div v-else-if="!gameState" class="error">
      <div>{{ error || 'Failed to load game' }}</div>
      <button @click="loadGameState">Retry</button>
    </div>

    <template v-else>
      <div class="app-header">
        <h1>Go Game - Vue</h1>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="aiPassNotification" class="ai-pass-notification">
          🤖 AI Opponent passed their turn
        </div>
      </div>

      <div class="game-container">
        <GameControls
          :current-player="gameState.current_player"
          :captured-stones="gameState.captured_stones"
          :ai-opponent-enabled="aiOpponentEnabled"
          :ai-difficulty="aiDifficulty"
          :board-size="boardSize"
          :game-ended="gameState.game_ended || false"
          :consecutive-passes="gameState.consecutive_passes || 0"
          @pass="handlePass"
          @new-game="handleNewGame"
          @reset="handleReset"
          @toggle-ai="toggleAiOpponent"
          @set-ai-difficulty="aiDifficulty = $event"
          @set-board-size="handleBoardSizeChange"
        />

        <GameBoard
          :board="gameState.board"
          :current-player="gameState.current_player"
          @move="handleMove($event.row, $event.col)"
        />
      </div>
    </template>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

.app {
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-header h1 {
  color: #333;
  font-size: 2.5em;
  margin-bottom: 10px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #ef9a9a;
}

.ai-pass-notification {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 10px;
  border: 2px solid #42a5f5;
  font-weight: 500;
  font-size: 1.1em;
  animation: slideInFromTop 0.3s ease-out, fadeOut 0.5s ease-in 2.5s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@keyframes slideInFromTop {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2em;
  color: #666;
}

.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  gap: 20px;
}

.error button {
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.error button:hover {
  background-color: #1976d2;
}

.game-container {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}

@media (max-width: 1024px) {
  .game-container { flex-direction: column; align-items: center; }
}

@media (max-width: 768px) {
  .app { padding: 10px; }
  .app-header h1 { font-size: 2em; }
  .game-container { gap: 20px; }
}
</style>
