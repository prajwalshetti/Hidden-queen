import React, { useState, useEffect, useRef } from 'react';

export const CustomPiecesPP = (playerRole, hqwsquare, hqbsquare, socket,pieceTheme) => {
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
    }, [socket]);

    const getDragOpacity = (pieceColor, isDragging) => {
        if (!isDragging) return 1;
        const isPlayerPiece = (pieceColor === 'w' && playerRole === 'w') || (pieceColor === 'b' && playerRole === 'b');
        return isPlayerPiece ? 0.5 : 0;
    };

    const [backupHqwsquare, setBackupHqwsquare] = useState(hqwsquare);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setBackupHqwsquare(hqwsquare);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [hqwsquare]);

    const [backupHqbsquare, setBackupHqbsquare] = useState(hqbsquare);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setBackupHqbsquare(hqbsquare);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [hqbsquare]);

    return {
        // WHITE PIECES
        wQ: ({ squareWidth, isDragging, square }) => {
          const dragOpacity = getDragOpacity('w', isDragging);
      
          return (
            <img
              src={`/${variant}/wQ.svg`}
              style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
              alt="white queen"
            />
          );
        },
      
        wP: ({ squareWidth, isDragging, square }) => {
          const dragOpacity = getDragOpacity('w', isDragging);
          const isPoisonSquare = square === hqwsquare || square === backupHqwsquare;
          const isCaptured = hqwsquare && !isPoisonSquare;
      
          if (isPoisonSquare) {
            if (playerRole === 'w') {
              return (
                <img
                  src={`/${variant}/wPP.svg`}
                  style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                  alt="poisoned white pawn"
                />
              );
            } else {
              return (
                <img
                  src={`/${variant}/wP.svg`}
                  style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                  alt="disguised white poisoned pawn"
                />
              );
            }
          }
      
          if (isCaptured && square === hqwsquare) {
            return (
              <img
                src={`/${variant}/wPP.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                alt="revealed white poisoned pawn"
              />
            );
          }
      
          return (
            <img
              src={`/${variant}/wP.svg`}
              style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
              alt="white pawn"
            />
          );
        },
      
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
          return (
            <img
              src={`/${variant}/wR.svg`}
              style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
              alt="white rook"
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
      
        // BLACK PIECES
        bQ: ({ squareWidth, isDragging, square }) => {
          const dragOpacity = getDragOpacity('b', isDragging);
            
          return (
            <img
              src={`/${variant}/bQ.svg`}
              style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
              alt="black queen"
            />
          );
        },
      
        bP: ({ squareWidth, isDragging, square }) => {
          const dragOpacity = getDragOpacity('b', isDragging);
          const isPoisonSquare = square === hqbsquare || square === backupHqbsquare;
          const isCaptured = hqbsquare && !isPoisonSquare;
      
          if (isPoisonSquare) {
            if (playerRole === 'b') {
              return (
                <img
                  src={`/${variant}/bPP.svg`}
                  style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                  alt="poisoned black pawn"
                />
              );
            } else {
              return (
                <img
                  src={`/${variant}/bP.svg`}
                  style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                  alt="disguised black poisoned pawn"
                />
              );
            }
          }
      
          if (isCaptured && square === hqbsquare) {
            return (
              <img
                src={`/${variant}/bPP.svg`}
                style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
                alt="revealed black poisoned pawn"
              />
            );
          }
      
          return (
            <img
              src={`/${variant}/bP.svg`}
              style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
              alt="black pawn"
            />
          );
        },
      
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
          return (
            <img
              src={`/${variant}/bR.svg`}
              style={{ width: squareWidth, height: squareWidth, opacity: dragOpacity }}
              alt="black rook"
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
        }
      };
}