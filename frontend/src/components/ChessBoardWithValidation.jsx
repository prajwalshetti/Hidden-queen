//07-04-24
//ChessBoardWithValidation.jsx
// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef } from "react";// In a backend script, for instance backend/index.mjs:
import { Chess } from "chess.js";
import { CustomPiecesNF } from './CustomPiecesNF.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function ChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded,boardOrientation,isConnected }) {
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);

    useEffect(() => {
        const newGame = new Chess();
        newGame.load(boardState);
        setGame(newGame);
    }, [boardState]);

    function onDrop(sourceSquare, targetSquare) {
        if(gameEnded||!isConnected)return;
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
    }


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
                    customPieces={CustomPiecesNF(playerRole, socket,pieceTheme)}
                    boardWidth={boardSize}
                    areArrowsAllowed={true}
                    animationDuration={200}
                    boardOrientation={(playerRole==="b" || boardOrientation === "black-below") ? "black" : "white"}
                    customSquareStyles={getSquareStyles()}
                />
            </div>
        </div>
    );
}

export default ChessBoardWithValidation;
