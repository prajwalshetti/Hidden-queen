import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChessClock = ({ isActive, timeRemaining, onTimeUp, playerColor }) => {
  const [displayTime, setDisplayTime] = useState(Math.floor(timeRemaining));

  // Update display time when prop changes (floored)
  useEffect(() => {
    setDisplayTime(Math.floor(timeRemaining));
  }, [timeRemaining]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isActive && displayTime > 0) {
      interval = setInterval(() => {
        setDisplayTime(prevTime => {
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
  }, [isActive, displayTime, onTimeUp]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Dynamic background color based on state
  const getBackgroundColor = () => {
    if (!isActive) return "bg-gray-800";
    if (displayTime < 30) return "bg-red-900";
    if (displayTime < 60) return "bg-amber-900";
    return playerColor === "white" ? "bg-gray-700" : "bg-gray-900";
  };

  return (
    <motion.div
      className={`${getBackgroundColor()} rounded-lg px-4 py-2 border ${isActive ? 'border-purple-500' : 'border-gray-600'} shadow-lg transition-colors duration-300`}
      animate={{ scale: isActive ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="text-center text-2xl font-bold font-mono text-gray-100">
        {formatTime(displayTime)}
      </div>
    </motion.div>
  );
};

export default ChessClock;
