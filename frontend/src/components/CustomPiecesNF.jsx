import React from 'react';

export const CustomPiecesNF = (playerRole, socket,pieceTheme) => {
    const variant = pieceTheme;
    const getDragOpacity = (pieceColor, isDragging) => {
        if (!isDragging) return 1;
        const isPlayerPiece = (pieceColor === 'w' && playerRole === 'w') || (pieceColor === 'b' && playerRole === 'b');
        return isPlayerPiece ? 0.5 : 0;
    };

    return {
        // WHITE PIECES
        wK: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/wK.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('w', isDragging) }}
                alt="white king"
            />
        ),
        wQ: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/wQ.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('w', isDragging) }}
                alt="white queen"
            />
        ),
        wR: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/wR.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('w', isDragging) }}
                alt="white rook"
            />
        ),
        wB: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/wB.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('w', isDragging) }}
                alt="white bishop"
            />
        ),
        wN: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/wN.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('w', isDragging) }}
                alt="white knight"
            />
        ),
        wP: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/wP.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('w', isDragging) }}
                alt="white pawn"
            />
        ),

        // BLACK PIECES
        bK: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/bK.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('b', isDragging) }}
                alt="black king"
            />
        ),
        bQ: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/bQ.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('b', isDragging) }}
                alt="black queen"
            />
        ),
        bR: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/bR.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('b', isDragging) }}
                alt="black rook"
            />
        ),
        bB: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/bB.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('b', isDragging) }}
                alt="black bishop"
            />
        ),
        bN: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/bN.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('b', isDragging) }}
                alt="black knight"
            />
        ),
        bP: ({ squareWidth, isDragging }) => (
            <img
                src={`/${variant}/bP.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: getDragOpacity('b', isDragging) }}
                alt="black pawn"
            />
        )
    };
};
