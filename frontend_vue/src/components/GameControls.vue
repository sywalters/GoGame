<script setup lang="ts">
import { Player } from '../types'

defineProps<{
  currentPlayer: Player
  capturedStones: { black: number; white: number }
  aiOpponentEnabled: boolean
  aiDifficulty: string
  boardSize: number
  gameEnded: boolean
  consecutivePasses: number
}>()

const emit = defineEmits<{
  pass: []
  'new-game': [size?: number]
  reset: []
  'toggle-ai': []
  'set-ai-difficulty': [difficulty: string]
  'set-board-size': [size: number]
}>()

function getCurrentPlayerName(player: Player): string {
  return player === Player.BLACK ? 'Black' : 'White'
}
</script>

<template>
  <div class="game-controls">
    <div class="game-status">
      <h2>Go Game</h2>
      <div v-if="gameEnded" class="game-ended">
        <span class="game-status-indicator ended">🏁 Game Ended</span>
        <small>Both players passed consecutively</small>
      </div>
      <div v-else class="current-player">
        <span>Current Player: </span>
        <span
          class="player-indicator"
          :class="currentPlayer === Player.BLACK ? 'black' : 'white'"
        >
          {{ getCurrentPlayerName(currentPlayer) }}
        </span>
        <small v-if="consecutivePasses > 0" class="pass-indicator">
          ({{ consecutivePasses }} consecutive pass{{ consecutivePasses > 1 ? 'es' : '' }})
        </small>
      </div>
    </div>

    <div class="captured-stones">
      <h3>Captured Stones</h3>
      <div class="capture-count">
        <div class="capture-item">
          <span class="stone-indicator black"></span>
          <span>Black captured: {{ capturedStones.white }}</span>
        </div>
        <div class="capture-item">
          <span class="stone-indicator white"></span>
          <span>White captured: {{ capturedStones.black }}</span>
        </div>
      </div>
    </div>

    <div class="ai-controls">
      <h3>AI Opponent</h3>
      <div class="ai-toggle">
        <label>
          <input
            type="checkbox"
            :checked="aiOpponentEnabled"
            @change="emit('toggle-ai')"
          />
          Enable AI Opponent (plays as White)
        </label>
      </div>

      <div v-if="aiOpponentEnabled" class="ai-settings">
        <div class="difficulty-selector">
          <label>Difficulty:</label>
          <select
            :value="aiDifficulty"
            @change="emit('set-ai-difficulty', ($event.target as HTMLSelectElement).value)"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div v-if="currentPlayer === Player.WHITE" class="ai-status">
          <span>🤖 AI is thinking...</span>
        </div>
      </div>
    </div>

    <div class="game-settings">
      <h3>Game Settings</h3>
      <div class="board-size-selector">
        <label>Board Size:</label>
        <select
          :value="boardSize"
          @change="emit('set-board-size', parseInt(($event.target as HTMLSelectElement).value))"
        >
          <option :value="9">9×9 (Small)</option>
          <option :value="13">13×13 (Medium)</option>
          <option :value="19">19×19 (Standard)</option>
        </select>
      </div>
      <div class="size-info">
        <small>Current board: {{ boardSize }}×{{ boardSize }}</small>
      </div>
    </div>

    <div class="game-actions">
      <button class="game-button pass-button" @click="emit('pass')">
        Pass Turn
      </button>
      <button class="game-button reset-button" @click="emit('reset')">
        Reset Game
      </button>
      <button class="game-button new-game-button" @click="emit('new-game', boardSize)">
        New Game ({{ boardSize }}×{{ boardSize }})
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.game-status h2 {
  margin: 0 0 15px 0;
  color: #333;
  text-align: center;
}

.current-player {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: bold;
}

.player-indicator {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
}

.player-indicator.black { background-color: #333; }
.player-indicator.white { background-color: #fff; color: #333; border: 2px solid #333; }

.captured-stones h3 { margin: 0 0 10px 0; color: #333; }

.capture-count {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.capture-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stone-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
}

.stone-indicator.black {
  background: radial-gradient(circle at 30% 30%, #555, #000);
  border: 1px solid #000;
}

.stone-indicator.white {
  background: radial-gradient(circle at 30% 30%, #fff, #ddd);
  border: 1px solid #ccc;
}

.ai-controls {
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 6px;
  margin-bottom: 20px;
}

.ai-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.difficulty-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-status {
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
  font-style: italic;
  color: #666;
}

.game-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.game-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.game-button:active { transform: translateY(0); }
.pass-button { background-color: #4caf50; color: white; }
.pass-button:hover { background-color: #45a049; }
.reset-button { background-color: #ff9800; color: white; }
.reset-button:hover { background-color: #e68900; }
.new-game-button { background-color: #2196f3; color: white; }
.new-game-button:hover { background-color: #1976d2; }
</style>
