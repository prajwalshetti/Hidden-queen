import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Target, Shield, Brain } from 'lucide-react';
import { Card, CardContent } from "./ui/card";

function HiddenQueenRules({ onClose }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl mx-auto text-gray-100">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500 bg-opacity-20 p-2 rounded-lg">
              <span className="text-purple-400 text-xl font-bold">♛</span>
            </div>
            <h2 className="text-2xl font-bold text-purple-400">Hidden Queen Chess</h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors duration-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="space-y-6 text-gray-300">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-500 bg-opacity-10 p-2 rounded-lg mt-1">
              <AlertTriangle className="text-purple-300 w-5 h-5" />
            </div>
            <p className="text-lg font-medium text-purple-300 leading-relaxed">
              Hidden Queen Chess transforms standard chess with a single powerful secret: one of your pawns is actually a queen in disguise!
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Core Rules</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">1</div>
                <p><span className="text-white font-medium">Initial Selection:</span> Before the game begins, each player <span className="text-white font-medium">secretly designates one of their eight pawns</span> as their Hidden Queen.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">2</div>
                <p><span className="text-white font-medium">Appearance:</span> The Hidden Queen <span className="text-white font-medium">appears as a normal pawn to your opponent</span>, but you'll see it marked with a special indicator.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">3</div>
                <p><span className="text-white font-medium">Special Movement:</span> Your Hidden Queen can either <span className="text-white font-medium">move like a standard pawn OR make any queen move</span> during your turn.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">4</div>
                <p><span className="text-white font-medium">Revelation:</span> When your Hidden Queen makes any non-pawn move, it's immediately <span className="text-white font-medium">revealed as a queen</span> to both players and transforms permanently.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">5</div>
                <p><span className="text-white font-medium">Enpassant:</span> The <span className="text-white font-medium">Enpassant</span> pawn move is not allowed in Hidden Queen Chess.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-300 font-bold">6</div>
                <p><span className="text-white font-medium">Victory Condition:</span> The game is won by <span className="text-white font-medium">capturing the opponent's king</span> (not by checkmate), timeout or resignation by your opponent.</p>
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
                <p><span className="text-white font-medium">Positioning</span> – Edge pawns can surprise with unexpected lateral moves, while central pawns have greater mobility once revealed.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="text-purple-300 w-4 h-4" />
                </div>
                <p><span className="text-white font-medium">Deception</span> – Move several pawns similarly to conceal which one is your Hidden Queen, creating uncertainty for your opponent.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className="text-purple-300 w-4 h-4" />
                </div>
                <p><span className="text-white font-medium">Timing</span> – Revealing your Hidden Queen creates an immediate tactical advantage, but maintaining the secret can lead to a devastating surprise attack.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-purple-300 text-lg">♛</span>
                </div>
                <p><span className="text-white font-medium">King safety</span> – Since kings can be captured directly, maintain stronger defenses around your king than in standard chess.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-lg p-4 flex items-center space-x-3">
            <div className="bg-purple-500 bg-opacity-20 p-2 rounded-full">
              <span className="text-purple-400 text-xl">✨</span>
            </div>
            <p className="text-purple-300 font-medium">
              Important: Once your Hidden Queen is revealed, it <span className="text-white">cannot revert to appearing as a pawn</span>. Your opponent's king is always in danger - there's no stalemate in this variant!
            </p>
          </div>
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 flex items-center space-x-3">
                    <div className="bg-red-500 bg-opacity-20 p-2 rounded-full">
                      <AlertTriangle className="text-red-400 w-5 h-5" />
                    </div>
                    <p className="text-red-300 font-medium">
                      Once chosen, the  hidden queen <span className="text-white">cannot be changed</span> during the game.
                    </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default HiddenQueenRules;