// BoardSwitch.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';

function BoardSwitch({ flipped, onFlip }) {
  return (
    <motion.button
      onClick={onFlip}
      className="bg-yellow-600 text-white p-2 rounded-lg font-bold flex items-center justify-center border-2 border-yellow-500 hover:bg-yellow-700 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ArrowUpDown size={16} className="mr-1" />
      <span>Switch<br />board</span>
    </motion.button>
  );
}

export default BoardSwitch;