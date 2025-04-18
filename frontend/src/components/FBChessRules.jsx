import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Target, Shield, Brain, Flag, Crown, User } from 'lucide-react';

const FootballChessRules = ({ onClose, darkMode = true }) => {
  // Colors optimized for dark mode with football theme
  const colors = {
    bg: 'from-gray-900 to-gray-950',
    card: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-200',
    accent: 'text-emerald-400',
    highlight: 'text-emerald-300',
    buttonBg: 'bg-gray-700 hover:bg-gray-600',
    buttonText: 'text-gray-300 hover:text-white',
    iconBg: 'bg-emerald-500 bg-opacity-20',
    iconColor: 'text-emerald-300',
    field: 'rgba(13, 90, 40, 0.4)', // Dark grass green with transparency
    lines: 'rgba(255, 255, 255, 0.15)', // Field lines
    goalPost: 'rgba(255, 255, 255, 0.2)', // Goal post color
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`mt-6 bg-gradient-to-br ${colors.bg} p-8 rounded-2xl shadow-2xl border ${colors.border} max-w-2xl mx-auto relative overflow-hidden`}
    >
      {/* Football field base */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundColor: colors.field,
          backgroundImage: `
            radial-gradient(circle at center, rgba(255,255,255,0.05) 2px, transparent 2px),
            radial-gradient(circle at center, rgba(255,255,255,0.03) 3px, transparent 3px)
          `,
          backgroundSize: '40px 40px, 60px 60px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Field markings */}
      <div className="absolute inset-0 z-0">
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white opacity-20 transform -translate-y-1/2"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-20"></div>
        
        {/* Penalty areas */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-20 border-b-2 border-l-2 border-r-2 rounded-b-lg border-white opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-20 border-t-2 border-l-2 border-r-2 rounded-t-lg border-white opacity-20"></div>
        
        {/* Goal areas */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-8 border-b-2 border-l-2 border-r-2 rounded-b-lg border-white opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 border-t-2 border-l-2 border-r-2 rounded-t-lg border-white opacity-20"></div>
        
        {/* Goal posts */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-3 border-2 border-white opacity-30 bg-gray-900 bg-opacity-50"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-3 border-2 border-white opacity-30 bg-gray-900 bg-opacity-50"></div>
      </div>

      {/* Content container with z-index to appear above the field */}
      <div className="relative z-10">
        <div className={`flex justify-between items-center mb-6 border-b ${colors.border} pb-4`}>
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-900 p-2 rounded-lg shadow-lg flex items-center justify-center">
              <div className="relative">
                <span className="text-white text-xl font-bold">♟</span>
                <span className="absolute -bottom-1 -right-1 text-xs bg-emerald-400 text-gray-900 rounded-full w-4 h-4 flex items-center justify-center">⚽</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Football Chess <span className={colors.accent}>Rules</span></h2>
          </div>
          <button 
            onClick={onClose} 
            className={`${colors.buttonText} ${colors.buttonBg} p-2 rounded-full transition-colors duration-200`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className={`space-y-6 ${colors.text}`}>
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-900 p-2 rounded-lg mt-1">
              <AlertTriangle className="text-white w-5 h-5" />
            </div>
            <p className="text-lg font-medium text-white leading-relaxed">
              Football Chess combines the tactical elements of chess with football-inspired goals, creating an exciting fast-paced variant focused on attacking your opponent's key squares.
            </p>
          </div>
          
          <div className="backdrop-blur-sm bg-gray-900 bg-opacity-60 rounded-xl p-6 border border-emerald-900 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="inline-block w-5 h-5 mr-2 rounded-full bg-emerald-400"></span>
              Core Rules
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <p>The game follows <span className="text-white font-medium">standard chess rules</span> for piece movement, with special win conditions.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <p>Your opponent's <span className="text-emerald-400 font-bold">king and queen starting squares</span> serve as your <span className="text-emerald-400 font-bold">"goal zones"</span>. For White, the goal posts are the <span className="text-white font-medium">e8 and d8 squares</span>. For Black, the goal posts are the <span className="text-white font-medium">e1 and d1 squares</span>.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <p>You <span className="text-emerald-500 font-bold">win immediately</span> by landing any of your pieces on either of these goal squares.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <p>If your king is in <span className="text-white font-medium">check</span>, you <span className="text-red-400 font-bold">must respond legally to the check on your next move</span> either by moving the king, blocking the check, or capturing the attacking piece if possible.</p>
              </div>
          
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold">5</div>
                <p>There is <span className="text-white font-medium">no checkmate or draw</span> - the game continues until someone scores a goal by reaching a target square.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-emerald-900">
            <div className="bg-emerald-900 bg-opacity-90 px-6 py-3 border-b border-emerald-800 flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-white"></div>
              <h3 className="text-lg font-semibold text-white">Strategic Insights</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center">
                  <Target className="text-white w-4 h-4" />
                </div>
                <p><span className="text-white font-medium">Offensive focus</span> – Create paths for your pieces to reach your opponent's e1 or d1 square (if you're Black) or e8 or d8 square (if you're White).</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center">
                  <Shield className="text-white w-4 h-4" />
                </div>
                <p><span className="text-white font-medium">Strategic defense</span> – Guard your king while keeping pieces ready to respond to checks legally, either by blocking, moving the king, or capturing if needed.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center">
                  <Crown className="text-white w-4 h-4" />
                </div>
                <p><span className="text-white font-medium">Force captures</span> – Put your opponent in check to limit their responses and possibly force them into defensive moves, opening paths to goal squares.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center">
                  <User className="text-white w-4 h-4" />
                </div>
                <p><span className="text-white font-medium">Long-range attackers</span> – Use bishops, rooks, and queens to create sudden threats targeting e1/d1 or e8/d8 squares depending on your side.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FootballChessRules;