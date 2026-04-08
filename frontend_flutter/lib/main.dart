import 'dart:async';
import 'package:flutter/material.dart';
import 'models/game_state.dart';
import 'services/game_api.dart';
import 'widgets/game_board.dart';
import 'widgets/game_controls.dart';

void main() {
  runApp(const GoGameApp());
}

class GoGameApp extends StatelessWidget {
  const GoGameApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Go Game - Flutter',
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF2196F3),
        useMaterial3: true,
      ),
      home: const GoGamePage(),
    );
  }
}

class GoGamePage extends StatefulWidget {
  const GoGamePage({super.key});

  @override
  State<GoGamePage> createState() => _GoGamePageState();
}

class _GoGamePageState extends State<GoGamePage> {
  GameState? _gameState;
  bool _loading = true;
  String? _error;
  bool _aiOpponentEnabled = false;
  String _aiDifficulty = 'medium';
  int _boardSize = 19;
  bool _aiPassNotification = false;

  @override
  void initState() {
    super.initState();
    _loadGameState();
  }

  Future<void> _loadGameState() async {
    setState(() { _loading = true; _error = null; });
    try {
      final state = await GameApi.getGameState();
      setState(() { _gameState = state; _loading = false; });
    } catch (e) {
      setState(() { _error = 'Failed to load game state'; _loading = false; });
    }
  }

  Future<void> _handleMove(int row, int col) async {
    if (_gameState == null) return;
    try {
      setState(() { _error = null; _aiPassNotification = false; });
      final response = await GameApi.makeMove(row, col);
      setState(() => _gameState = response.gameState);

      if (_aiOpponentEnabled &&
          response.gameState.currentPlayer == Player.white &&
          !response.gameState.gameEnded) {
        Timer(const Duration(seconds: 1), () => _handleAiMove(_aiDifficulty));
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    }
  }

  Future<void> _handleAiMove(String difficulty) async {
    try {
      final response = await GameApi.aiMove(difficulty: difficulty);
      setState(() {
        _gameState = response.gameState;
        if (response.aiPassed) {
          _aiPassNotification = true;
          Timer(const Duration(seconds: 3), () {
            if (mounted) setState(() => _aiPassNotification = false);
          });
        }
      });
    } catch (e) {
      setState(() => _error = 'Failed to make AI move');
    }
  }

  Future<void> _handlePass() async {
    try {
      setState(() => _error = null);
      final response = await GameApi.pass();
      setState(() => _gameState = response.gameState);
    } catch (e) {
      setState(() => _error = 'Failed to pass turn');
    }
  }

  Future<void> _handleNewGame(int? newBoardSize) async {
    try {
      setState(() { _error = null; _aiPassNotification = false; });
      final size = newBoardSize ?? _boardSize;
      final response = await GameApi.newGame(boardSize: size);
      setState(() { _gameState = response.gameState; _boardSize = size; });
    } catch (e) {
      setState(() => _error = 'Failed to start new game');
    }
  }

  Future<void> _handleReset() async {
    try {
      setState(() { _error = null; _aiPassNotification = false; });
      final response = await GameApi.resetGame();
      setState(() => _gameState = response.gameState);
    } catch (e) {
      setState(() => _error = 'Failed to reset game');
    }
  }

  void _handleBoardSizeChange(int newSize) {
    _boardSize = newSize;
    _handleNewGame(newSize);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      body: SafeArea(
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _gameState == null
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(_error ?? 'Failed to load game'),
                        const SizedBox(height: 16),
                        ElevatedButton(onPressed: _loadGameState, child: const Text('Retry')),
                      ],
                    ),
                  )
                : _buildGame(),
      ),
    );
  }

  Widget _buildGame() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Text(
            'Go Game - Flutter',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.grey[800]),
          ),
          if (_error != null)
            Container(
              margin: const EdgeInsets.only(top: 10),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFFFEBEE),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFFEF9A9A)),
              ),
              child: Text(_error!, style: const TextStyle(color: Color(0xFFC62828))),
            ),
          if (_aiPassNotification)
            Container(
              margin: const EdgeInsets.only(top: 10),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFE3F2FD),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF42A5F5), width: 2),
              ),
              child: const Text(
                '🤖 AI Opponent passed their turn',
                style: TextStyle(color: Color(0xFF1565C0), fontWeight: FontWeight.w500, fontSize: 16),
              ),
            ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 30,
            runSpacing: 20,
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: [
              GameControls(
                currentPlayer: _gameState!.currentPlayer,
                capturedStones: _gameState!.capturedStones,
                aiOpponentEnabled: _aiOpponentEnabled,
                aiDifficulty: _aiDifficulty,
                boardSize: _boardSize,
                gameEnded: _gameState!.gameEnded,
                consecutivePasses: _gameState!.consecutivePasses,
                onPass: _handlePass,
                onNewGame: _handleNewGame,
                onReset: _handleReset,
                onToggleAi: () => setState(() => _aiOpponentEnabled = !_aiOpponentEnabled),
                onSetAiDifficulty: (d) => setState(() => _aiDifficulty = d),
                onSetBoardSize: _handleBoardSizeChange,
              ),
              GameBoard(
                board: _gameState!.board,
                currentPlayer: _gameState!.currentPlayer,
                onMove: _handleMove,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
