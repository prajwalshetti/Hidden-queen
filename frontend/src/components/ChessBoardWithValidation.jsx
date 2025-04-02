import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";

function ChessBoardWithValidation({ socket, roomID, playerRole, boardState }) {
    const [game, setGame] = useState(new Chess());

    useEffect(() => {
        game.load(boardState);
        setGame(new Chess(game.fen()));
    }, [boardState]);

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

            setGame(new Chess(game.fen()));
            socket.emit("move", { move: game.fen(), roomID });
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
                    boardWidth={400}
                    areArrowsAllowed={true}
                    animationDuration={200}
                />
            </div>
        </div>
    );
}

export default ChessBoardWithValidation;
