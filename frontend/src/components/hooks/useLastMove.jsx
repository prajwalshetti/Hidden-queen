import { useState, useEffect } from "react";

export default function useLastMove(socket) {
  const [lastMove, setLastMove] = useState({ from: null, to: null });

  useEffect(() => {
    socket.on("lastMoveSquares", ({ from, to }) => {
      setLastMove({ from, to });
    });

    return () => {
      socket.off("lastMoveSquares");
    };
  }, [socket]);

  function getSquareStyles() { 
    const styles = {}; 
    if (lastMove.from) { 
      styles[lastMove.from] = { 
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.4), rgba(255, 255, 0, 0.2))',
        boxShadow: 'inset 0 0 5px rgba(218, 165, 32, 0.7)'
      }; 
    } 
    if (lastMove.to) { 
      styles[lastMove.to] = { 
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.4), rgba(255, 255, 0, 0.2))',
        boxShadow: 'inset 0 0 5px rgba(218, 165, 32, 0.7)'
      }; 
    } 
    return styles; 
  }

  return { lastMove, getSquareStyles };
}