import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef, useCallback } from "react";
import { Chess } from 'chess.js';
import { CustomPiecesPP } from './CustomPiecesPP.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function PPChessBoardWithValidation({ socket, roomID, playerRole, boardState, hiddenQueenData, gameEnded, boardOrientation, isConnected, botDifficulty = 10 }) {
const { hqwsquare, hqbsquare, hqwstatus, hqbstatus, setHqwsquare, setHqbsquare, setHqwstatus, setHqbstatus } = hiddenQueenData;
const [game, setGame] = useState(new Chess());
const { pieceTheme, setPieceTheme } = usePieceTheme();
const { getSquareStyles } = useLastMove(socket);


// Touch-based move states
const [selectedSquare, setSelectedSquare] = useState(null);
const [possibleMoves, setPossibleMoves] = useState([]);
const [botLastMove, setBotLastMove] = useState(null);
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

// Make move function (used by both drag and touch)
const makeMove = useCallback(async (sourceSquare, targetSquare) => {
    if (gameEnded || !isConnected) return false;
    const isBotGame = typeof roomID === 'string' && roomID.startsWith('BOT_');
    const turn = game.turn();
    if (turn === 'w') {
        // allow human
    } else {
        if (isBotGame) return false;
        if (playerRole !== 'b') return false;
    }

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
            setHqwsquare((move.promotion) ? "z1" : targetSquare);
            console.log(hqwsquare);
            socket.emit("changeHQSquare", {
                roomID,
                color: playerRole,
                newSquare: (move.promotion) ? "z1" : targetSquare
            });
        }
        console.log("Human move:", move);

        const afterHumanFen = game.fen();
        setGame(new Chess(afterHumanFen));
        setBotLastMove(null);
        socket.emit("move", { move: afterHumanFen, roomID, from: sourceSquare, to: targetSquare });

        const isEnPassant = move.flags && move.flags.includes('e');

        if (playerRole === "w" && hqbstatus < 3 && targetSquare === hqbsquare) {
            socket.emit("capturePP", { roomID, color: "b" }); // Opponent's PP
            return true;
        }
        if (playerRole === "b" && hqwstatus < 3 && targetSquare === hqwsquare) {
            socket.emit("capturePP", { roomID, color: "w" }); // Opponent's PP
            return true;
        }

        if (isEnPassant) {
            const capturedPawnSquare = targetSquare[0] + sourceSquare[1];
            if (playerRole === "w" && hqbstatus < 3 && capturedPawnSquare === hqbsquare) {
                socket.emit("capturePP", { roomID, color: "b" }); // Opponent's PP via en passant
                return true;
            }
            if (playerRole === "b" && hqwstatus < 3 && capturedPawnSquare === hqwsquare) {
                socket.emit("capturePP", { roomID, color: "w" }); // Opponent's PP via en passant
                return true;
            }
        }

        if (game.isCheckmate()) {
            socket.emit("checkmated", { roomID, winner: playerRole });
            return true;
        } else if (game.isDraw()) {
            socket.emit("drawGame", { roomID });
            return true;
        }

        // Bot reply (black) if bot game and now black to move
        if (isBotGame && new Chess(afterHumanFen).turn() === 'b') {
            try {
                await delay(3000);
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/bot/move`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
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

                        // Notify any local listeners (existing)
                        try { window.dispatchEvent(new CustomEvent('localBoardUpdate', { detail: { fen: botFen } })); } catch {}

                        // IMPORTANT: inform server of bot move so server can process capture/end conditions
                        socket.emit("move", { move: botFen, roomID, from, to });

                        // Check for PP capture by bot (normal capture)
                        // Bot here is black, so capturing white PP means color "w" PP was captured.
                        console.log(hqwsquare,to);
                        if ((movedHQWhite&&to === targetSquare) || (to===hqwsquare)) {
                            socket.emit("capturePP", { roomID, color: "w" });
                        }

                        // Check en-passant capture scenario for bot
                        const isEnPassantBot = reply.flags && reply.flags.includes('e');
                        if (isEnPassantBot) {
                            const capturedPawnSquareBot = to[0] + from[1];
                            if ((movedHQWhite&&capturedPawnSquareBot === targetSquare)||    (capturedPawnSquareBot === hqwsquare)) {
                                console.log("PP captured by bot");
                                socket.emit("capturePP", { roomID, color: "w" });
                            }
                        }

                        // After bot move, check for checkmate/draw and inform server
                        if (botGame.isCheckmate()) {
                            // Bot (black) delivered mate
                            socket.emit("checkmated", { roomID, winner: 'b' });
                        } else if (botGame.isDraw()) {
                            socket.emit("drawGame", { roomID });
                        }
                    }
                }
            } catch (err) {
                console.error("Bot move error:", err);
            }
        }

        return true;
    } catch (error) {
        console.error("makeMove error:", error);
        return false;
    }
}, [game, gameEnded, isConnected, playerRole, socket, roomID, hqwsquare, hqbsquare, hqwstatus, hqbstatus, botDifficulty]);

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

// Handle square click/touch (await move result now)
const onSquareClick = useCallback(async (square) => {
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

    // Try to make a move (await)
    const success = await makeMove(selectedSquare, square);
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
    const botStyles = {};
    if (botLastMove) {
        botStyles[botLastMove.from] = { backgroundColor: 'rgba(255, 235, 59, 0.35)' };
        botStyles[botLastMove.to] = { backgroundColor: 'rgba(255, 235, 59, 0.35)' };
    }
    const base = botLastMove ? {} : lastMoveStyles;
    return { ...base, ...selectionStyles, ...botStyles };
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
                boardWidth={boardSize}
                animationDuration={200}
                boardOrientation={(playerRole === "b" || boardOrientation === "black-below") ? "black" : "white"}
                customPieces={CustomPiecesPP(playerRole, hqwsquare, hqbsquare, socket, pieceTheme)}
                customSquareStyles={getCustomSquareStyles()}
            />
        </div>
    </div>
);


}

export default PPChessBoardWithValidation;
