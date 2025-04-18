import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Target, Shield, Brain } from 'lucide-react';
import { Card } from "./ui/card";

function HiddenQueenRules({ onClose }) {
  // State to control the pulsing animation
  const [isPulsing, setIsPulsing] = useState(true);
  
  useEffect(() => {
    // Toggle the pulsing state every 3 seconds
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
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
      <Card className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 max-w-md mx-auto text-gray-100 overflow-hidden">
        {/* Background shimmer effect */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ 
            background: isPulsing 
              ? "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(30, 64, 175, 0.1) 70%)" 
              : "radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.2) 70%)"
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Subtle sparkle effects */}
        <motion.div 
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ top: '20%', left: '30%' }}
          animate={{ 
            opacity: isPulsing ? [0, 1, 0] : [0, 0.7, 0],
            scale: isPulsing ? [0, 1.2, 0] : [0, 0.8, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.div 
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ top: '60%', left: '70%' }}
          animate={{ 
            opacity: isPulsing ? [0, 0.7, 0] : [0, 1, 0],
            scale: isPulsing ? [0, 0.8, 0] : [0, 1.2, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: 0.5 }}
        />
        <motion.div 
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ top: '40%', left: '85%' }}
          animate={{ 
            opacity: isPulsing ? [0, 0.5, 0] : [0, 0.9, 0],
            scale: isPulsing ? [0, 1, 0] : [0, 1.4, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop", delay: 1 }}
        />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-5 border-b border-gray-700 pb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 rounded-lg"
                animate={{ 
                  backgroundColor: isPulsing 
                    ? "rgba(124, 58, 237, 0.2)" 
                    : "rgba(30, 64, 175, 0.2)",
                  boxShadow: isPulsing 
                    ? "0 0 15px 5px rgba(124, 58, 237, 0.3)" 
                    : "0 0 10px 2px rgba(30, 64, 175, 0.3)"
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <motion.span 
                  className="text-xl font-bold"
                  animate={{ 
                    color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >♛</motion.span>
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold"
                animate={{ 
                  color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)",
                  textShadow: isPulsing 
                    ? "0 0 8px rgba(124, 58, 237, 0.5)" 
                    : "0 0 8px rgba(30, 64, 175, 0.5)"
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                Hidden Queen Chess
              </motion.h2>
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
          
          <div className="space-y-5 text-gray-300">
            <div className="flex items-start space-x-3">
              <motion.div 
                className="p-2 rounded-lg mt-1"
                animate={{ 
                  backgroundColor: isPulsing 
                    ? "rgba(124, 58, 237, 0.1)" 
                    : "rgba(30, 64, 175, 0.1)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ 
                    color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  <AlertTriangle className="w-5 h-5" />
                </motion.div>
              </motion.div>
              <motion.p 
                className="text-base font-medium leading-relaxed"
                animate={{ 
                  color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                Hidden Queen Chess transforms standard chess with a single powerful secret: one of your pawns is actually a queen in disguise!
              </motion.p>
            </div>
            
            <motion.div 
              className="bg-gray-800 bg-opacity-40 rounded-xl p-5 border"
              animate={{ 
                borderColor: isPulsing 
                  ? "rgba(124, 58, 237, 0.5)" 
                  : "rgba(30, 64, 175, 0.5)",
                boxShadow: isPulsing
                  ? "inset 0 0 20px rgba(124, 58, 237, 0.1)"
                  : "inset 0 0 20px rgba(30, 64, 175, 0.1)"
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-4"
                animate={{ 
                  color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                Core Rules
              </motion.h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    animate={{ 
                      backgroundColor: isPulsing 
                        ? "rgba(124, 58, 237, 0.2)" 
                        : "rgba(30, 64, 175, 0.2)",
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    1
                  </motion.div>
                  <p className="text-sm"><span className="text-white font-medium">Initial Selection:</span> Each player <span className="text-white font-medium">secretly designates one pawn</span> as their Hidden Queen.</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    animate={{ 
                      backgroundColor: isPulsing 
                        ? "rgba(124, 58, 237, 0.2)" 
                        : "rgba(30, 64, 175, 0.2)",
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    2
                  </motion.div>
                  <p className="text-sm"><span className="text-white font-medium">Appearance:</span> The Hidden Queen <span className="text-white font-medium">appears as a normal pawn</span> to your opponent.</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    animate={{ 
                      backgroundColor: isPulsing 
                        ? "rgba(124, 58, 237, 0.2)" 
                        : "rgba(30, 64, 175, 0.2)",
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    3
                  </motion.div>
                  <p className="text-sm"><span className="text-white font-medium">Special Movement:</span> Your Hidden Queen can <span className="text-white font-medium">move as a pawn OR queen</span>.</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    animate={{ 
                      backgroundColor: isPulsing 
                        ? "rgba(124, 58, 237, 0.2)" 
                        : "rgba(30, 64, 175, 0.2)",
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    4
                  </motion.div>
                  <p className="text-sm"><span className="text-white font-medium">Revelation:</span> Any non-pawn move <span className="text-white font-medium">permanently reveals</span> your Hidden Queen.</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    animate={{ 
                      backgroundColor: isPulsing 
                        ? "rgba(124, 58, 237, 0.2)" 
                        : "rgba(30, 64, 175, 0.2)",
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    5
                  </motion.div>
                  <p className="text-sm"><span className="text-white font-medium">Enpassant:</span> The <span className="text-white font-medium">Enpassant</span> pawn move is not allowed.</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    animate={{ 
                      backgroundColor: isPulsing 
                        ? "rgba(124, 58, 237, 0.2)" 
                        : "rgba(30, 64, 175, 0.2)",
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    6
                  </motion.div>
                  <p className="text-sm"><span className="text-white font-medium">Victory:</span> Win by <span className="text-white font-medium">capturing the opponent's king</span> (not checkmate).</p>
                </div>
              </div>
            </motion.div>
            
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl overflow-hidden">
              <motion.div 
                className="px-5 py-3 border-b border-gray-700"
                animate={{ 
                  backgroundColor: isPulsing 
                    ? "rgba(124, 58, 237, 0.1)" 
                    : "rgba(30, 64, 175, 0.1)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    <Brain className="w-5 h-5" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold"
                    animate={{ 
                      color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    Strategic Insights
                  </motion.h3>
                </div>
              </motion.div>
              
              <div className="p-5 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <motion.div
                      animate={{ 
                        color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                      }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    >
                      <Target className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <p className="text-sm"><span className="text-white font-medium">Positioning</span> – Edge pawns surprise with unexpected lateral moves.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <motion.div
                      animate={{ 
                        color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                      }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    >
                      <Shield className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <p className="text-sm"><span className="text-white font-medium">Deception</span> – Move several pawns similarly to conceal which is the queen.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <motion.div
                      animate={{ 
                        color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                      }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <p className="text-sm"><span className="text-white font-medium">Timing</span> – Keep your queen hidden for a devastating surprise attack.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <motion.span
                      className="text-lg"
                      animate={{ 
                        color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                      }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    >
                      ♛
                    </motion.span>
                  </div>
                  <p className="text-sm"><span className="text-white font-medium">King safety</span> – Maintain strong defenses as kings can be captured directly.</p>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="rounded-lg p-3 flex items-center space-x-3 border"
              animate={{ 
                backgroundColor: isPulsing 
                  ? "rgba(124, 58, 237, 0.15)" 
                  : "rgba(30, 64, 175, 0.15)",
                borderColor: isPulsing 
                  ? "rgba(167, 139, 250, 0.4)" 
                  : "rgba(96, 165, 250, 0.4)",
                boxShadow: isPulsing
                  ? "0 0 15px rgba(124, 58, 237, 0.2)"
                  : "0 0 15px rgba(30, 64, 175, 0.2)"
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div 
                className="p-2 rounded-full"
                animate={{ 
                  backgroundColor: isPulsing 
                    ? "rgba(124, 58, 237, 0.2)" 
                    : "rgba(30, 64, 175, 0.2)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <motion.span 
                  className="text-lg"
                  animate={{ 
                    color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
              </motion.div>
              <motion.p
                className="text-sm font-medium"
                animate={{ 
                  color: isPulsing ? "rgb(167, 139, 250)" : "rgb(96, 165, 250)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                Important: Once revealed, your Hidden Queen <span className="text-white">cannot revert</span> to appearing as a pawn.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="rounded-lg p-3 flex items-center space-x-3 border"
              animate={{ 
                backgroundColor: isPulsing 
                  ? "rgba(239, 68, 68, 0.15)" 
                  : "rgba(185, 28, 28, 0.15)",
                borderColor: isPulsing 
                  ? "rgba(239, 68, 68, 0.4)" 
                  : "rgba(185, 28, 28, 0.4)"
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div 
                className="p-2 rounded-full"
                animate={{ 
                  backgroundColor: isPulsing 
                    ? "rgba(239, 68, 68, 0.2)" 
                    : "rgba(185, 28, 28, 0.2)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ 
                    color: isPulsing ? "rgb(248, 113, 113)" : "rgb(239, 68, 68)" 
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  <AlertTriangle className="w-4 h-4" />
                </motion.div>
              </motion.div>
              <motion.p
                className="text-sm font-medium"
                animate={{ 
                  color: isPulsing ? "rgb(248, 113, 113)" : "rgb(239, 68, 68)" 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                Once chosen, the hidden queen <span className="text-white">cannot be changed</span> during the game.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default HiddenQueenRules;