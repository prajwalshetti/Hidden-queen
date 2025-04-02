import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChessClock = ({ isActive, startTime, onTimeUp, playerColor }) => {
  const [timeRemaining, setTimeRemaining] = useState(startTime);
  
  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            onTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getBackgroundColor = () => {
    if (!isActive) return "bg-gray-800";
    if (timeRemaining < 30) return "bg-red-900";
    if (timeRemaining < 60) return "bg-amber-900";
    return playerColor === "white" ? "bg-gray-700" : "bg-gray-900";
  };

  return (
    <motion.div
      className={`${getBackgroundColor()} rounded-lg px-4 py-2 border ${isActive ? 'border-purple-500' : 'border-gray-600'} shadow-lg transition-colors duration-300`}
      animate={{ scale: isActive ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="text-center text-2xl font-bold font-mono text-gray-100">
        {formatTime(timeRemaining)}
      </div>
    </motion.div>
  );
};

export default ChessClock;