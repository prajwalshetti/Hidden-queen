import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js";

function ChessBoard() {
  // Initialize chess.js instance just for FEN handling and board state
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  
  // Function to handle piece movement with no validation
  function onDrop(sourceSquare, targetSquare) {
    try {
      // Get the piece at the source square
      const pieceObj = game.get(sourceSquare);
      if (!pieceObj) return false;
      
      // Create a new game instance with the current position
      const newGame = new Chess(game.fen());
      
      // Remove any piece that might exist at the target square
      newGame.remove(targetSquare);
      
      // Remove the piece from the source square
      newGame.remove(sourceSquare);
      
      // Place the piece on the target square
      newGame.put(pieceObj, targetSquare);
      
      // Update the game state and position
      setGame(newGame);
      setPosition(newGame.fen());
      
      console.log(`Move from ${sourceSquare} to ${targetSquare}`);
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