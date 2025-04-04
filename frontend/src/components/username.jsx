import React from 'react';
import { motion } from 'framer-motion';
import ChessClock from './clock';

const PlayerInfo = ({ username, rating, isActive, timeRemaining, onTimeUp, playerColor, isYou }) => {
  return (
    <motion.div
      className={`flex items-center justify-between p-3 rounded-lg border ${isActive ? 'border-purple-500 bg-gray-800/90' : 'border-gray-700 bg-gray-800'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-4 h-4 rounded-full ${playerColor === 'white' ? 'bg-gray-200' : 'bg-gray-900 border border-gray-700'}`}></div>
        <div>
          <div className="font-bold text-lg text-gray-100">
            {username || 'Anonymous'} 
            {isYou && <span className="text-sm text-purple-400 ml-2">(You)</span>}
          </div>
          {rating && <div className="text-sm text-gray-400">Rating: {rating}</div>}
        </div>
      </div>
      <ChessClock 
        isActive={isActive} 
        startTime={timeRemaining} 
        onTimeUp={onTimeUp} 
        playerColor={playerColor}
      />
    </motion.div>
  );
};

export default PlayerInfo;