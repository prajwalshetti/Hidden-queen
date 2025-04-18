//07-04-24
//ChessBoardWithValidation.jsx
// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";

function FBChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded,boardOrientation }) {
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


            console.log(playerRole,targetSquare)
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

            return true;
        } catch (error) {
            return false;
        }
    }
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

    return (
        <div className="flex justify-center items-center">
            <div style={{ width: "400px", height: "400px" }}>
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    boardWidth={400}
                    areArrowsAllowed={true}
                    animationDuration={200}
                    customSquareStyles={customSquareStyles}
                    boardOrientation={(playerRole==="b" || boardOrientation === "black-below") ? "black" : "white"}
                />
            </div>
        </div>
    );
}

export default FBChessBoardWithValidation;
