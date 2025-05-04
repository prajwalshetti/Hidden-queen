import React, { useEffect } from 'react';
import { X, Crown, Shield, Eye, Target, Shuffle } from 'lucide-react';

const MorphedKingRules = ({ onClose }) => {
  // Add staggered fade-in animation for children elements
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-in');
    
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-visible');
      }, 100 * (index + 1));
    });
  }, []);

  return (
    <div className="mt-6 bg-gradient-to-br from-gray-900 to-purple-950 p-8 rounded-2xl shadow-2xl border border-purple-700 max-w-2xl mx-auto relative overflow-hidden transition-all duration-500 animate-in animate-visible"
      style={{
        animation: "glow 8s infinite alternate",
      }}
    >
      {/* Static purple background accent with subtle pulse */}
      <div className="absolute inset-0 opacity-20 bg-purple-900" />
      
      <style jsx>{`
        @keyframes glow {
          0% { box-shadow: 0 0 5px 1px rgba(147, 51, 234, 0.2); }
          100% { box-shadow: 0 0 20px 5px rgba(147, 51, 234, 0.4); }
        }
        
        @keyframes floatIcon {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .animate-visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        
        .float-icon {
          animation: floatIcon 4s ease-in-out infinite;
        }
        
        .hover-scale {
          transition: transform 0.2s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>
      
      <div className="relative z-10">
        {/* Header with subtle animation */}
        <div className="flex justify-between items-center mb-6 border-b border-purple-700 pb-4 animate-in">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 bg-opacity-20 p-2 rounded-lg shadow-md shadow-purple-900/50 float-icon">
              <span className="text-purple-400 text-xl font-bold">♚</span>
            </div>
            <h2 className="text-2xl font-bold text-purple-400">
              Morphed King Chess
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-all duration-300 hover:rotate-90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6 text-gray-300">
          {/* Intro with animation */}
          <div className="flex items-start space-x-4 animate-in hover-scale">
            <div className="bg-purple-800 bg-opacity-30 p-2 rounded-lg mt-1 float-icon">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-lg font-medium leading-relaxed text-purple-400">
              Morphed King Chess adds mystery and deception to standard chess - your king and two rooks appear identical to your opponent, leaving them guessing which is the true king!
            </p>
          </div>
          
          {/* Core Rules with hover effect */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-purple-900 transition-all duration-300 hover:shadow-md hover:shadow-purple-900/30 animate-in">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">
              Core Rules
            </h3>
            
            <div className="space-y-4">
              {[ 
                "Choose your true king - either your original king or one of your two rooks.",
                "All three pieces (king and both rooks) appear as kings to your opponent.",
                "Your disguised rooks still move like rooks, even though they look like kings.",
                "The real king moves like a traditional king.",
                "If a disguised rook is captured, it's removed from the board and the game continues.",
                "Capture your opponent's real king to win the game."
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-3 animate-in transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold bg-purple-900 bg-opacity-40 text-purple-400">
                    {i + 1}
                  </div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Special Rules with animation */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 animate-in">
            <div className="px-6 py-3 border-b border-gray-700 bg-purple-900 bg-opacity-20">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-400 float-icon" />
                <h3 className="text-lg font-semibold text-purple-400">
                  Special Rules
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { icon: <Eye className="w-4 h-4" />, text: "There is no check or checkmate - kings can be directly captured without warning." },
                { icon: <Target className="w-4 h-4" />, text: "Kings can move into or remain in threatened squares." },
                { icon: <Shuffle className="w-4 h-4" />, text: "Castling is not allowed in this variant." },
                { icon: <span className="text-lg">♟</span>, text: "En passant pawn captures are not allowed." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3 animate-in transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 mt-1 text-purple-400 float-icon">
                    {item.icon}
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Insights */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 animate-in">
            <div className="px-6 py-3 border-b border-gray-700 bg-purple-900 bg-opacity-20">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-400 float-icon" />
                <h3 className="text-lg font-semibold text-purple-400">
                  Strategic Insights
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { icon: <Target className="w-4 h-4" />, text: "Watch your opponent's 'kings' carefully - their movement pattern reveals their true identity." },
                { icon: <Eye className="w-4 h-4" />, text: "Move your true king like a rook occasionally to create confusion." },
                { icon: <Shield className="w-4 h-4" />, text: "Keep your true king well-protected as there's no check warning." },
                { icon: <Crown className="w-4 h-4" />, text: "Use your disguised rooks aggressively to force your opponent into difficult decisions." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3 animate-in transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 mt-1 text-purple-400 float-icon">
                    {item.icon}
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Note with animation */}
          <div className="rounded-lg p-4 flex items-center space-x-3 border border-purple-900 bg-purple-900 bg-opacity-20 transition-all duration-300 hover:bg-purple-900 hover:bg-opacity-30 animate-in">
            <div className="p-2 rounded-full bg-purple-900 bg-opacity-30 float-icon">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <p className="font-medium text-purple-400">
              ✨ Important: You cannot change which piece is your true king once the game has started. Choose wisely!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorphedKingRules;