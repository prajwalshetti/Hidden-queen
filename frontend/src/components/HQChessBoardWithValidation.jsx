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
            console.log(move)
            if(move&&(move.captured=="k"||move.captured=="K")){
                handleKingCapture(move);
                return true;
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

    function handleKingCapture(move){
        const from=move.from;
        const to=move.to;
        const prevFen=move.before;

        //logic to swap the piece on from and to in prevFen
        const newFen=swapSquares(from,to,prevFen);

        setGame(new Chess(newFen));
        socket.emit("move", { move: newFen, roomID });

        socket.emit("kingCaptured", { roomID, winner: playerRole });
    }

    function swapSquares(square1, square2, fen) {
        // Parse the FEN string to get the board position part
        const fenParts = fen.split(" ");
        const boardPosition = fenParts[0];
        
        // Convert algebraic notation to board indices
        const files = "abcdefgh";
        const ranks = "87654321";
        
        const file1 = files.indexOf(square1[0].toLowerCase());
        const rank1 = ranks.indexOf(square1[1]);
        const file2 = files.indexOf(square2[0].toLowerCase());
        const rank2 = ranks.indexOf(square2[1]);
        
        // Validate squares
        if (file1 === -1 || rank1 === -1 || file2 === -1 || rank2 === -1) {
            throw new Error("Invalid square notation. Must be in format like 'e4'");
        }
        
        // Parse board into 2D array
        const board = [];
        const rows = boardPosition.split("/");
        
        for (const row of rows) {
            const boardRow = [];
            for (const char of row) {
                if (isNaN(char)) {
                    // It's a piece
                    boardRow.push(char);
                } else {
                    // It's a number representing empty squares
                    const emptyCount = parseInt(char);
                    for (let i = 0; i < emptyCount; i++) {
                        boardRow.push("");
                    }
                }
            }
            board.push(boardRow);
        }
        
        // Swap pieces
        const temp = board[rank1][file1];
        board[rank1][file1] = board[rank2][file2];
        board[rank2][file2] = temp;
        
        // Convert back to FEN notation
        const newRows = [];
        for (const row of board) {
            let newRow = "";
            let emptyCount = 0;
            
            for (const square of row) {
                if (square === "") {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        newRow += emptyCount;
                        emptyCount = 0;
                    }
                    newRow += square;
                }
            }
            
            if (emptyCount > 0) {
                newRow += emptyCount;
            }
            
            newRows.push(newRow);
        }
        
        // Replace the board position part in the FEN
        fenParts[0] = newRows.join("/");
        
        // Return the complete FEN string
        return fenParts.join(" ");
    }
    
    // Custom pieces.
    
    const pieces = customPieces(playerRole, hqwstatus, hqwsquare, hqbstatus, hqbsquare,socket);

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