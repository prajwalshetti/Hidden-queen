//07-04-24
//ChessBoardWithValidation.jsx
// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { CustomPiecesNF } from './CustomPiecesNF.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function ChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded,boardOrientation }) {
    const [game, setGame] = useState(new Chess());
    const { pieceTheme, setPieceTheme } = usePieceTheme();
    const { getSquareStyles } = useLastMove(socket);

    useEffect(() => {
        const newGame = new Chess();
        newGame.load(boardState);
        setGame(newGame);
    }, [boardState]);

    function onDrop(sourceSquare, targetSquare) {
        if(gameEnded)return;
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

    return (
        <div className="flex justify-center items-center">
            <div style={{ width: "400px", height: "400px" }}>
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    customPieces={CustomPiecesNF(playerRole, socket,pieceTheme)}
                    boardWidth={400}
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
