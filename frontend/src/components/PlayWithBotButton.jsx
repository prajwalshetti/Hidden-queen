import React, { useState } from 'react';
import { motion } from 'framer-motion';

function PlayWithBotButton({ handlePlayWithBot }) {
  const [isFocused, setIsFocused] = useState(false);

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
        ♟
      </motion.div>

      <motion.div className="relative z-10">
        <motion.h2 
          className="text-2xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Play With Bot
        </motion.h2>

        <div className="space-y-3">
          <motion.button 
            onClick={handlePlayWithBot} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg font-bold shadow-lg transition-all duration-300 text-sm"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)" 
            }}
            whileTap={{ scale: 0.98 }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <div className="flex items-center justify-center">
              <span className="mr-2">♟</span>
              <span>Play With Bot</span>
            </div>
          </motion.button>

          <motion.div 
            className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded mt-1"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: isFocused ? 1 : 0,
              opacity: isFocused ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PlayWithBotButton;
