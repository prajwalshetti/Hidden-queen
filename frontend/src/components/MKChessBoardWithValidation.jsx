import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef, useCallback } from "react";// In a backend script, for instance backend/index.mjs:
import { Chess } from '../../lib/chess.js';
import { customPieces } from './CustomPiecesMK.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function MKChessBoardWithValidation({ socket, roomID, playerRole, boardState, hiddenQueenData,gameEnded, boardOrientation,isConnected }) {
    const { hqwsquare, hqbsquare, hqwstatus, hqbstatus, setHqwsquare, setHqbsquare, setHqwstatus, setHqbstatus } = hiddenQueenData;
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);
    
    // Touch-based move states
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);

    useEffect(() => {
        game.load(boardState);
        setGame(new Chess(game.fen()));
        // Clear selection when board state changes (opponent moved)
        setSelectedSquare(null);
        setPossibleMoves([]);
    }, [boardState]);

    // Get possible moves for a piece on a square
    const getPossibleMoves = useCallback((square) => {
        try {
            const moves = game.moves({ square, verbose: true });
            return moves.map(move => move.to);
        } catch (error) {
            return [];
        }
    }, [game]);

    function isNonPawnMove(move) {
        const from = move.from;
        const to = move.to;

        const fileDiff = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
        const rankDiff = parseInt(to[1]) - parseInt(from[1]);

        const isCapture = move.flags.includes("c"); // normal capture flag

        if (playerRole === "w") {
            // White pawn logic
            if (!isCapture && fileDiff === 0 && (rankDiff === 1 || (from[1] === "2" && rankDiff === 2))) return false;
            if (fileDiff === 1 && rankDiff === 1 && isCapture) return false;
        } else if (playerRole === "b") {
            // Black pawn logic
            if (!isCapture && fileDiff === 0 && (rankDiff === -1 || (from[1] === "7" && rankDiff === -2))) return false;
            if (fileDiff === 1 && rankDiff === -1 && isCapture) return false;
        }

        return true; // Not a normal pawn move → Hidden Queen revealed
    }

    // Make move function (used by both drag and touch)
    const makeMove = useCallback((sourceSquare, targetSquare) => {
        if(gameEnded||!isConnected)return false;
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
            socket.emit("move", { move: game.fen(), roomID, from: sourceSquare, to: targetSquare });

            if (game.isCheckmate()) {
                socket.emit("checkmated", { roomID, winner: playerRole });
            } else if (game.isDraw()) {
                socket.emit("drawGame", { roomID });
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }, [game, gameEnded, isConnected, playerRole, socket, roomID, hqwsquare, hqbsquare, hqwstatus, hqbstatus]);

    // Original drag and drop handler
    function onDrop(sourceSquare, targetSquare) {
        const success = makeMove(sourceSquare, targetSquare);
        // Clear selection after drag move
        if (success) {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
        return success;
    }

    // Handle square click/touch
    const onSquareClick = useCallback((square) => {
        if (gameEnded || !isConnected) return;
        if (playerRole !== "w" && playerRole !== "b") return;
        if ((playerRole === "w" && game.turn() !== "w") || (playerRole === "b" && game.turn() !== "b")) return;

        const piece = game.get(square);
        
        // If no piece is selected
        if (!selectedSquare) {
            // If clicked square has a piece of current player's turn
            if (piece && piece.color === playerRole) {
                setSelectedSquare(square);
                const moves = getPossibleMoves(square);
                setPossibleMoves(moves);
            }
            return;
        }

        // If same square is clicked again, deselect
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setPossibleMoves([]);
            return;
        }

        // If clicking on another piece of same color, select that piece instead
        if (piece && piece.color === playerRole) {
            setSelectedSquare(square);
            const moves = getPossibleMoves(square);
            setPossibleMoves(moves);
            return;
        }

        // Try to make a move
        const success = makeMove(selectedSquare, square);
        if (success) {
            setSelectedSquare(null);
            setPossibleMoves([]);
        } else {
            // Invalid move, deselect
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    }, [game, gameEnded, isConnected, playerRole, selectedSquare, getPossibleMoves, makeMove]);

    function handleKingCapture(move){
        const from=move.from;
        const to=move.to;
        const prevFen=move.before;

        //logic to swap the piece on from and to in prevFen
        const newFen=swapSquares(from,to,prevFen);

        // setGame(new Chess(newFen));
        socket.emit("move", { move: newFen, roomID, from,to });

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
    
    // Combine square styles from useLastMove hook with selection/possible moves styles
    const getCustomSquareStyles = useCallback(() => {
        const lastMoveStyles = getSquareStyles();
        const selectionStyles = {};
        
        // Highlight selected square
        if (selectedSquare) {
            selectionStyles[selectedSquare] = {
                backgroundColor: 'rgba(255, 255, 0, 0.6)',
                boxShadow: 'inset 0 0 0 4px rgba(255, 255, 0, 0.8)'
            };
        }
        
        // Highlight possible moves
        possibleMoves.forEach(square => {
            const piece = game.get(square);
            if (piece) {
                // If there's a piece on the target square (capture move)
                selectionStyles[square] = {
                    // background: 'radial-gradient(circle, rgba(255, 0, 0, 0.3) 40%, transparent 40%)',
                    // boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.6)'
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 0 1px rgba(35, 12, 239, 0.6)'
                };
            } else {
                // Empty square (normal move)
                selectionStyles[square] = {
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)'
                };
            }
        });

        // Merge styles (selection styles will override last move styles if there's overlap)
        return { ...lastMoveStyles, ...selectionStyles };
    }, [getSquareStyles, selectedSquare, possibleMoves, game]);
    
    // Custom pieces.
    const pieces = customPieces(playerRole,socket,pieceTheme);

    const containerRef = useRef(null);
    const [boardSize, setBoardSize] = useState(400);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const size = Math.min(containerRef.current.offsetWidth, 400); 
                setBoardSize(size);
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div className="flex justify-center items-center overflow-hidden" ref={containerRef}>
            <div style={{ width: boardSize, height: boardSize }}>
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    boardWidth={boardSize}
                    animationDuration={200}
                    areArrowsAllowed={true}
                    boardOrientation={(playerRole==="b" || boardOrientation === "black-below") ? "black" : "white"}
                    customPieces={pieces}
                    customSquareStyles={getCustomSquareStyles()}
                />
            </div>
        </div>
    );
}

export default MKChessBoardWithValidation;