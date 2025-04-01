import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js"; // You'll need to install this library

function ChessBoard() {
    // Initialize chess.js instance to handle game logic
    const [game, setGame] = useState(new Chess());
    
    // Function to handle piece movement
    function onDrop(sourceSquare, targetSquare) {
        try {
            // Attempt to make the move
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q", // Default promote to queen
            });
            
            // If move is invalid, return false to revert
            if (move === null) return false;
            
            // Update the game state
            setGame(new Chess(game.fen()));
            
            // For WebSocket implementation
            console.log(`Move from ${sourceSquare} to ${targetSquare}`);
            // TODO: Emit move to WebSocket
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    return (
        <div className="flex justify-center items-center">
            <div style={{ width: "400px", height: "400px" }}>
                <Chessboard 
                    position={game.fen()} 
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