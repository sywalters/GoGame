from typing import List, Tuple, Optional, Set
import random
import copy
from go_game import GoGame, Player


class GoAI:
    """AI opponent for Go game with different difficulty levels"""

    def __init__(self, difficulty: str = "medium", player: Player = Player.WHITE):
        self.difficulty = difficulty.lower()
        self.player = player
        self.opponent = Player.BLACK if player == Player.WHITE else Player.WHITE

        # Difficulty settings
        self.settings = {
            "easy": {
                "search_depth": 1,
                "capture_weight": 1.0,
                "territory_weight": 0.3,
                "liberty_weight": 0.5,
                "random_factor": 0.4,
            },
            "medium": {
                "search_depth": 2,
                "capture_weight": 1.2,
                "territory_weight": 0.6,
                "liberty_weight": 0.8,
                "random_factor": 0.2,
            },
            "hard": {
                "search_depth": 3,
                "capture_weight": 1.5,
                "territory_weight": 1.0,
                "liberty_weight": 1.0,
                "random_factor": 0.1,
            },
        }

        self.config = self.settings.get(difficulty, self.settings["medium"])

    def get_move(self, game: GoGame) -> Optional[Tuple[int, int]]:
        """Get the AI's next move"""
        # First check if AI should pass
        if self.should_pass(game):
            return None

        valid_moves = self._get_valid_moves(game)

        if not valid_moves:
            return None  # Pass turn

        # Early game: Play on corners or edges
        if len(game.move_history) < 10:
            corner_moves = self._get_corner_moves(game, valid_moves)
            if corner_moves:
                return self._add_randomness(corner_moves)

        # Evaluate all valid moves
        move_scores = []
        for move in valid_moves:
            try:
                score = self._evaluate_move(game, move)
                move_scores.append((move, score))
            except Exception as e:
                # Skip moves that cause evaluation errors
                print(f"Error evaluating move {move}: {e}")
                continue

        if not move_scores:
            return None  # No valid moves could be evaluated

        # Sort by score (highest first)
        move_scores.sort(key=lambda x: x[1], reverse=True)

        # Add some randomness based on difficulty
        top_moves = self._select_top_moves(move_scores)
        return self._add_randomness(top_moves)

    def _get_valid_moves(self, game: GoGame) -> List[Tuple[int, int]]:
        """Get all valid moves for current position"""
        valid_moves = []
        for row in range(game.board_size):
            for col in range(game.board_size):
                if game.board[row][col] == Player.EMPTY:
                    # Test if move is legal
                    if not game.is_suicide_move(
                        row, col, self.player
                    ) and not game.violates_ko(row, col):
                        valid_moves.append((row, col))
        return valid_moves

    def _get_corner_moves(
        self, game: GoGame, valid_moves: List[Tuple[int, int]]
    ) -> List[Tuple[int, int]]:
        """Get corner and edge moves for opening play"""
        corner_moves = []
        board_size = game.board_size

        # Corners and near-corner positions
        corner_positions = [
            (3, 3),
            (3, board_size - 4),
            (board_size - 4, 3),
            (board_size - 4, board_size - 4),
            (2, 3),
            (3, 2),
            (2, board_size - 4),
            (3, board_size - 3),
            (board_size - 3, 3),
            (board_size - 4, 2),
            (board_size - 3, board_size - 4),
            (board_size - 4, board_size - 3),
        ]

        for move in valid_moves:
            if move in corner_positions:
                corner_moves.append(move)

        return corner_moves

    def _evaluate_move(self, game: GoGame, move: Tuple[int, int]) -> float:
        """Evaluate a potential move and return a score"""
        row, col = move

        # Create a temporary game state to test the move
        temp_game = copy.deepcopy(game)
        temp_game.current_player = self.player
        temp_game.make_move(row, col)

        score = 0.0

        # 1. Capture evaluation
        score += (
            self._evaluate_captures(temp_game, move) * self.config["capture_weight"]
        )

        # 2. Liberty evaluation
        score += (
            self._evaluate_liberties(temp_game, move) * self.config["liberty_weight"]
        )

        # 3. Territory evaluation
        score += (
            self._evaluate_territory(temp_game, move) * self.config["territory_weight"]
        )

        # 4. Defense evaluation
        score += self._evaluate_defense(game, move)

        # 5. Pattern evaluation
        score += self._evaluate_patterns(game, move)

        return score

    def _evaluate_captures(self, temp_game: GoGame, move: Tuple[int, int]) -> float:
        """Evaluate capture potential of a move"""
        row, col = move
        score = 0.0

        # Check how many opponent stones this move captures
        original_captured = temp_game.captured_stones[self.player]

        # Look for immediate captures
        for neighbor_row, neighbor_col in temp_game.get_neighbors(row, col):
            if temp_game.board[neighbor_row][neighbor_col] == self.opponent:
                group = temp_game.get_group(neighbor_row, neighbor_col)
                liberties = temp_game.get_liberties(group)

                # If opponent group has few liberties, this move is valuable
                if len(liberties) <= 1:
                    score += len(group) * 10  # High score for capturing
                elif len(liberties) == 2:
                    score += len(group) * 5  # Medium score for threatening

        return score

    def _evaluate_liberties(self, temp_game: GoGame, move: Tuple[int, int]) -> float:
        """Evaluate liberty situation after move"""
        row, col = move
        score = 0.0

        # Get our group after the move
        our_group = temp_game.get_group(row, col)
        our_liberties = temp_game.get_liberties(our_group)

        # Score based on number of liberties
        liberty_count = len(our_liberties)
        if liberty_count >= 4:
            score += 3
        elif liberty_count == 3:
            score += 1
        elif liberty_count == 2:
            score -= 1
        elif liberty_count == 1:
            score -= 5  # Dangerous situation

        return score

    def _evaluate_territory(self, temp_game: GoGame, move: Tuple[int, int]) -> float:
        """Evaluate territorial influence of move"""
        row, col = move
        score = 0.0

        # Simple territory evaluation: count empty spaces we influence
        influence_radius = 3
        for dr in range(-influence_radius, influence_radius + 1):
            for dc in range(-influence_radius, influence_radius + 1):
                new_row, new_col = row + dr, col + dc
                if (
                    0 <= new_row < temp_game.board_size
                    and 0 <= new_col < temp_game.board_size
                    and temp_game.board[new_row][new_col] == Player.EMPTY
                ):

                    distance = abs(dr) + abs(dc)
                    if distance <= influence_radius:
                        score += 1.0 / (distance + 1)

        return score

    def _evaluate_defense(self, game: GoGame, move: Tuple[int, int]) -> float:
        """Evaluate defensive value of move"""
        row, col = move
        score = 0.0

        # Check if this move helps defend our groups
        for neighbor_row, neighbor_col in game.get_neighbors(row, col):
            if game.board[neighbor_row][neighbor_col] == self.player:
                group = game.get_group(neighbor_row, neighbor_col)
                liberties = game.get_liberties(group)

                # If our group is in danger, this move is valuable for defense
                if len(liberties) <= 2:
                    score += len(group) * 8

        return score

    def _evaluate_patterns(self, game: GoGame, move: Tuple[int, int]) -> float:
        """Evaluate common Go patterns"""
        row, col = move
        score = 0.0

        # Avoid playing on first and second lines unless necessary
        if (
            row == 0
            or row == game.board_size - 1
            or col == 0
            or col == game.board_size - 1
        ):
            score -= 2
        if (
            row == 1
            or row == game.board_size - 2
            or col == 1
            or col == game.board_size - 2
        ):
            score -= 1

        # Prefer playing near existing stones (connection)
        for neighbor_row, neighbor_col in game.get_neighbors(row, col):
            if game.board[neighbor_row][neighbor_col] == self.player:
                score += 2

        return score

    def _select_top_moves(
        self, move_scores: List[Tuple[Tuple[int, int], float]]
    ) -> List[Tuple[int, int]]:
        """Select top moves based on difficulty"""
        if not move_scores:
            return []

        # Select top N moves based on difficulty
        top_n = min(5, max(1, len(move_scores) // 3))
        top_moves = [move for move, score in move_scores[:top_n]]

        return top_moves

    def _add_randomness(self, moves: List[Tuple[int, int]]) -> Optional[Tuple[int, int]]:
        """Add randomness based on difficulty level"""
        if not moves:
            return None

        random_factor = self.config["random_factor"]

        if random.random() < random_factor:
            # Sometimes pick a random move from the list
            return random.choice(moves)
        else:
            # Usually pick the first (best) move
            return moves[0]

    def should_pass(self, game: GoGame) -> bool:
        """Determine if AI should pass instead of making a move"""
        valid_moves = self._get_valid_moves(game)

        # Pass if no valid moves
        if not valid_moves:
            return True

        # Count empty spaces
        empty_spaces = sum(row.count(Player.EMPTY) for row in game.board)
        total_spaces = game.board_size * game.board_size

        # If very few moves left, be more likely to pass
        if empty_spaces < 10:  # Less than 10 empty spaces
            return True

        # Simple endgame detection: if very few empty spaces and no good moves
        if empty_spaces / total_spaces < 0.15:  # Less than 15% empty
            try:
                # Evaluate if any move is worth more than a threshold
                best_score = -float("inf")
                moves_to_check = min(3, len(valid_moves))  # Check fewer moves for speed

                for i, move in enumerate(valid_moves[:moves_to_check]):
                    try:
                        score = self._evaluate_move(game, move)
                        best_score = max(best_score, score)
                    except Exception:
                        # If evaluation fails, skip this move
                        continue

                # Lower threshold for passing in endgame
                if best_score < 1:  # Lower threshold
                    return True
            except Exception:
                # If any error occurs during evaluation, just pass
                return True

        return False
