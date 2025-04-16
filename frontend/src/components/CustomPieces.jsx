import React, { useState, useEffect, useRef } from 'react';
export const customPieces = (playerRole, hqwstatus, hqwsquare, hqbstatus, hqbsquare,socket) => {

    const [isWhiteKingNull, setIsWhiteKingNull] = useState(false);
const [isBlackKingNull, setIsBlackKingNull] = useState(false);

// Socket event listener setup for kingNull event - place this in your useEffect or component setup
useEffect(() => {
  // Assuming socket is already initialized elsewhere in your code
  socket.on("kingNull", (color) => {
    console.log(`King null event received for ${color === "w" ? "white" : "black"}`);
    
    if (color === "w") {
      setIsWhiteKingNull(true);
    } else {
      setIsBlackKingNull(true);
    }
  });
  
  // Clean up listener on component unmount
  return () => {
    socket.off("kingNull");
  };
}, []);

    // Utility function to determine drag opacity
    const getDragOpacity = (pieceColor, isDragging) => {
        if (!isDragging) return 1; // Not being dragged, fully visible
        
        // Check if the player's role matches the piece color they're dragging
        const isPlayerPiece = (pieceColor === 'w' && playerRole === 'w') || 
                             (pieceColor === 'b' && playerRole === 'b');
        
        return isPlayerPiece ? 0.5 : 0; // 0.5 opacity for own pieces, 0 for opponent's
    };

    const [backupHqwsquare, setBackupHqwsquare] = useState(hqwsquare);
    useEffect(() => {
    const timeoutId = setTimeout(() => {setBackupHqwsquare(hqwsquare);}, 500);
        return () => clearTimeout(timeoutId);
    }, [hqwsquare]);

    const [backupHqbsquare, setBackupHqbsquare] = useState(hqbsquare);
    useEffect(() => {
    const timeoutId = setTimeout(() => {setBackupHqbsquare(hqbsquare);}, 500);
        return () => clearTimeout(timeoutId);
    }, [hqbsquare]);

    return {
        // WHITE PIECES
        wQ: ({ squareWidth, isDragging, square }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            
            if (hqwstatus === 1 && (square === hqwsquare||square===backupHqwsquare)) {
                if (playerRole === 'w') {
                    // Show hidden queen to white
                    return (
                        <img
                            src="/normal/white/hqw.png"
                            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                            alt="hidden white queen"
                        />
                    );
                } else {
                    // Show pawn to black
                    return (
                        <img
                            src="/normal/white/pawn.png"
                            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                            alt="disguised white queen as pawn"
                        />
                    );
                }
            }

            if (hqwstatus === 2 && square === hqwsquare) {
                return (
                    <img
                        src="/normal/white/queen.png"
                        style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                        alt="revealed white queen"
                    />
                );
            }

            return (
                <img
                    src="/normal/white/queen.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="white queen"
                />
            );
        },

        wP: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            
            return (
                <img
                    src="/normal/white/pawn.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="white pawn"
                />
            );
        },
        
        wK: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);

            if(isWhiteKingNull)return null;
            
            return (
                <img
                    src="/normal/white/king.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="white king"
                />
            );
        },
        
        wR: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            
            return (
                <img
                    src="/normal/white/rook.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="white rook"
                />
            );
        },
        
        wB: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            
            return (
                <img
                    src="/normal/white/bishop.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="white bishop"
                />
            );
        },
        
        wN: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('w', isDragging);
            
            return (
                <img
                    src="/normal/white/knight.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="white knight"
                />
            );
        },

        // BLACK PIECES
        bQ: ({ squareWidth, isDragging, square }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            
            if (hqbstatus === 1 && (square === hqbsquare||square===backupHqbsquare)) {
                if (playerRole === 'b') {
                    // Show hidden queen to black
                    return (
                        <img
                            src="/normal/black/hqb.png"
                            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                            alt="hidden black queen"
                        />
                    );
                } else {
                    // Show pawn to white
                    return (
                        <img
                            src="/normal/black/pawn.png"
                            style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                            alt="disguised black queen as pawn"
                        />
                    );
                }
            }

            if (hqbstatus === 2 && square === hqbsquare) {
                return (
                    <img
                        src="/normal/black/queen.png"
                        style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                        alt="revealed black queen"
                    />
                );
            }

            return (
                <img
                    src="/normal/black/queen.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="black queen"
                />
            );
        },

        bP: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            
            return (
                <img
                    src="/normal/black/pawn.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="black pawn"
                />
            );
        },
        
        bK: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);

            if(isBlackKingNull)return null;
            
            return (
                <img
                    src="/normal/black/king.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="black king"
                />
            );
        },
        
        bR: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            
            return (
                <img
                    src="/normal/black/rook.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="black rook"
                />
            );
        },
        
        bB: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            
            return (
                <img
                    src="/normal/black/bishop.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="black bishop"
                />
            );
        },
        
        bN: ({ squareWidth, isDragging }) => {
            const dragOpacity = getDragOpacity('b', isDragging);
            
            return (
                <img
                    src="/normal/black/knight.png"
                    style={{ width: squareWidth, height: squareWidth, opacity: isDragging ? dragOpacity : 1 }}
                    alt="black knight"
                />
            );
        }
    };
};