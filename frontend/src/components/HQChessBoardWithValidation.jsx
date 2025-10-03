import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef, useCallback } from "react";
import { Chess } from '../../lib/chess.js';
import { customPieces } from './CustomPieces.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx';

function HQChessBoardWithValidation({ socket, roomID, playerRole, boardState, hiddenQueenData, gameEnded, boardOrientation, isConnected, botDifficulty = 10 }) {
    const { hqwsquare, hqbsquare, hqwstatus, hqbstatus, setHqwsquare, setHqbsquare, setHqwstatus, setHqbstatus } = hiddenQueenData;
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);
    
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [botLastMove, setBotLastMove] = useState(null);
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    useEffect(() => {
        game.load(boardState);
        setGame(new Chess(game.fen()));
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

    function isNonPawnMove(move) {
        const from = move.from;
        const to = move.to;

        const fileDiff = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
        const rankDiff = parseInt(to[1]) - parseInt(from[1]);

        const isCapture = move.flags.includes("c");

        if (playerRole === "w") {
            if (!isCapture && fileDiff === 0 && (rankDiff === 1 || (from[1] === "2" && rankDiff === 2))) return false;
            if (fileDiff === 1 && rankDiff === 1 && isCapture) return false;
        } else if (playerRole === "b") {
            if (!isCapture && fileDiff === 0 && (rankDiff === -1 || (from[1] === "7" && rankDiff === -2))) return false;
            if (fileDiff === 1 && rankDiff === -1 && isCapture) return false;
        }

        return true;
    }

    // Convert queen to pawn in FEN at specific square
    function disguiseQueenAsPawn(fen, square, color) {
        if (!square || square === "z1") return fen;
        
        const fenParts = fen.split(" ");
        const boardPosition = fenParts[0];
        
        const files = "abcdefgh";
        const ranks = "87654321";
        
        const file = files.indexOf(square[0].toLowerCase());
        const rank = ranks.indexOf(square[1]);
        
        if (file === -1 || rank === -1) return fen;
        
        const board = [];
        const rows = boardPosition.split("/");
        
        for (const row of rows) {
            const boardRow = [];
            for (const char of row) {
                if (isNaN(char)) {
                    boardRow.push(char);
                } else {
                    const emptyCount = parseInt(char);
                    for (let i = 0; i < emptyCount; i++) {
                        boardRow.push("");
                    }
                }
            }
            board.push(boardRow);
        }
        
        const piece = board[rank][file];
        const queenChar = color === 'w' ? 'Q' : 'q';
        const pawnChar = color === 'w' ? 'P' : 'p';
        
        if (piece === queenChar) {
            board[rank][file] = pawnChar;
        }
        
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
        
        fenParts[0] = newRows.join("/");
        return fenParts.join(" ");
    }

    // Find if any piece of the given color can capture the opponent's king
    function findKingCapture(fen, attackerColor) {
        try {
            const testGame = new Chess(fen);
            const opponentColor = attackerColor === 'w' ? 'b' : 'w';
            
            // Get all pieces of the attacker's color
            const board = testGame.board();
            
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const square = String.fromCharCode(97 + file) + (8 - rank);
                    const piece = testGame.get(square);
                    
                    if (piece && piece.color === attackerColor) {
                        const moves = testGame.moves({ square, verbose: true });
                        
                        for (const move of moves) {
                            const targetPiece = testGame.get(move.to);
                            if (targetPiece && targetPiece.type === 'k' && targetPiece.color === opponentColor) {
                                return { from: square, to: move.to };
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error finding king capture:", error);
        }
        return null;
    }

    // Check if HQ can capture opponent king
    function canHQCaptureKing(fen, hqSquare, opponentColor) {
        if (!hqSquare || hqSquare === "z1") return null;
        
        try {
            const testGame = new Chess(fen);
            const moves = testGame.moves({ square: hqSquare, verbose: true });
            
            for (const move of moves) {
                const capturedPiece = testGame.get(move.to);
                if (capturedPiece && capturedPiece.type === 'k' && capturedPiece.color === opponentColor) {
                    return { from: hqSquare, to: move.to };
                }
            }
        } catch (error) {
            console.error("Error checking HQ king capture:", error);
        }
        return null;
    }

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
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });

            if (move === null) return false;

            // Capture logic
            if (playerRole === "w" && hqbstatus < 3 && targetSquare === hqbsquare) {
                socket.emit("captureHQ", { roomID, color: "b" });
            }
            if (playerRole === "b" && hqwstatus < 3 && targetSquare === hqwsquare) {
                socket.emit("captureHQ", { roomID, color: "w" });
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
            
            console.log("Human move:", move);
            
            if (move && (move.captured === "k" || move.captured === "K")) {
                handleKingCapture(move);
                return true;
            }

            const afterHumanFen = game.fen();
            setGame(new Chess(afterHumanFen));
            setBotLastMove(null);
            socket.emit("move", { move: afterHumanFen, roomID, from: sourceSquare, to: targetSquare });

            if (game.isCheckmate()) {
                socket.emit("checkmated", { roomID, winner: playerRole });
                return true;
            } else if (game.isDraw()) {
                socket.emit("drawGame", { roomID });
                return true;
            }

            // Bot reply logic
            if (isBotGame && new Chess(afterHumanFen).turn() === 'b') {
                try {
                    await delay(3000);
                    
                    // Check if bot's HQ can capture white king
                    const hqKingCapture = canHQCaptureKing(afterHumanFen, hqbsquare, 'w');
                    
                    if (hqKingCapture && hqbstatus < 3) {
                        // HQ captures king directly
                        console.log("Bot HQ capturing white king:", hqKingCapture);
                        const botGame = new Chess(afterHumanFen);
                        const reply = botGame.move({
                            from: hqKingCapture.from,
                            to: hqKingCapture.to,
                            promotion: 'q'
                        });
                        
                        if (reply) {
                            const prevFen = afterHumanFen;
                            const newFen = swapSquares(hqKingCapture.from, hqKingCapture.to, prevFen);
                            
                            setGame(new Chess(newFen));
                            setBotLastMove({ from: hqKingCapture.from, to: hqKingCapture.to });
                            
                            try { window.dispatchEvent(new CustomEvent('localBoardUpdate', { detail: { fen: newFen } })); } catch {}
                            
                            socket.emit("move", { move: newFen, roomID, from: hqKingCapture.from, to: hqKingCapture.to });
                            socket.emit("kingCaptured", { roomID, winner: 'b' });
                        }
                        return true;
                    }
                    
                    // Disguise white's HQ as pawn before sending to Stockfish
                    let fenForStockfish = afterHumanFen;
                    if (hqwstatus < 3 && hqwsquare && hqwsquare !== "z1") {
                        fenForStockfish = disguiseQueenAsPawn(afterHumanFen, hqwsquare, 'w');
                    }
                    
                    // Check if king can be captured (invalid position for standard chess)
                    const kingCaptureMove = findKingCapture(afterHumanFen, 'b');
                    
                    let reply = null;
                    let from, to, promo;
                    const botGame = new Chess(afterHumanFen);
                    
                    if (kingCaptureMove) {
                        // King is capturable - make that move explicitly
                        from = kingCaptureMove.from;
                        to = kingCaptureMove.to;
                        promo = 'q';
                        reply = botGame.move({ from, to, promotion: promo });
                        console.log("Bot capturing exposed king:", kingCaptureMove);
                    } else {
                        // Normal bot move via Stockfish
                        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/bot/move`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fen: fenForStockfish, difficulty: botDifficulty })
                        });
                        const data = await res.json();
                        
                        if (data && data.bestmove) {
                            const uci = data.bestmove;
                            from = uci.slice(0, 2);
                            to = uci.slice(2, 4);
                            promo = uci.length > 4 ? uci.slice(4, 5) : undefined;
                            reply = botGame.move({ from, to, promotion: promo || 'q' });
                        }
                    }
                    
                    if (reply) {
                        // Check if bot captured king
                        if (reply.captured === 'k' || reply.captured === 'K') {
                            const prevFen = afterHumanFen;
                            const newFen = swapSquares(from, to, prevFen);
                            
                            setGame(new Chess(newFen));
                            setBotLastMove({ from, to });
                            
                            try { window.dispatchEvent(new CustomEvent('localBoardUpdate', { detail: { fen: newFen } })); } catch {}
                            
                            socket.emit("move", { move: newFen, roomID, from, to });
                            socket.emit("kingCaptured", { roomID, winner: 'b' });
                            return true;
                        }
                        
                        let botFen = botGame.fen();
                        
                        // Check if bot moved its HQ
                        const botMovedHQ = from === hqbsquare && hqbstatus < 3;
                        
                        // Check if bot's move is a pawn-like move
                        const isBotPawnLikeMove = (move) => {
                            const fileDiff = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
                            const rankDiff = parseInt(to[1]) - parseInt(from[1]);
                            const isCapture = move.flags.includes("c");
                            
                            // For black pawns
                            // Non-capture: moving 1 or 2 squares down (rank decreases)
                            if (!isCapture && fileDiff === 0 && (rankDiff === -1 || (from[1] === "7" && rankDiff === -2))) {
                                return true;
                            }
                            // Diagonal capture: moving 1 square diagonally down
                            if (fileDiff === 1 && rankDiff === -1 && isCapture) {
                                return true;
                            }
                            return false;
                        };
                        
                        const botRevealedHQ = botMovedHQ && hqbstatus === 1 && !isBotPawnLikeMove(reply);
                        
                        // If bot moved HQ but didn't reveal, disguise as pawn
                        if (botMovedHQ && !botRevealedHQ) {
                            botFen = disguiseQueenAsPawn(botFen, to, 'b');
                        }
                        
                        setGame(new Chess(botFen));
                        setBotLastMove({ from, to });

                        try { window.dispatchEvent(new CustomEvent('localBoardUpdate', { detail: { fen: botFen } })); } catch {}

                        socket.emit("move", { move: botFen, roomID, from, to });

                        // Check for HQ capture by bot
                        if (to === hqwsquare && hqwstatus < 3) {
                            socket.emit("captureHQ", { roomID, color: "w" });
                        }
                        
                        // Emit HQ movement and reveal
                        if (botMovedHQ) {
                            socket.emit("changeHQSquare", {
                                roomID,
                                color: 'b',
                                newSquare: to
                            });
                            
                            if (botRevealedHQ) {
                                socket.emit("revealHQ", { roomID, color: 'b' });
                            }
                        }

                        if (botGame.isCheckmate()) {
                            socket.emit("checkmated", { roomID, winner: 'b' });
                        } else if (botGame.isDraw()) {
                            socket.emit("drawGame", { roomID });
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
    }, [game, gameEnded, isConnected, playerRole, socket, roomID, hqwstatus, hqbstatus, hqwsquare, hqbsquare, botDifficulty]);

    function onDrop(sourceSquare, targetSquare) {
        const success = makeMove(sourceSquare, targetSquare);
        if (success) {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
        return success;
    }

    const onSquareClick = useCallback(async (square) => {
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

        const success = await makeMove(selectedSquare, square);
        if (success) {
            setSelectedSquare(null);
            setPossibleMoves([]);
        } else {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    }, [game, gameEnded, isConnected, playerRole, selectedSquare, getPossibleMoves, makeMove]);

    function handleKingCapture(move) {
        const from = move.from;
        const to = move.to;
        const prevFen = move.before;

        const newFen = swapSquares(from, to, prevFen);

        socket.emit("move", { move: newFen, roomID, from, to });
        socket.emit("kingCaptured", { roomID, winner: playerRole });
    }

    function swapSquares(square1, square2, fen) {
        const fenParts = fen.split(" ");
        const boardPosition = fenParts[0];
        
        const files = "abcdefgh";
        const ranks = "87654321";
        
        const file1 = files.indexOf(square1[0].toLowerCase());
        const rank1 = ranks.indexOf(square1[1]);
        const file2 = files.indexOf(square2[0].toLowerCase());
        const rank2 = ranks.indexOf(square2[1]);
        
        if (file1 === -1 || rank1 === -1 || file2 === -1 || rank2 === -1) {
            throw new Error("Invalid square notation. Must be in format like 'e4'");
        }
        
        const board = [];
        const rows = boardPosition.split("/");
        
        for (const row of rows) {
            const boardRow = [];
            for (const char of row) {
                if (isNaN(char)) {
                    boardRow.push(char);
                } else {
                    const emptyCount = parseInt(char);
                    for (let i = 0; i < emptyCount; i++) {
                        boardRow.push("");
                    }
                }
            }
            board.push(boardRow);
        }
        
        const temp = board[rank1][file1];
        board[rank1][file1] = board[rank2][file2];
        board[rank2][file2] = temp;
        
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
        
        fenParts[0] = newRows.join("/");
        
        return fenParts.join(" ");
    }

    const pieces = customPieces(playerRole, hqwstatus, hqwsquare, hqbstatus, hqbsquare, socket, pieceTheme);

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
                    areArrowsAllowed={true}
                    boardOrientation={(playerRole === "b" || boardOrientation === "black-below") ? "black" : "white"}
                    customPieces={pieces}
                    customSquareStyles={getCustomSquareStyles()}
                />
            </div>
        </div>
    );
}

export default HQChessBoardWithValidation;