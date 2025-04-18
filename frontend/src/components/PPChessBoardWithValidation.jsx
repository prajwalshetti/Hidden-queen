//@pranav take this and test PPChessBoardWithValidation
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
// In a backend script, for instance backend/index.mjs:
import { Chess } from 'chess.js';
import { CustomPiecesPP } from './CustomPiecesPP.jsx';

function PPChessBoardWithValidation({ socket, roomID, playerRole, boardState, hiddenQueenData,gameEnded, boardOrientation }) {
    const { hqwsquare, hqbsquare, hqwstatus, hqbstatus, setHqwsquare, setHqbsquare, setHqwstatus, setHqbstatus } = hiddenQueenData;
    const [game, setGame] = useState(new Chess());

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
    
            // Determine if this was an en passant capture
            const isEnPassant = move.flags.includes('e');
            
            // Capture logic for direct captures
            if (playerRole === "w" && hqbstatus < 3 && targetSquare === hqbsquare) {
                socket.emit("capturePP", { roomID, color: "b" }); // Opponent's PP
            }
            if (playerRole === "b" && hqwstatus < 3 && targetSquare === hqwsquare) {
                socket.emit("capturePP", { roomID, color: "w" }); // Opponent's PP
            }
            
            // En passant capture logic
            if (isEnPassant) {
                // For en passant, the captured pawn is on the same file as the target square
                // but on the same rank as the source square
                const capturedPawnSquare = targetSquare[0] + sourceSquare[1];
                
                if (playerRole === "w" && hqbstatus < 3 && capturedPawnSquare === hqbsquare) {
                    socket.emit("capturePP", { roomID, color: "b" }); // Opponent's PP via en passant
                }
                if (playerRole === "b" && hqwstatus < 3 && capturedPawnSquare === hqwsquare) {
                    socket.emit("capturePP", { roomID, color: "w" }); // Opponent's PP via en passant
                }
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
            console.log(move);
            
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

// Create a base64 encoded skull SVG image
// const skullSvgBase64 = `data:image/svg+xml;base64,${btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//       <path fill="#ffffff" d="M12,2A9,9,0,0,0,3,11c0,3.64,2.36,6.32,5,8v3h8V19c2.64-1.68,5-4.36,5-8A9,9,0,0,0,12,2Z M8,19v-1h2v1Zm6,0V18h2v1ZM17,11a5,5,0,0,1-5,5,5,5,0,0,1-5-5,5,5,0,0,1,5-5A5,5,0,0,1,17,11ZM8,9a1,1,0,1,0,2,0A1,1,0,0,0,8,9Zm6,0a1,1,0,1,0,2,0A1,1,0,0,0,14,9Zm-6,6a1,1,0,0,0,1,1h2a1,1,0,0,0,0-2H9A1,1,0,0,0,8,15Zm5,1h2a1,1,0,0,0,0-2H13a1,1,0,0,0,0,2Z"/>
//       <path fill="#5eff00" opacity="0.3" d="M17,11c0,2.76-2.24,5-5,5s-5-2.24-5-5,2.24-5,5-5,5,2.24,5,5Z"/>
//     </svg>
//     `)}`;
    
//     // Create another skull SVG for the bottom right corner
//     const smallSkullSvgBase64 = `data:image/svg+xml;base64,${btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//       <path fill="#ffffff" d="M12,2A9,9,0,0,0,3,11c0,3.64,2.36,6.32,5,8v3h8V19c2.64-1.68,5-4.36,5-8A9,9,0,0,0,12,2Z M8,19v-1h2v1Zm6,0V18h2v1ZM17,11a5,5,0,0,1-5,5,5,5,0,0,1-5-5,5,5,0,0,1,5-5A5,5,0,0,1,17,11ZM8,9a1,1,0,1,0,2,0A1,1,0,0,0,8,9Zm6,0a1,1,0,1,0,2,0A1,1,0,0,0,14,9Zm-6,6a1,1,0,0,0,1,1h2a1,1,0,0,0,0-2H9A1,1,0,0,0,8,15Zm5,1h2a1,1,0,0,0,0-2H13a1,1,0,0,0,0,2Z"/>
//       <path fill="#5eff00" opacity="0.3" d="M17,11c0,2.76-2.24,5-5,5s-5-2.24-5-5,2.24-5,5-5,5,2.24,5,5Z"/>
//     </svg>
//     `)}`;
    
//     // Define keyframes for pulsing effect
//     const pulseKeyframes = `
//     @keyframes pulseGlow {
//       0% { box-shadow: 0 0 8px 2px rgba(0, 255, 0, 0.4); }
//       50% { box-shadow: 0 0 12px 4px rgba(0, 255, 0, 0.7); }
//       100% { box-shadow: 0 0 8px 2px rgba(0, 255, 0, 0.4); }
//     }
//     `;
    
//     // Create style element for keyframes
//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = pulseKeyframes;
//     document.head.appendChild(styleElement);
    
//     // Updated custom square styles
//     const customSquareStyles = {};
    
//     if (playerRole === "w" && hqwsquare) {
//         customSquareStyles[hqwsquare] = { 
//             backgroundColor: "rgba(0, 255, 0, 0.4)",
//             backgroundImage: `url('${skullSvgBase64}'), url('${smallSkullSvgBase64}'), url('${smallSkullSvgBase64}')`,
//             backgroundSize: "40%, 30%, 30%",
//             backgroundPosition: "bottom right, top left, top right",
//             backgroundRepeat: "no-repeat, no-repeat, no-repeat",
//             boxShadow: "0 0 8px 2px rgba(0, 255, 0, 0.4)",
//             animation: "pulseGlow 2s infinite"
//         };
//     }
    
//     if (playerRole === "b" && hqbsquare) {
//         customSquareStyles[hqbsquare] = {
//             backgroundColor: "rgba(0, 255, 0, 0.4)",
//             backgroundImage: `url('${skullSvgBase64}'), url('${smallSkullSvgBase64}'), url('${smallSkullSvgBase64}')`,
//             backgroundSize: "40%, 30%, 30%",
//             backgroundPosition: "bottom right, top left, top right",
//             backgroundRepeat: "no-repeat, no-repeat, no-repeat",
//             boxShadow: "0 0 8px 2px rgba(0, 255, 0, 0.4)",
//             animation: "pulseGlow 2s infinite"
//         };
//     }

    
    return (
        <div className="flex justify-center items-center">
            <div style={{ width: "400px", height: "400px" }}>     
            <Chessboard
  position={game.fen()}
  onPieceDrop={onDrop}
  boardWidth={400}
  animationDuration={400}
  boardOrientation={(playerRole==="b" || boardOrientation === "black-below") ? "black" : "white"}
  customPieces={CustomPiecesPP(playerRole, hqwsquare, hqbsquare, socket )}
//   customSquareStyles={customSquareStyles}
/>
            </div>
        </div>
    );
}

export default PPChessBoardWithValidation;