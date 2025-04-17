import React from 'react';
import { motion } from 'framer-motion';

const PoisonedPawnRules = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-4 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-400">☠️ Poisoned Pawn Chess Rules</h2>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="space-y-4 text-gray-300">
        <p className="text-lg font-semibold text-purple-300">🧪 Poisoned Pawn Chess is a variation of traditional chess with one special rule:</p>
        
        <ol className="list-decimal pl-6 space-y-2">
          <li>🔒 Each player <strong>secretly designates</strong> one of their pawns as the <span className="text-red-400 font-bold">"poisoned pawn"</span> at the beginning of the game.</li>
          <li>♟ The game follows all <strong>standard chess rules</strong>.</li>
          <li>💀 If a player <strong>captures their opponent's poisoned pawn</strong>, they <span className="text-red-500 font-bold">immediately lose</span> the game.</li>
          <li>🧍‍♂️ The poisoned pawn can be <strong>moved and used like any other pawn</strong>.</li>
          <li>🏁 Standard win conditions like <strong>checkmate, resignation, or timeout</strong> still apply.</li>
        </ol>
        
        <div className="bg-gray-700 p-4 rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">💡 Strategy Tips</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>🎯 Choose your poisoned pawn wisely – <strong>center pawns are tempting</strong> but risky, while edge pawns might be too obvious.</li>
            <li>👁 Try to set traps – make your opponent <strong>tempted to capture a pawn</strong> and see which ones they avoid.</li>
            <li>⚠️ Be extremely cautious when capturing – especially if a pawn looks <strong>suspiciously vulnerable</strong>.</li>
            <li>🧠 Use the poisoned pawn as a <strong>tactical tool</strong> to control key squares or make it look like a decoy.</li>
          </ul>
        </div>
        
        <p className="italic text-gray-400">📌 <strong>Note:</strong> Once chosen, the poisoned pawn <strong>cannot be changed</strong> during the game.</p>
      </div>
    </motion.div>
  );
};

export default PoisonedPawnRules;
