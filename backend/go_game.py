from typing import List, Optional, Set, Tuple
from enum import Enum
import copy

class Player(Enum):
    EMPTY = 0
    BLACK = 1
    WHITE = 2

class GoGame:
    def __init__(self, board_size: int = 19):
        self.board_size = board_size
        self.board = [[Player.EMPTY for _ in range(board_size)] for _ in range(board_size)]
        self.current_player = Player.BLACK
        self.captured_stones = {Player.BLACK: 0, Player.WHITE: 0}
        self.move_history = []
        self.ko_position = None
        self.consecutive_passes = 0
        self.game_ended = False
        
    def get_neighbors(self, row: int, col: int) -> List[Tuple[int, int]]:
        """Get valid neighboring positions"""
        neighbors = []
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            new_row, new_col = row + dr, col + dc
            if 0 <= new_row < self.board_size and 0 <= new_col < self.board_size:
                neighbors.append((new_row, new_col))
        return neighbors
    
    def get_group(self, row: int, col: int) -> Set[Tuple[int, int]]:
        """Get all stones in the same group (connected stones of same color)"""
        if self.board[row][col] == Player.EMPTY:
            return set()
        
        group = set()
        color = self.board[row][col]
        stack = [(row, col)]
        
        while stack:
            current_row, current_col = stack.pop()
            if (current_row, current_col) in group:
                continue
                
            group.add((current_row, current_col))
            
            for neighbor_row, neighbor_col in self.get_neighbors(current_row, current_col):
                if (neighbor_row, neighbor_col) not in group and self.board[neighbor_row][neighbor_col] == color:
                    stack.append((neighbor_row, neighbor_col))
        
        return group
    
    def get_liberties(self, group: Set[Tuple[int, int]]) -> Set[Tuple[int, int]]:
        """Get all liberties (empty adjacent spaces) for a group"""
        liberties = set()
        for row, col in group:
            for neighbor_row, neighbor_col in self.get_neighbors(row, col):
                if self.board[neighbor_row][neighbor_col] == Player.EMPTY:
                    liberties.add((neighbor_row, neighbor_col))
        return liberties
    
    def capture_stones(self, opponent: Player) -> int:
        """Capture opponent stones with no liberties and return count"""
        captured_count = 0
        to_remove = []
        
        for row in range(self.board_size):
            for col in range(self.board_size):
                if self.board[row][col] == opponent:
                    group = self.get_group(row, col)
                    liberties = self.get_liberties(group)
                    
                    if len(liberties) == 0:
                        to_remove.extend(group)
                        captured_count += len(group)
        
        for row, col in to_remove:
            self.board[row][col] = Player.EMPTY
        
        return captured_count
    
    def is_suicide_move(self, row: int, col: int, player: Player) -> bool:
        """Check if move would be suicide (illegal)"""
        # Make temporary move
        temp_board = copy.deepcopy(self.board)
        temp_board[row][col] = player
        
        # Check if the placed stone's group has liberties
        temp_game = GoGame(self.board_size)
        temp_game.board = temp_board
        group = temp_game.get_group(row, col)
        liberties = temp_game.get_liberties(group)
        
        if len(liberties) > 0:
            return False
        
        # Check if move captures opponent stones
        opponent = Player.WHITE if player == Player.BLACK else Player.BLACK
        for neighbor_row, neighbor_col in temp_game.get_neighbors(row, col):
            if temp_board[neighbor_row][neighbor_col] == opponent:
                opponent_group = temp_game.get_group(neighbor_row, neighbor_col)
                opponent_liberties = temp_game.get_liberties(opponent_group)
                if len(opponent_liberties) == 0:
                    return False  # Move captures opponent, so it's not suicide
        
        return True
    
    def violates_ko(self, row: int, col: int) -> bool:
        """Check if move violates ko rule"""
        if self.ko_position is None:
            return False
        return (row, col) == self.ko_position
    
    def make_move(self, row: int, col: int) -> bool:
        """Make a move and return True if successful"""
        if not (0 <= row < self.board_size and 0 <= col < self.board_size):
            return False
        
        if self.board[row][col] != Player.EMPTY:
            return False
        
        if self.is_suicide_move(row, col, self.current_player):
            return False
            
        if self.violates_ko(row, col):
            return False
        
        # Make the move
        self.board[row][col] = self.current_player
        
        # Capture opponent stones
        opponent = Player.WHITE if self.current_player == Player.BLACK else Player.BLACK
        captured = self.capture_stones(opponent)
        self.captured_stones[self.current_player] += captured
        
        # Update ko position
        self.ko_position = None
        if captured == 1:
            # Check if this was a single stone capture that could create ko
            for neighbor_row, neighbor_col in self.get_neighbors(row, col):
                if self.board[neighbor_row][neighbor_col] == Player.EMPTY:
                    # Check if placing opponent stone here would capture only the stone we just placed
                    if not self.is_suicide_move(neighbor_row, neighbor_col, opponent):
                        temp_board = copy.deepcopy(self.board)
                        temp_board[neighbor_row][neighbor_col] = opponent
                        temp_game = GoGame(self.board_size)
                        temp_game.board = temp_board
                        temp_game.current_player = opponent
                        would_capture = temp_game.capture_stones(self.current_player)
                        if would_capture == 1:
                            self.ko_position = (neighbor_row, neighbor_col)
                            break
        
        # Reset consecutive passes since a move was made
        self.consecutive_passes = 0
        
        # Record move
        self.move_history.append((row, col, self.current_player))
        
        # Switch players
        self.current_player = Player.WHITE if self.current_player == Player.BLACK else Player.BLACK
        
        return True
    
    def pass_turn(self):
        """Pass the current turn"""
        self.move_history.append(None)  # None represents a pass
        self.consecutive_passes += 1
        
        # Check if game should end (both players passed consecutively)
        if self.consecutive_passes >= 2:
            self.game_ended = True
            print(f"Game ended: Both players passed consecutively")
        
        self.current_player = Player.WHITE if self.current_player == Player.BLACK else Player.BLACK
    
    def get_board_state(self):
        """Get current board state for API response"""
        return {
            'board': [[cell.value for cell in row] for row in self.board],
            'current_player': self.current_player.value,
            'captured_stones': {
                'black': self.captured_stones[Player.BLACK],
                'white': self.captured_stones[Player.WHITE]
            },
            'board_size': self.board_size,
            'game_ended': self.game_ended,
            'consecutive_passes': self.consecutive_passes
        }
    
    def reset_game(self):
        """Reset the game to initial state"""
        self.board = [[Player.EMPTY for _ in range(self.board_size)] for _ in range(self.board_size)]
        self.current_player = Player.BLACK
        self.captured_stones = {Player.BLACK: 0, Player.WHITE: 0}
        self.move_history = []
        self.ko_position = None
        self.consecutive_passes = 0
        self.game_ended = False
