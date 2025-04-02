import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js";

// Custom Chess class to allow 3-step pawn moves
class CustomChess extends Chess {
  move(move) {
    const piece = this.get(move.from);
    if (
      piece &&
      piece.type === "p" &&
      Math.abs(move.to.charCodeAt(1) - move.from.charCodeAt(1)) === 3
    ) {
      // Ensure the path is clear for the 3-step move
      const direction = move.to.charCodeAt(1) > move.from.charCodeAt(1) ? 1 : -1;
      for (let i = 1; i <= 2; i++) {
        const intermediateSquare =
          move.from[0] + String.fromCharCode(move.from.charCodeAt(1) + i * direction);
        if (this.get(intermediateSquare)) return null; // Blocked path
      }

      // Ensure the target square is empty
      if (this.get(move.to)) return null;

      // Manually move the pawn while maintaining turn order
      this.remove(move.from);
      this.put(piece, move.to);
      // Switch turn after the move
      this.turn = this.turn === "w" ? "b" : "w"; // Switch turn
      return { from: move.from, to: move.to, piece: piece.type };
    }
    return super.move(move); // Default move validation
  }
}

function ChessBoard() {
  // Use CustomChess instead of Chess
  const [game, setGame] = useState(new CustomChess());
  const [position, setPosition] = useState(game.fen());

  function onDrop(sourceSquare, targetSquare) {
    try {
      const newGame = new CustomChess();
      newGame.load(game.fen()); // Load current state

      const move = newGame.move({ from: sourceSquare, to: targetSquare });
      if (!move) return false;

      setGame(newGame);
      setPosition(newGame.fen());
      return true;
    } catch (error) {
      console.error("Error making move:", error);
      return false;
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div style={{ width: "400px", height: "400px" }}>
        <Chessboard
          position={position}
          onPieceDrop={onDrop}
          boardWidth={400}
          areArrowsAllowed={true}
          animationDuration={200}
        />
      </div>
    </div>
  );
}

export default ChessBoard;
