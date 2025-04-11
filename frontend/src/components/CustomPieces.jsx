//@pranav create a new file customPieces.jsx 
export const customPieces = (playerRole, hqwstatus, hqwsquare, hqbstatus, hqbsquare) => ({
    // WHITE PIECES
    wQ: ({ squareWidth, isDragging, square }) => {
        if (hqwstatus === 1 && square === hqwsquare) {
            if (playerRole === 'w') {
                // Show hidden queen to white
                return (
                    <img
                        src="/normal/white/hqw.png"
                        style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                        alt="hidden white queen"
                    />
                );
            } else {
                // Show pawn to black
                return (
                    <img
                        src="/normal/white/pawn.png"
                        style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                        alt="disguised white queen as pawn"
                    />
                );
            }
        }

        if (hqwstatus === 2 && square === hqwsquare) {
            return (
                <img
                    src="/normal/white/queen.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                    alt="revealed white queen"
                />
            );
        }

        return (
            <img
                src="/normal/white/queen.png"
                style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                alt="white queen"
            />
        );
    },

    wP: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/white/pawn.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="white pawn"
        />
    ),
    wK: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/white/king.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="white king"
        />
    ),
    wR: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/white/rook.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="white rook"
        />
    ),
    wB: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/white/bishop.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="white bishop"
        />
    ),
    wN: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/white/knight.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="white knight"
        />
    ),

    // BLACK PIECES
    bQ: ({ squareWidth, isDragging, square }) => {
        if (hqbstatus === 1 && square === hqbsquare) {
            if (playerRole === 'b') {
                // Show hidden queen to black
                return (
                    <img
                        src="/normal/black/hqb.png"
                        style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                        alt="hidden black queen"
                    />
                );
            } else {
                // Show pawn to white
                return (
                    <img
                        src="/normal/black/pawn.png"
                        style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                        alt="disguised black queen as pawn"
                    />
                );
            }
        }

        if (hqbstatus === 2 && square === hqbsquare) {
            return (
                <img
                    src="/normal/black/queen.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                    alt="revealed black queen"
                />
            );
        }

        return (
            <img
                src="/normal/black/queen.png"
                style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
                alt="black queen"
            />
        );
    },

    bP: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/black/pawn.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="black pawn"
        />
    ),
    bK: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/black/king.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="black king"
        />
    ),
    bR: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/black/rook.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="black rook"
        />
    ),
    bB: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/black/bishop.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="black bishop"
        />
    ),
    bN: ({ squareWidth, isDragging }) => (
        <img
            src="/normal/black/knight.png"
            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? 0.5 : 1 }}
            alt="black knight"
        />
    ),
});
