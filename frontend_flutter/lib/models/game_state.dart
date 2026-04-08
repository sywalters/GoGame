enum Player {
  empty(0),
  black(1),
  white(2);

  const Player(this.value);
  final int value;

  static Player fromValue(int value) {
    return Player.values.firstWhere(
      (p) => p.value == value,
      orElse: () => Player.empty,
    );
  }
}

class CapturedStones {
  final int black;
  final int white;

  CapturedStones({required this.black, required this.white});

  factory CapturedStones.fromJson(Map<String, dynamic> json) {
    return CapturedStones(
      black: json['black'] as int,
      white: json['white'] as int,
    );
  }
}

class GameState {
  final List<List<int>> board;
  final Player currentPlayer;
  final CapturedStones capturedStones;
  final int boardSize;
  final bool gameEnded;
  final int consecutivePasses;

  GameState({
    required this.board,
    required this.currentPlayer,
    required this.capturedStones,
    required this.boardSize,
    required this.gameEnded,
    required this.consecutivePasses,
  });

  factory GameState.fromJson(Map<String, dynamic> json) {
    return GameState(
      board: (json['board'] as List)
          .map((row) => (row as List).map((cell) => cell as int).toList())
          .toList(),
      currentPlayer: Player.fromValue(json['current_player'] as int),
      capturedStones:
          CapturedStones.fromJson(json['captured_stones'] as Map<String, dynamic>),
      boardSize: json['board_size'] as int,
      gameEnded: json['game_ended'] as bool? ?? false,
      consecutivePasses: json['consecutive_passes'] as int? ?? 0,
    );
  }
}

class ApiResponse {
  final bool success;
  final GameState gameState;
  final bool aiPassed;
  final String? message;

  ApiResponse({
    required this.success,
    required this.gameState,
    this.aiPassed = false,
    this.message,
  });

  factory ApiResponse.fromJson(Map<String, dynamic> json) {
    return ApiResponse(
      success: json['success'] as bool,
      gameState: GameState.fromJson(json['game_state'] as Map<String, dynamic>),
      aiPassed: json['ai_passed'] as bool? ?? false,
      message: json['message'] as String?,
    );
  }
}
