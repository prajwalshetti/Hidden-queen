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
        boxShadow: 'inset 0 0 10px 3px rgba(255, 255, 0, 0.9)' // yellow highlight
      };
    }
    if (lastMove.to) {
      styles[lastMove.to] = {
        boxShadow: 'inset 0 0 10px 3px rgba(255, 255, 0, 0.9)'
      };
    }
    return styles;
  }

  return { lastMove, getSquareStyles };
}
