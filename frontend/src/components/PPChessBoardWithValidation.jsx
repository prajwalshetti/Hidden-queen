//@pranav take this and test PPChessBoardWithValidation
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
// In a backend script, for instance backend/index.mjs:
import { Chess } from 'chess.js';
import { CustomPiecesPP } from './CustomPiecesPP.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function PPChessBoardWithValidation({ socket, roomID, playerRole, boardState, hiddenQueenData,gameEnded, boardOrientation }) {
    const { hqwsquare, hqbsquare, hqwstatus, hqbstatus, setHqwsquare, setHqbsquare, setHqwstatus, setHqbstatus } = hiddenQueenData;
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);

    useEffect(() => {
        game.load(boardState);
        setGame(new Chess(game.fen()));
    }, [boardState]);

    function onDrop(sourceSquare, targetSquare) {
        if(gameEnded) return;
        if (playerRole !== "w" && playerRole !== "b") return false;
        if ((playerRole === "w" && game.turn() !== "w") || (playerRole === "b" && game.turn() !== "b")) return false;
    
        try {
            // Store board state before the move to detect en passant captures
            const prevBoard = game.board();
            
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
    
            if (move === null) return false;
            
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
            console.log(move);
            
            setGame(new Chess(game.fen()));
            socket.emit("move", { move: game.fen(), roomID, from: sourceSquare, to: targetSquare });

            const isEnPassant = move.flags.includes('e');
            
            if (playerRole === "w" && hqbstatus < 3 && targetSquare === hqbsquare) {
                socket.emit("capturePP", { roomID, color: "b" }); // Opponent's PP
            }
            if (playerRole === "b" && hqwstatus < 3 && targetSquare === hqwsquare) {
                socket.emit("capturePP", { roomID, color: "w" }); // Opponent's PP
            }
            
            if (isEnPassant) {
                const capturedPawnSquare = targetSquare[0] + sourceSquare[1];
                if (playerRole === "w" && hqbstatus < 3 && capturedPawnSquare === hqbsquare) {
                    socket.emit("capturePP", { roomID, color: "b" }); // Opponent's PP via en passant
                }
                if (playerRole === "b" && hqwstatus < 3 && capturedPawnSquare === hqwsquare) {
                    socket.emit("capturePP", { roomID, color: "w" }); // Opponent's PP via en passant
                }
            }
    
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
    
    return (
        <div className="flex justify-center items-center">
            <div style={{ width: "400px", height: "400px" }}>     
            <Chessboard
  position={game.fen()}
  onPieceDrop={onDrop}
  boardWidth={400}
  animationDuration={400}
  boardOrientation={(playerRole==="b" || boardOrientation === "black-below") ? "black" : "white"}
  customPieces={CustomPiecesPP(playerRole, hqwsquare, hqbsquare, socket,pieceTheme )}
  customSquareStyles={getSquareStyles()}
/>
            </div>
        </div>
    );
}

export default PPChessBoardWithValidation;