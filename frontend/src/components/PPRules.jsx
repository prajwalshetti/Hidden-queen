import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Target, Shield, Brain } from 'lucide-react';

const PoisonedPawnRules = ({ onClose }) => {
  // State to control the pulsing animation
  const [isPulsing, setIsPulsing] = useState(true);
  
  useEffect(() => {
    // Toggle the pulsing state every 3 seconds
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants for the poisonous effect
  const pulseVariants = {
    dark: { 
      backgroundColor: "rgba(6, 78, 59, 0.2)",
      transition: { duration: 3, ease: "easeInOut" }
    },
    light: { 
      backgroundColor: "rgba(16, 185, 129, 0.35)", 
      transition: { duration: 3, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl mx-auto relative overflow-hidden"
    >
      {/* Background poisonous effect layer */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={isPulsing ? "light" : "dark"}
        variants={pulseVariants}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="bg-green-500 bg-opacity-20 p-2 rounded-lg"
              animate={{ 
                boxShadow: isPulsing 
                  ? "0 0 15px 5px rgba(16, 185, 129, 0.5)" 
                  : "0 0 5px 2px rgba(16, 185, 129, 0.2)"
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <span className="text-green-400 text-xl font-bold">♟</span>
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold"
              animate={{ 
                color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              Poisoned Pawn Chess
            </motion.h2>
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
            <motion.div 
              className="bg-green-500 bg-opacity-10 p-2 rounded-lg mt-1"
              animate={{ 
                backgroundColor: isPulsing 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : "rgba(6, 78, 59, 0.2)" 
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ 
                  color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <AlertTriangle className="w-5 h-5" />
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-lg font-medium leading-relaxed"
              animate={{ 
                color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              Poisoned Pawn Chess adds a thrilling twist to traditional chess with one special rule that changes everything.
            </motion.p>
          </div>
          
          <motion.div 
            className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700"
            animate={{ 
              borderColor: isPulsing 
                ? "rgba(16, 185, 129, 0.6)" 
                : "rgba(6, 78, 59, 0.6)" 
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <motion.h3 
              className="text-lg font-semibold mb-4"
              animate={{ 
                color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              Core Rules
            </motion.h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  animate={{ 
                    backgroundColor: isPulsing 
                      ? "rgba(16, 185, 129, 0.2)" 
                      : "rgba(6, 78, 59, 0.2)",
                    color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  1
                </motion.div>
                <p>Each player <span className="text-white font-medium">secretly designates</span> one of their pawns as the 
                  <motion.span 
                    className="font-bold ml-1 mr-1"
                    animate={{ 
                      color: isPulsing ? "rgb(163, 230, 53)" : "rgb(101, 163, 13)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    "poisoned pawn"
                  </motion.span> 
                  before the game begins.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  animate={{ 
                    backgroundColor: isPulsing 
                      ? "rgba(16, 185, 129, 0.2)" 
                      : "rgba(6, 78, 59, 0.2)",
                    color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  2
                </motion.div>
                <p>The game follows all <span className="text-white font-medium">standard chess rules</span> for movement and capture.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  animate={{ 
                    backgroundColor: isPulsing 
                      ? "rgba(16, 185, 129, 0.2)" 
                      : "rgba(6, 78, 59, 0.2)",
                    color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  3
                </motion.div>
                <p>If a player <span className="text-white font-medium">captures their opponent's poisoned pawn</span>, they 
                  <motion.span 
                    className="font-bold ml-1"
                    animate={{ 
                      color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)",
                      textShadow: isPulsing ? "0 0 8px rgba(16, 185, 129, 0.7)" : "none"
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    immediately lose
                  </motion.span> 
                  the game.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  animate={{ 
                    backgroundColor: isPulsing 
                      ? "rgba(16, 185, 129, 0.2)" 
                      : "rgba(6, 78, 59, 0.2)",
                    color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  4
                </motion.div>
                <p>The poisoned pawn can be <span className="text-white font-medium">moved and used like any other pawn</span> throughout the game.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  animate={{ 
                    backgroundColor: isPulsing 
                      ? "rgba(16, 185, 129, 0.2)" 
                      : "rgba(6, 78, 59, 0.2)",
                    color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  5
                </motion.div>
                <p>Standard win conditions like <span className="text-white font-medium">checkmate, resignation, or timeout</span> still apply.</p>
              </div>
            </div>
          </motion.div>
          
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl overflow-hidden">
            <motion.div 
              className="px-6 py-3 border-b border-gray-700"
              animate={{ 
                backgroundColor: isPulsing 
                  ? "rgba(16, 185, 129, 0.1)" 
                  : "rgba(6, 78, 59, 0.1)" 
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ 
                    color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
                <motion.h3 
                  className="text-lg font-semibold"
                  animate={{ 
                    color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  Strategic Insights
                </motion.h3>
              </div>
            </motion.div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <motion.div
                    animate={{ 
                      color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    <Target className="w-4 h-4" />
                  </motion.div>
                </div>
                <p><span className="text-white font-medium">Choose wisely</span> – Center pawns create powerful tension but are risky, while edge pawns might be too predictable.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <motion.div
                    animate={{ 
                      color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    <Shield className="w-4 h-4" />
                  </motion.div>
                </div>
                <p><span className="text-white font-medium">Set subtle traps</span> – Make your opponent tempted to capture pawns and observe which they consistently avoid.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <motion.div
                    animate={{ 
                      color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </motion.div>
                </div>
                <p><span className="text-white font-medium">Exercise caution</span> – Be extremely wary when capturing pawns, especially those that seem suspiciously vulnerable.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <motion.span
                    className="text-lg"
                    animate={{ 
                      color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    ♟
                  </motion.span>
                </div>
                <p><span className="text-white font-medium">Tactical flexibility</span> – Use your poisoned pawn as a deliberate tool to control key squares or create psychological pressure.</p>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="rounded-lg p-4 flex items-center space-x-3 border"
            animate={{ 
              backgroundColor: isPulsing 
                ? "rgba(16, 185, 129, 0.15)" 
                : "rgba(6, 78, 59, 0.15)",
              borderColor: isPulsing 
                ? "rgba(16, 185, 129, 0.6)" 
                : "rgba(6, 78, 59, 0.6)"
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <motion.div 
              className="p-2 rounded-full"
              animate={{ 
                backgroundColor: isPulsing 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : "rgba(6, 78, 59, 0.2)" 
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ 
                  color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <AlertTriangle className="w-5 h-5" />
              </motion.div>
            </motion.div>
            <motion.p
              className="font-medium"
              animate={{ 
                color: isPulsing ? "rgb(16, 185, 129)" : "rgb(6, 95, 70)" 
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              Once chosen, the poisoned pawn <span className="text-white">cannot be changed</span> during the game.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PoisonedPawnRules;