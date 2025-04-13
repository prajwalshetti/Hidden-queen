//@pranav take this and test HQChessBoardWithValidation
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
// In a backend script, for instance backend/index.mjs:
import { Chess } from '../../../lib/chess.js';
import { customPieces } from './CustomPieces.jsx';

function HQChessBoardWithValidation({ socket, roomID, playerRole, boardState, hiddenQueenData }) {
    const { hqwsquare, hqbsquare, hqwstatus, hqbstatus, setHqwsquare, setHqbsquare, setHqwstatus, setHqbstatus } = hiddenQueenData;
    const [game, setGame] = useState(new Chess());

    useEffect(() => {
        game.load(boardState);
        setGame(new Chess(game.fen()));
    }, [boardState]);

    function isNonPawnMove(move) {
        // Only check for illegal pawn moves if move was from HQ square
        const from = move.from;
        const to = move.to;

        const fileDiff = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
        const rankDiff = parseInt(to[1]) - parseInt(from[1]);

        const isCapture = move.flags.includes("c"); // normal capture flag

        if (playerRole === "w") {
            // White pawn logic
            if (fileDiff === 0 && (rankDiff === 1 || (from[1] === "2" && rankDiff === 2))) return false;
            if (fileDiff === 1 && rankDiff === 1 && isCapture) return false;
        } else if (playerRole === "b") {
            // Black pawn logic
            if (fileDiff === 0 && (rankDiff === -1 || (from[1] === "7" && rankDiff === -2))) return false;
            if (fileDiff === 1 && rankDiff === -1 && isCapture) return false;
        }

        return true; // Not a normal pawn move → Hidden Queen revealed
    }

    function onDrop(sourceSquare, targetSquare) {
        if (playerRole !== "w" && playerRole !== "b") return false;
        if ((playerRole === "w" && game.turn() !== "w") || (playerRole === "b" && game.turn() !== "b")) return false;
    
        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
    
            if (move === null) return false;

            //Capture logic
            if (playerRole === "w" && hqbstatus < 3 && targetSquare === hqbsquare) {
                socket.emit("captureHQ", { roomID, color: "b" }); // Opponent's HQ
            }
            if (playerRole === "b" && hqwstatus < 3 && targetSquare === hqwsquare) {
                socket.emit("captureHQ", { roomID, color: "w" }); // Opponent's HQ
            }            
    
            // Reveal logic
            const isWhiteReveal = playerRole === "w" && hqwstatus === 1 && sourceSquare === hqwsquare && isNonPawnMove(move);
            const isBlackReveal = playerRole === "b" && hqbstatus === 1 && sourceSquare === hqbsquare && isNonPawnMove(move);
    
            if (isWhiteReveal || isBlackReveal) {
                socket.emit("revealHQ", { roomID, color: playerRole });
            }
    
            // Change HQ square if it was a normal move
            const movedHQWhite = playerRole === "w" && hqwstatus < 3 && sourceSquare === hqwsquare;
            const movedHQBlack = playerRole === "b" && hqbstatus < 3 && sourceSquare === hqbsquare;
    
            if (movedHQWhite || movedHQBlack) {
                socket.emit("changeHQSquare", {
                    roomID,
                    color: playerRole,
                    newSquare: targetSquare
                });
            }
    
            setGame(new Chess(game.fen()));
            socket.emit("move", { move: game.fen(), roomID });

            if (game.isCheckmate()) {
                socket.emit("checkmated", { roomID, winner: playerRole });
            } else if (game.isDraw()) {
                socket.emit("drawGame", { roomID });
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Custom pieces.
    
    const pieces = customPieces(playerRole, hqwstatus, hqwsquare, hqbstatus, hqbsquare);

    return (
        <div className="flex justify-center items-center">
            <div style={{ width: "400px", height: "400px" }}>     
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    boardWidth={400}
                    animationDuration={0}
                    boardOrientation={playerRole === "b" ? "black" : "white"}
                    customPieces={pieces}
/>
            </div>
        </div>
    );
}

export default HQChessBoardWithValidation;