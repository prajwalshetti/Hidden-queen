import React, { useEffect } from 'react';
import { X, AlertTriangle, Target, Shield, Brain } from 'lucide-react';

const HiddenQueenRules = ({ onClose }) => {
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
    <div className="mt-6 bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl mx-auto relative overflow-hidden transition-all duration-500 animate-in animate-visible"
      style={{
        animation: "glow 8s infinite alternate",
      }}
    >
      {/* Static blue background accent with subtle pulse */}
      <div className="absolute inset-0 opacity-20 bg-blue-900" />
      
      <style jsx>{`
        @keyframes glow {
          0% { box-shadow: 0 0 5px 1px rgba(37, 99, 235, 0.2); }
          100% { box-shadow: 0 0 20px 5px rgba(37, 99, 235, 0.4); }
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
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4 animate-in">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg shadow-md shadow-blue-900/50 float-icon">
              <span className="text-blue-400 text-xl font-bold">♛</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-400">
              Hidden Queen Chess
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
            <div className="bg-blue-800 bg-opacity-30 p-2 rounded-lg mt-1 float-icon">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-lg font-medium leading-relaxed text-blue-400">
              Hidden Queen Chess transforms standard chess with a single powerful secret: one of your pawns is actually a queen in disguise!
            </p>
          </div>
          
          {/* Core Rules with hover effect */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-blue-900 transition-all duration-300 hover:shadow-md hover:shadow-blue-900/30 animate-in">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Core Rules
            </h3>
            
            <div className="space-y-4">
              {[ 
                "Each player secretly designates one pawn as their Hidden Queen.",
                "The Hidden Queen appears as a normal pawn to your opponent.",
                "Your Hidden Queen can move as a pawn or as a queen.",
                "Any non-pawn move permanently reveals your Hidden Queen.",
                "The En Passant pawn move is not allowed.",
                "Win by capturing the opponent's king (not by checkmate)."
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-3 animate-in transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold bg-blue-900 bg-opacity-40 text-blue-400">
                    {i + 1}
                  </div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Strategic Insights with animation */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 animate-in">
            <div className="px-6 py-3 border-b border-gray-700 bg-blue-900 bg-opacity-20">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-400 float-icon" />
                <h3 className="text-lg font-semibold text-blue-400">
                  Strategic Insights
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { icon: <Target className="w-4 h-4" />, text: "Edge pawns surprise with unexpected lateral moves." },
                { icon: <Shield className="w-4 h-4" />, text: "Move several pawns similarly to conceal which is the queen." },
                { icon: <AlertTriangle className="w-4 h-4" />, text: "Keep your queen hidden for a devastating surprise attack." },
                { icon: <span className="text-lg">♟</span>, text: "Maintain strong defenses since kings can be captured directly." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3 animate-in transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 mt-1 text-blue-400 float-icon">
                    {item.icon}
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Note with animation */}
          <div className="rounded-lg p-4 flex items-center space-x-3 border border-blue-900 bg-blue-900 bg-opacity-20 transition-all duration-300 hover:bg-blue-900 hover:bg-opacity-30 animate-in">
            <div className="p-2 rounded-full bg-blue-900 bg-opacity-30 float-icon">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
            </div>
            <p className="font-medium text-blue-400">
              ✨ Important: Once revealed, your Hidden Queen cannot revert to appearing as a pawn, nor be changed during the game.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenQueenRules;