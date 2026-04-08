import 'package:flutter/material.dart';
import '../models/game_state.dart';

class GameBoard extends StatelessWidget {
  final List<List<int>> board;
  final Player currentPlayer;
  final void Function(int row, int col) onMove;

  const GameBoard({
    super.key,
    required this.board,
    required this.currentPlayer,
    required this.onMove,
  });

  int get boardSize => board.length;

  @override
  Widget build(BuildContext context) {
    final double cellSize = (boardSize <= 9) ? 40.0 : (boardSize <= 13) ? 32.0 : 28.0;
    final double boardWidth = cellSize * boardSize;

    return Center(
      child: Container(
        width: boardWidth + 4,
        height: boardWidth + 4,
        decoration: BoxDecoration(
          color: const Color(0xFFDCB35C),
          border: Border.all(color: const Color(0xFF8B4513), width: 2),
        ),
        child: CustomPaint(
          painter: _BoardLinePainter(boardSize: boardSize, cellSize: cellSize),
          child: GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: boardSize,
            ),
            itemCount: boardSize * boardSize,
            itemBuilder: (context, index) {
              final row = index ~/ boardSize;
              final col = index % boardSize;
              final cell = board[row][col];

              return GestureDetector(
                onTap: () {
                  if (cell == Player.empty.value) {
                    onMove(row, col);
                  }
                },
                child: SizedBox(
                  width: cellSize,
                  height: cellSize,
                  child: Center(
                    child: cell != Player.empty.value
                        ? _Stone(
                            isBlack: cell == Player.black.value,
                            size: cellSize * 0.8,
                          )
                        : null,
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _Stone extends StatelessWidget {
  final bool isBlack;
  final double size;

  const _Stone({required this.isBlack, required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          center: const Alignment(-0.3, -0.3),
          colors: isBlack
              ? [const Color(0xFF555555), const Color(0xFF000000)]
              : [const Color(0xFFFFFFFF), const Color(0xFFDDDDDD)],
        ),
        border: Border.all(
          color: isBlack ? Colors.black : const Color(0xFFCCCCCC),
          width: 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x4D000000),
            offset: Offset(2, 2),
            blurRadius: 4,
          ),
        ],
      ),
    );
  }
}

class _BoardLinePainter extends CustomPainter {
  final int boardSize;
  final double cellSize;

  _BoardLinePainter({required this.boardSize, required this.cellSize});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..strokeWidth = 1.0;

    final half = cellSize / 2;

    // Draw grid lines
    for (int i = 0; i < boardSize; i++) {
      final pos = half + i * cellSize;

      // Horizontal line
      canvas.drawLine(
        Offset(half, pos),
        Offset(size.width - half, pos),
        paint,
      );

      // Vertical line
      canvas.drawLine(
        Offset(pos, half),
        Offset(pos, size.height - half),
        paint,
      );
    }

    // Draw star points for 19x19 board
    if (boardSize == 19) {
      final starPaint = Paint()
        ..color = Colors.black
        ..style = PaintingStyle.fill;

      for (final r in [3, 9, 15]) {
        for (final c in [3, 9, 15]) {
          canvas.drawCircle(
            Offset(half + c * cellSize, half + r * cellSize),
            3.0,
            starPaint,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
