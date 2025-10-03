//07-04-24
//ChessBoardWithValidation.jsx
// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef, useCallback } from "react";
import { Chess } from "chess.js";
import { CustomPiecesNF } from './CustomPiecesNF.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function FBChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded, boardOrientation, isConnected, botDifficulty = 10 }) {
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);
    
    // Touch-based move states
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [botLastMove, setBotLastMove] = useState(null);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
    const makeMove = useCallback(async (sourceSquare, targetSquare) => {
        if (gameEnded || !isConnected) return false;
        const isBotGame = typeof roomID === "string" && roomID.startsWith("BOT_");
        const turn = game.turn();
        if (turn === 'w') {
            // allow human move
        } else {
            if (isBotGame) return false; // bot plays black
            if (playerRole !== 'b') return false;
        }

        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q", // Always promote to queen
            });

            if (move === null) return false;

            const afterHumanFen = game.fen();
            setGame(new Chess(afterHumanFen));
            setBotLastMove(null);
            socket.emit("move", { move: afterHumanFen, roomID, from: sourceSquare, to: targetSquare });

            console.log(playerRole, targetSquare);
            
            // Check for goal scoring (Football Chess specific)
            if ((playerRole === 'w' && (targetSquare === 'e8' || targetSquare === 'd8')) ||
                (playerRole === 'b' && (targetSquare === 'e1' || targetSquare === 'd1'))) {
                socket.emit("goalScored", { roomID, color: playerRole });
                return true;
            }

            if (game.isCheckmate()) {
                socket.emit("checkmated", { roomID, winner: playerRole });
            } else if (game.isDraw()) {
                socket.emit("drawGame", { roomID });
            }

            // If bot game and it's black to move now, let bot move after a short delay
            if (isBotGame && new Chess(afterHumanFen).turn() === 'b') {
                try {
                    await delay(3000);
                    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/bot/move`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fen: afterHumanFen, difficulty: botDifficulty })
                    });
                    const data = await res.json();
                    if (data && data.bestmove) {
                        const uci = data.bestmove;
                        const from = uci.slice(0, 2);
                        const to = uci.slice(2, 4);
                        const promo = uci.length > 4 ? uci.slice(4, 5) : undefined;
                        const botGame = new Chess(afterHumanFen);
                        const reply = botGame.move({ from, to, promotion: promo || 'q' });
                        if (reply) {
                            const botFen = botGame.fen();
                            setGame(new Chess(botFen));
                            setBotLastMove({ from, to });
            
                            // ✅ Check for goal scoring (bot)
                            if (to === 'e1' || to === 'd1') {
                                socket.emit("goalScored", { roomID, color: "b" });
                                return true; // stop further play
                            }
            
                            // ✅ Notify parent for clock flip + state sync
                            try {
                                window.dispatchEvent(new CustomEvent('localBoardUpdate', { detail: { fen: botFen } }));
                            } catch {}
                        }
                    }
                } catch {}
            }
            

            return true;
        } catch (error) {
            return false;
        }
    }, [game, gameEnded, isConnected, playerRole, socket, roomID, botDifficulty]);

    // Original drag and drop handler
    async function onDrop(sourceSquare, targetSquare) {
        const success = await makeMove(sourceSquare, targetSquare);
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

    // Goal squares styling
    const customSquareStyles = {
        // White's goal squares (top of the board)
        e8: { 
            backgroundImage: 'linear-gradient(45deg, #f0f0f0 5%, #999 5%, #999 45%, #f0f0f0 45%, #f0f0f0 55%, #999 55%, #999 95%, #f0f0f0 95%)',
            backgroundSize: '20px 20px'
        },
        d8: { 
            backgroundImage: 'linear-gradient(45deg, #f0f0f0 5%, #999 5%, #999 45%, #f0f0f0 45%, #f0f0f0 55%, #999 55%, #999 95%, #f0f0f0 95%)',
            backgroundSize: '20px 20px'
        },
    
        // Black's goal squares (bottom of the board)
        e1: { 
            backgroundImage: 'linear-gradient(45deg, #f0f0f0 5%, #999 5%, #999 45%, #f0f0f0 45%, #f0f0f0 55%, #999 55%, #999 95%, #f0f0f0 95%)',
            backgroundSize: '20px 20px'
        },
        d1: { 
            backgroundImage: 'linear-gradient(45deg, #f0f0f0 5%, #999 5%, #999 45%, #f0f0f0 45%, #f0f0f0 55%, #999 55%, #999 95%, #f0f0f0 95%)',
            backgroundSize: '20px 20px'
        },
    };

    // Merge all square styles: goal squares + last move + selection/possible moves
    const mergedSquareStyles = useCallback(() => {
        const goalStyles = customSquareStyles;
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

        // Start with goal styles
        let merged = { ...goalStyles };
        
        // If bot highlighted move exists, prefer it over server lastMoveStyles
        if (botLastMove && botLastMove.from && botLastMove.to) {
            merged[botLastMove.from] = { ...(merged[botLastMove.from]||{}), backgroundColor: 'rgba(255, 235, 59, 0.35)' };
            merged[botLastMove.to] = { ...(merged[botLastMove.to]||{}), backgroundColor: 'rgba(255, 235, 59, 0.35)' };
        } else {
            // Add last move styles when no bot move is present
            for (const square in lastMoveStyles) {
                if (goalStyles[square]) {
                    merged[square] = {
                        ...goalStyles[square],
                        boxShadow: 'inset 0 0 0 3px yellow',
                    };
                } else {
                    merged[square] = lastMoveStyles[square];
                }
            }
        }
        
        // Add selection styles (highest priority)
        for (const square in selectionStyles) {
            if (goalStyles[square]) {
                // Combine goal pattern with selection styles
                merged[square] = {
                    ...goalStyles[square],
                    ...selectionStyles[square],
                    // Combine box-shadows if both exist
                    boxShadow: `${goalStyles[square].boxShadow || ''} ${selectionStyles[square].boxShadow || ''}`.trim() || selectionStyles[square].boxShadow
                };
            } else if (lastMoveStyles[square]) {
                // Combine last move with selection styles
                merged[square] = {
                    ...lastMoveStyles[square],
                    ...selectionStyles[square],
                    // Selection styles take precedence for overlapping properties
                };
            } else {
                merged[square] = selectionStyles[square];
            }
        }
        
        return merged;
    }, [getSquareStyles, selectedSquare, possibleMoves, game, botLastMove]);

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
                    customSquareStyles={mergedSquareStyles()}
                    boardOrientation={(playerRole === "b" || boardOrientation === "black-below") ? "black" : "white"}
                />
            </div>
        </div>
    );
}

export default FBChessBoardWithValidation;