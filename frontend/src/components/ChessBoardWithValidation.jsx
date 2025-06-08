//07-04-24
//ChessBoardWithValidation.jsx
// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef, useCallback } from "react";
import { Chess } from "chess.js";
import { CustomPiecesNF } from './CustomPiecesNF.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function ChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded, boardOrientation, isConnected }) {
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);
    
    // Touch-based move states
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);

    useEffect(() => {
        const newGame = new Chess();
        newGame.load(boardState);
        setGame(newGame);
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

    // Make move function (used by both drag and touch)
    const makeMove = useCallback((sourceSquare, targetSquare) => {
        if (gameEnded || !isConnected) return false;
        if (playerRole !== "w" && playerRole !== "b") return false;
        if ((playerRole === "w" && game.turn() !== "w") || (playerRole === "b" && game.turn() !== "b")) return false;

        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q", // Always promote to queen
            });

            if (move === null) return false;

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
    }, [game, gameEnded, isConnected, playerRole, socket, roomID]);

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
                    customPieces={CustomPiecesNF(playerRole, socket, pieceTheme)}
                    boardWidth={boardSize}
                    areArrowsAllowed={true}
                    animationDuration={200}
                    boardOrientation={(playerRole === "b" || boardOrientation === "black-below") ? "black" : "white"}
                    customSquareStyles={getCustomSquareStyles()}
                />
            </div>
        </div>
    );
}

export default ChessBoardWithValidation;