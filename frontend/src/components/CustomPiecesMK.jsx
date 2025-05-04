import React, { useState, useEffect } from 'react';

export const customPieces = (playerRole, socket, pieceTheme) => {
    const variant = pieceTheme;
    
    const [isWhiteKingNull, setIsWhiteKingNull] = useState(false);
    const [isBlackKingNull, setIsBlackKingNull] = useState(false);

     useEffect(() => {
            socket.on("kingNull", (color) => {
                console.log(`King null event received for ${color === "w" ? "white" : "black"}`);
                if (color === "w") {
                    setIsWhiteKingNull(true);
                } else {
                    setIsBlackKingNull(true);
                }
            });
    
            return () => {
                socket.off("kingNull");
            };
        }, []);
    
    

    // Helper function to determine drag opacity
    const getDragOpacity = (pieceColor, isDragging) => {
        if (!isDragging) return 1;
        const isPlayerPiece = (pieceColor === 'w' && playerRole === 'w') || (pieceColor === 'b' && playerRole === 'b');
        return isPlayerPiece ? 0.5 : 0;
    };

    // Helper function to handle king/rook click during selection phase
    const handlePieceSelection = (color, square) => {
        if ((color === 'w' && playerRole === 'w') || (color === 'b' && playerRole === 'b')) {
            console.log(`Selected ${color} king at ${square}`);
            socket.emit("selectKing", { color, square });
            
            if (color === 'w') {
                setWhiteKingSelected(true);
                setWhiteRealKingSquare(square);
            } else {
                setBlackKingSelected(true);
                setBlackRealKingSquare(square);
            }
        }
    };

    return {
        // WHITE PIECES
        wK: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            if (isWhiteKingNull) return null;
            return (
                <img
                    src={`/${variant}/wK.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="white king"
                />
            );
        },

        wR: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            const imageSrc = playerRole === 'b' ? `/${variant}/wK.svg` : `/${variant}/wR.svg`;
            return (
                <img
                    src={imageSrc}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt={playerRole === 'b' ? 'disguised white king' : 'white rook'}
                />
            );
        },
        

        // BLACK PIECES
        bK: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            if (isBlackKingNull) return null;
            return (
                <img
                    src={`/${variant}/bK.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="black king"
                />
            );
        },

        bR: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            const imageSrc = playerRole === 'b' ? `/${variant}/bR.svg` : `/${variant}/bK.svg`;
            return (
                <img
                    src={imageSrc}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt={playerRole === 'b' ? 'black rook' : 'disguised black king'}
                />
            );
        },
        

        // OTHER WHITE PIECES
        wQ: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            return (
                <img
                    src={`/${variant}/wQ.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="white queen"
                />
            );
        },

        wB: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            return (
                <img
                    src={`/${variant}/wB.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="white bishop"
                />
            );
        },

        wN: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            return (
                <img
                    src={`/${variant}/wN.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="white knight"
                />
            );
        },

        wP: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            return (
                <img
                    src={`/${variant}/wP.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="white pawn"
                />
            );
        },

        // OTHER BLACK PIECES
        bQ: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            return (
                <img
                    src={`/${variant}/bQ.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="black queen"
                />
            );
        },

        bB: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            return (
                <img
                    src={`/${variant}/bB.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="black bishop"
                />
            );
        },

        bN: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            return (
                <img
                    src={`/${variant}/bN.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="black knight"
                />
            );
        },

        bP: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            return (
                <img
                    src={`/${variant}/bP.svg`}
                    style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                    alt="black pawn"
                />
            );
        }
    };
};