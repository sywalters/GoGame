import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/game_state.dart';

class GameApi {
  static const String baseUrl = 'http://localhost:8008';

  static Future<GameState> getGameState() async {
    final response = await http.get(Uri.parse('$baseUrl/game/state'));
    if (response.statusCode != 200) {
      throw Exception('Failed to get game state');
    }
    return GameState.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<ApiResponse> makeMove(int row, int col) async {
    final response = await http.post(
      Uri.parse('$baseUrl/game/move'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'row': row, 'col': col}),
    );
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body) as Map<String, dynamic>;
      throw Exception(errorData['detail'] ?? 'Failed to make move');
    }
    return ApiResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<ApiResponse> pass() async {
    final response = await http.post(Uri.parse('$baseUrl/game/pass'));
    if (response.statusCode != 200) {
      throw Exception('Failed to pass turn');
    }
    return ApiResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<ApiResponse> newGame({int boardSize = 19}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/game/new'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'board_size': boardSize}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to start new game');
    }
    return ApiResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<ApiResponse> resetGame() async {
    final response = await http.post(Uri.parse('$baseUrl/game/reset'));
    if (response.statusCode != 200) {
      throw Exception('Failed to reset game');
    }
    return ApiResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<ApiResponse> aiMove({String difficulty = 'medium'}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/game/ai_move'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'difficulty': difficulty}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to make AI move');
    }
    return ApiResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
}
