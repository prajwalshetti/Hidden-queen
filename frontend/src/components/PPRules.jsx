import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Target, Shield, Brain } from 'lucide-react';

const PoisonedPawnRules = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-500 bg-opacity-20 p-2 rounded-lg">
            <span className="text-purple-400 text-xl font-bold">♟</span>
          </div>
          <h2 className="text-2xl font-bold text-purple-400">Poisoned Pawn Chess</h2>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-6 text-gray-300">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-500 bg-opacity-10 p-2 rounded-lg mt-1">
            <AlertTriangle className="text-purple-300 w-5 h-5" />
          </div>
          <p className="text-lg font-medium text-purple-300 leading-relaxed">
            Poisoned Pawn Chess adds a thrilling twist to traditional chess with one special rule that changes everything.
          </p>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Core Rules</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">1</div>
              <p>Each player <span className="text-white font-medium">secretly designates</span> one of their pawns as the <span className="text-red-400 font-bold">"poisoned pawn"</span> before the game begins.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">2</div>
              <p>The game follows all <span className="text-white font-medium">standard chess rules</span> for movement and capture.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">3</div>
              <p>If a player <span className="text-white font-medium">captures their opponent's poisoned pawn</span>, they <span className="text-red-500 font-bold">immediately lose</span> the game.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">4</div>
              <p>The poisoned pawn can be <span className="text-white font-medium">moved and used like any other pawn</span> throughout the game.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">5</div>
              <p>Standard win conditions like <span className="text-white font-medium">checkmate, resignation, or timeout</span> still apply.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl overflow-hidden">
          <div className="bg-purple-500 bg-opacity-10 px-6 py-3 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Brain className="text-purple-300 w-5 h-5" />
              <h3 className="text-lg font-semibold text-purple-300">Strategic Insights</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <Target className="text-purple-300 w-4 h-4" />
              </div>
              <p><span className="text-white font-medium">Choose wisely</span> – Center pawns create powerful tension but are risky, while edge pawns might be too predictable.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <Shield className="text-purple-300 w-4 h-4" />
              </div>
              <p><span className="text-white font-medium">Set subtle traps</span> – Make your opponent tempted to capture pawns and observe which they consistently avoid.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <AlertTriangle className="text-purple-300 w-4 h-4" />
              </div>
              <p><span className="text-white font-medium">Exercise caution</span> – Be extremely wary when capturing pawns, especially those that seem suspiciously vulnerable.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <span className="text-purple-300 text-lg">♟</span>
              </div>
              <p><span className="text-white font-medium">Tactical flexibility</span> – Use your poisoned pawn as a deliberate tool to control key squares or create psychological pressure.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 flex items-center space-x-3">
          <div className="bg-red-500 bg-opacity-20 p-2 rounded-full">
            <AlertTriangle className="text-red-400 w-5 h-5" />
          </div>
          <p className="text-red-300 font-medium">
            Once chosen, the poisoned pawn <span className="text-white">cannot be changed</span> during the game.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PoisonedPawnRules;