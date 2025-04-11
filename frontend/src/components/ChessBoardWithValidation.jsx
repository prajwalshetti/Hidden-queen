//07-04-24
//ChessBoardWithValidation.jsx
// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";

function ChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded }) {
    const [game, setGame] = useState(new Chess());

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

    // Define custom piece rendering for queens.
    // const customPieces = {
    //     wQ: ({ squareWidth, isDragging, square }) => {
    //         if (hiddenQueenSquare === square) {
    //             return (
    //                 <img
    //                     src="https://via.placeholder.com/40?text=HQ" // Dummy image for hidden queen
    //                     style={{
    //                         width: squareWidth,
    //                         height: squareWidth,
    //                         opacity: isDragging ? 0.5 : 1,
    //                     }}
    //                     alt="hidden white queen"
    //                 />
    //             );
    //         }
    //         // Default white queen image
    //         return (
    //             <img
    //                 src="https://via.placeholder.com/40?text=WQ" // Dummy default queen image
    //                 style={{
    //                     width: squareWidth,
    //                     height: squareWidth,
    //                     opacity: isDragging ? 0.5 : 1,
    //                 }}
    //                 alt="white queen"
    //             />
    //         );
    //     },
    //     bQ: ({ squareWidth, isDragging, square }) => {
    //         if (hiddenQueenSquare === square) {
    //             return (
    //                 <img
    //                     src="https://via.placeholder.com/40?text=HQ" // Dummy image for hidden queen (for black)
    //                     style={{
    //                         width: squareWidth,
    //                         height: squareWidth,
    //                         opacity: isDragging ? 0.5 : 1,
    //                     }}
    //                     alt="hidden black queen"
    //                 />
    //             );
    //         }
    //         // Default black queen image
    //         return (
    //             <img
    //                 src="https://via.placeholder.com/40?text=BQ" // Dummy default queen image
    //                 style={{
    //                     width: squareWidth,
    //                     height: squareWidth,
    //                     opacity: isDragging ? 0.5 : 1,
    //                 }}
    //                 alt="black queen"
    //             />
    //         );
    //     },
    // };

    return (
        <div className="flex justify-center items-center">
            <div style={{ width: "400px", height: "400px" }}>
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    // customPieces={customPieces}
                    boardWidth={400}
                    areArrowsAllowed={true}
                    animationDuration={200}
                    boardOrientation={playerRole === "b" ? "black" : "white"}
                />
            </div>
        </div>
    );
}

export default ChessBoardWithValidation;
