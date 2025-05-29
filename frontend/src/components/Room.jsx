// Room.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

function RoomCard({ joinRoom, roomIDSuffix }) {
  const [roomID, setRoomID] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleJoin = () => {
    if (!roomID.trim()) {
      alert("Enter a valid room ID");
      return;
    }
    joinRoom(roomID + roomIDSuffix);
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl p-4 shadow-2xl border border-gray-700 relative overflow-hidden max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-50"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror"
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
      />

      {/* Chess piece decoration - smaller */}
      <motion.div 
        className="absolute -right-6 -top-6 text-purple-900/20 text-6xl font-chess pointer-events-none"
        initial={{ rotate: -15 }}
        animate={{ rotate: -5 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      >
        ♛
      </motion.div>

      <motion.div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <motion.h2 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Play with your friends
          </motion.h2>

          {/* Question mark with tooltip */}
          <div className="relative">
            <motion.button
              className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 text-sm"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ?
            </motion.button>

            {/* Tooltip */}
            <motion.div
              className="absolute right-0 top-8 bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 w-64 z-20"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ 
                opacity: showTooltip ? 1 : 0,
                y: showTooltip ? 0 : -10,
                scale: showTooltip ? 1 : 0.9
              }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: showTooltip ? 'auto' : 'none' }}
            >
              <div className="text-sm">
                <p className="text-purple-400 font-semibold mb-1">How Room ID works:</p>
                <p className="text-gray-300">
                  Room ID can be anything you want! Just make sure you and your friend enter the exact same Room ID.
                </p>
              </div>
              {/* Arrow pointing to the question mark */}
              <div className="absolute -top-2 right-3 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-900"></div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <motion.input
              type="text"
              placeholder="Enter the same room ID as your friend"
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: isFocused ? 1 : 0,
                opacity: isFocused ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <motion.button 
            onClick={handleJoin} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg font-bold shadow-lg transition-all duration-300 text-sm"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center">
              <span className="mr-2">♟</span>
              <span>Create / Join Game</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RoomCard;