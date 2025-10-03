// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef, useCallback } from "react";
import { Chess } from "chess.js";
import { CustomPiecesNF } from './CustomPiecesNF.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx';

function ChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded, boardOrientation, isConnected, botDifficulty = 10 }) {
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);
    
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [botLastMove, setBotLastMove] = useState(null); // { from, to }

    useEffect(() => {
        const newGame = new Chess();
        newGame.load(boardState);
        setGame(newGame);
        setSelectedSquare(null);
        setPossibleMoves([]);
    }, [boardState]);

    const getPossibleMoves = useCallback((square) => {
        try {
            const moves = game.moves({ square, verbose: true });
            return moves.map(move => move.to);
        } catch (error) {
            return [];
        }
    }, [game]);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const makeMove = useCallback(async (sourceSquare, targetSquare) => {
        if (gameEnded || !isConnected) return false;
        
        const isBotGame = typeof roomID === "string" && roomID.startsWith("BOT_");
        const effectiveRole = isBotGame ? "w" : playerRole;
        
        if (effectiveRole !== "w" && effectiveRole !== "b") return false;
        if ((effectiveRole === "w" && game.turn() !== "w") || (effectiveRole === "b" && game.turn() !== "b")) return false;

        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });

            if (move === null) return false;

            const newFen = game.fen();
            setGame(new Chess(newFen));
            // Human just moved, clear any previous bot highlight
            setBotLastMove(null);
            try { window.dispatchEvent(new CustomEvent('localBoardUpdate', { detail: { fen: newFen } })); } catch {}

            // Emit move for both multiplayer and bot games
            socket.emit("move", { move: newFen, roomID, from: sourceSquare, to: targetSquare });

            // Check for game end
            if (game.isCheckmate()) {
                socket.emit("checkmated", { roomID, winner: effectiveRole });
            } else if (game.isDraw()) {
                socket.emit("drawGame", { roomID });
            }

            // If it's a bot game and now it's black to move, let the bot move
            if (isBotGame) {
                const afterHuman = new Chess(newFen);
                if (afterHuman.turn() === 'b') {
                    try {
                        await delay(3000);
                        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/bot/move`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fen: newFen, difficulty: botDifficulty })
                        });
                        const data = await res.json();
                        if (data && data.bestmove) {
                            const uci = data.bestmove;
                            const from = uci.slice(0, 2);
                            const to = uci.slice(2, 4);
                            const promo = uci.length > 4 ? uci.slice(4, 5) : undefined;

                            const botGame = new Chess(newFen);
                            const reply = botGame.move({ from, to, promotion: promo || 'q' });
                            if (reply) {
                                const botFen = botGame.fen();
                                setGame(new Chess(botFen));
                                setBotLastMove({ from, to });
                                try { window.dispatchEvent(new CustomEvent('localBoardUpdate', { detail: { fen: botFen } })); } catch {}
                                // do not emit to server in bot mode to avoid role checks; if needed, uncomment next line
                                // socket.emit('move', { move: botFen, roomID });
                            }
                        }
                    } catch (e) {
                        // ignore bot errors
                    }
                }
            }

            return true;
        } catch (error) {
            return false;
        }
    }, [game, gameEnded, isConnected, playerRole, socket, roomID, botDifficulty]);

    async function onDrop(sourceSquare, targetSquare) {
        const success = await makeMove(sourceSquare, targetSquare);
        if (success) {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
        return success;
    }

    const onSquareClick = useCallback((square) => {
        if (gameEnded || !isConnected) return;
        if (playerRole !== "w" && playerRole !== "b") return;
        if ((playerRole === "w" && game.turn() !== "w") || (playerRole === "b" && game.turn() !== "b")) return;

        const piece = game.get(square);
        
        if (!selectedSquare) {
            if (piece && piece.color === playerRole) {
                setSelectedSquare(square);
                const moves = getPossibleMoves(square);
                setPossibleMoves(moves);
            }
            return;
        }

        if (selectedSquare === square) {
            setSelectedSquare(null);
            setPossibleMoves([]);
            return;
        }

        if (piece && piece.color === playerRole) {
            setSelectedSquare(square);
            const moves = getPossibleMoves(square);
            setPossibleMoves(moves);
            return;
        }

        const success = makeMove(selectedSquare, square);
        if (success) {
            setSelectedSquare(null);
            setPossibleMoves([]);
        } else {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    }, [game, gameEnded, isConnected, playerRole, selectedSquare, getPossibleMoves, makeMove]);

    const getCustomSquareStyles = useCallback(() => {
        const lastMoveStyles = getSquareStyles();
        const selectionStyles = {};
        
        if (selectedSquare) {
            selectionStyles[selectedSquare] = {
                backgroundColor: 'rgba(255, 255, 0, 0.6)',
                boxShadow: 'inset 0 0 0 4px rgba(255, 255, 0, 0.8)'
            };
        }
        
        possibleMoves.forEach(square => {
            const piece = game.get(square);
            if (piece) {
                selectionStyles[square] = {
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 0 1px rgba(35, 12, 239, 0.6)'
                };
            } else {
                selectionStyles[square] = {
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)'
                };
            }
        });

        // Highlight bot last move locally if present (when server doesn't broadcast lastMoveSquares)
        const botStyles = {};
        if (botLastMove && botLastMove.from && botLastMove.to) {
            botStyles[botLastMove.from] = {
                backgroundColor: 'rgba(255, 235, 59, 0.35)',
                // boxShadow: 'inset 0 0 0 3px rgba(255, 235, 59, 0.8)'
            };
            botStyles[botLastMove.to] = {
                backgroundColor: 'rgba(255, 235, 59, 0.35)',
                // boxShadow: 'inset 0 0 0 3px rgba(255, 235, 59, 0.8)'
            };
        }

        // If botStyles exist, prefer them over previous lastMoveStyles to avoid double highlights
        const baseStyles = (botLastMove && botLastMove.from && botLastMove.to) ? {} : lastMoveStyles;
        return { ...baseStyles, ...selectionStyles, ...botStyles };
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
                    boardOrientation={(playerRole === "b" || boardOrientation === "black-below") ? "black" : "white"}
                    customSquareStyles={getCustomSquareStyles()}
                />
            </div>
        </div>
    );
}

export default ChessBoardWithValidation;