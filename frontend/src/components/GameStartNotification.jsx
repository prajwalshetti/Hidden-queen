import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GameStartNotification = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent overlay */}
          <div className="absolute" onClick={onClose} />
          
          {/* Notification box */}
          <motion.div 
            className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 rounded-lg shadow-lg border border-purple-400 w-4/5 max-w-xs text-center z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <h2 className="text-xl font-bold text-white mb-1">Game Started!</h2>
            <p className="text-sm text-purple-100">Both players have joined. Good luck!</p>
            <div className="mt-2 text-white text-3xl animate-pulse">⚽</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GameStartNotification;