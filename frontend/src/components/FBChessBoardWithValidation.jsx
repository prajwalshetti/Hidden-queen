//07-04-24
//ChessBoardWithValidation.jsx
// ChessBoardWithValidation.jsx
import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef } from "react";// In a backend script, for instance backend/index.mjs:
import { Chess } from "chess.js";
import { CustomPiecesNF } from './CustomPiecesNF.jsx';
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
import useLastMove from './hooks/useLastMove.jsx'; // adjust path if needed

function FBChessBoardWithValidation({ socket, roomID, playerRole, boardState, gameEnded,boardOrientation }) {
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

    const mergedSquareStyles = (() => {
        const goalStyles = customSquareStyles;
        const lastMoveStyles = getSquareStyles();
        const merged = { ...goalStyles };
    
        for (const square in lastMoveStyles) {
            if (goalStyles[square]) {
                // Combine both styles: goal pattern + yellow border
                merged[square] = {
                    ...goalStyles[square],
                    boxShadow: 'inset 0 0 0 3px yellow', // Add a highlight without losing pattern
                };
            } else {
                merged[square] = lastMoveStyles[square];
            }
        }
    
        return merged;
    })();

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
                    customSquareStyles={mergedSquareStyles}
                    boardOrientation={(playerRole==="b" || boardOrientation === "black-below") ? "black" : "white"}
                />
            </div>
        </div>
    );
}

export default FBChessBoardWithValidation;
