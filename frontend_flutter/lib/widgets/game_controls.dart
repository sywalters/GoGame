import 'package:flutter/material.dart';
import '../models/game_state.dart';

class GameControls extends StatelessWidget {
  final Player currentPlayer;
  final CapturedStones capturedStones;
  final bool aiOpponentEnabled;
  final String aiDifficulty;
  final int boardSize;
  final bool gameEnded;
  final int consecutivePasses;
  final VoidCallback onPass;
  final void Function(int? size) onNewGame;
  final VoidCallback onReset;
  final VoidCallback onToggleAi;
  final void Function(String) onSetAiDifficulty;
  final void Function(int) onSetBoardSize;

  const GameControls({
    super.key,
    required this.currentPlayer,
    required this.capturedStones,
    required this.aiOpponentEnabled,
    required this.aiDifficulty,
    required this.boardSize,
    required this.gameEnded,
    required this.consecutivePasses,
    required this.onPass,
    required this.onNewGame,
    required this.onReset,
    required this.onToggleAi,
    required this.onSetAiDifficulty,
    required this.onSetBoardSize,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 280,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5F5),
        borderRadius: BorderRadius.circular(8),
        boxShadow: const [
          BoxShadow(color: Color(0x1A000000), offset: Offset(0, 2), blurRadius: 4),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildGameStatus(),
          const SizedBox(height: 20),
          _buildCapturedStones(),
          const SizedBox(height: 20),
          _buildAiControls(),
          const SizedBox(height: 20),
          _buildGameSettings(),
          const SizedBox(height: 20),
          _buildGameActions(),
        ],
      ),
    );
  }

  Widget _buildGameStatus() {
    return Column(
      children: [
        const Text(
          'Go Game',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF333333)),
        ),
        const SizedBox(height: 12),
        if (gameEnded)
          const Column(
            children: [
              Text('🏁 Game Ended', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              Text('Both players passed consecutively', style: TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          )
        else
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Current Player: ', style: TextStyle(fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: currentPlayer == Player.black ? const Color(0xFF333333) : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF333333), width: 2),
                ),
                child: Text(
                  currentPlayer == Player.black ? 'Black' : 'White',
                  style: TextStyle(
                    color: currentPlayer == Player.black ? Colors.white : const Color(0xFF333333),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              if (consecutivePasses > 0) ...[
                const SizedBox(width: 8),
                Text(
                  '($consecutivePasses pass${consecutivePasses > 1 ? 'es' : ''})',
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ],
          ),
      ],
    );
  }

  Widget _buildCapturedStones() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Captured Stones', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF333333))),
        const SizedBox(height: 8),
        _captureRow(isBlack: true, count: capturedStones.white),
        const SizedBox(height: 4),
        _captureRow(isBlack: false, count: capturedStones.black),
      ],
    );
  }

  Widget _captureRow({required bool isBlack, required int count}) {
    return Row(
      children: [
        Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              center: const Alignment(-0.3, -0.3),
              colors: isBlack
                  ? [const Color(0xFF555555), const Color(0xFF000000)]
                  : [const Color(0xFFFFFFFF), const Color(0xFFDDDDDD)],
            ),
            border: Border.all(color: isBlack ? Colors.black : const Color(0xFFCCCCCC)),
          ),
        ),
        const SizedBox(width: 10),
        Text('${isBlack ? "Black" : "White"} captured: $count'),
      ],
    );
  }

  Widget _buildAiControls() {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFE0E0E0),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('AI Opponent', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Row(
            children: [
              SizedBox(
                width: 24,
                height: 24,
                child: Checkbox(value: aiOpponentEnabled, onChanged: (_) => onToggleAi()),
              ),
              const SizedBox(width: 8),
              const Expanded(child: Text('Enable AI (plays as White)', style: TextStyle(fontSize: 13))),
            ],
          ),
          if (aiOpponentEnabled) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                const Text('Difficulty: '),
                const SizedBox(width: 8),
                DropdownButton<String>(
                  value: aiDifficulty,
                  isDense: true,
                  items: const [
                    DropdownMenuItem(value: 'easy', child: Text('Easy')),
                    DropdownMenuItem(value: 'medium', child: Text('Medium')),
                    DropdownMenuItem(value: 'hard', child: Text('Hard')),
                  ],
                  onChanged: (value) {
                    if (value != null) onSetAiDifficulty(value);
                  },
                ),
              ],
            ),
            if (currentPlayer == Player.white)
              const Padding(
                padding: EdgeInsets.only(top: 8),
                child: Center(
                  child: Text('🤖 AI is thinking...', style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey)),
                ),
              ),
          ],
        ],
      ),
    );
  }

  Widget _buildGameSettings() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Game Settings', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF333333))),
        const SizedBox(height: 8),
        Row(
          children: [
            const Text('Board Size: '),
            const SizedBox(width: 8),
            DropdownButton<int>(
              value: boardSize,
              isDense: true,
              items: const [
                DropdownMenuItem(value: 9, child: Text('9×9 (Small)')),
                DropdownMenuItem(value: 13, child: Text('13×13 (Medium)')),
                DropdownMenuItem(value: 19, child: Text('19×19 (Standard)')),
              ],
              onChanged: (value) {
                if (value != null) onSetBoardSize(value);
              },
            ),
          ],
        ),
        Text('Current board: $boardSize×$boardSize', style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }

  Widget _buildGameActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton(
          onPressed: onPass,
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4CAF50), foregroundColor: Colors.white),
          child: const Text('Pass Turn', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 8),
        ElevatedButton(
          onPressed: onReset,
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFF9800), foregroundColor: Colors.white),
          child: const Text('Reset Game', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 8),
        ElevatedButton(
          onPressed: () => onNewGame(boardSize),
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2196F3), foregroundColor: Colors.white),
          child: Text('New Game ($boardSize×$boardSize)', style: const TextStyle(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
