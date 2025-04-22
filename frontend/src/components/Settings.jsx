import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePieceTheme } from "../context/PieceThemeContext.jsx";
const Settings = () => {
  const navigate = useNavigate();
  const { pieceTheme, setPieceTheme } = usePieceTheme();
  
  const themes = ["kosal", "anarcandy", "alpha", "spatial"];
  
  const handleThemeChange = (e) => {
    setPieceTheme(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <motion.div 
        className="max-w-2xl mx-auto" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className={`text-center mb-10 transition-all duration-300`}>
          <h1 className="text-6xl font-bold pb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 mx-auto"></div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Piece Theme</h2>
          <div className="mb-2 text-gray-300">Choose your preferred chess piece style:</div>
          
          {/* Dropdown for theme selection */}
          <div className="mb-6">
            <select 
              value={pieceTheme} 
              onChange={handleThemeChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {themes.map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Preview board with selected theme */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-center mb-3 font-medium">
              Preview: {pieceTheme.charAt(0).toUpperCase() + pieceTheme.slice(1)} Theme
            </div>
            
            <div className="grid grid-cols-3 gap-0 max-w-xs mx-auto">
              {/* Row 8 */}
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-800 font-bold">
              <img 
                  src={`/${pieceTheme}/bB.svg`} 
                  alt="Black bishop" 
                  className="w-4/5 h-4/5"
                />
              </div>
              <div className="w-full aspect-square bg-green-700 flex items-center justify-center">
                <img 
                  src={`/${pieceTheme}/bQ.svg`} 
                  alt="Black Queen" 
                  className="w-4/5 h-4/5"
                />
              </div>
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                <img 
                  src={`/${pieceTheme}/bP.svg`} 
                  alt="Black Pawn" 
                  className="w-4/5 h-4/5"
                />
              </div>
              
              {/* Row 7 */}
              <div className="w-full aspect-square bg-green-700 flex items-center justify-center text-gray-200 font-bold">
                
              </div>
              <div className="w-full aspect-square bg-gray-200"></div>
              <div className="w-full aspect-square bg-green-700"></div>
                    
              {/* Row 6 */}
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-800 font-bold">
              <img 
                  src={`/${pieceTheme}/wN.svg`} 
                  alt="White Knight" 
                  className="w-4/5 h-4/5"
                />
              </div>
              <div className="w-full aspect-square bg-green-700 flex items-center justify-center">
                <img 
                  src={`/${pieceTheme}/wK.svg`} 
                  alt="White King" 
                  className="w-4/5 h-4/5"
                />
              </div>
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                <img 
                  src={`/${pieceTheme}/wR.svg`} 
                  alt="White Rook" 
                  className="w-4/5 h-4/5"
                />
              </div>
            </div>
            
            {/* Sample pieces display */}
            {/* <div className="mt-4 flex justify-center space-x-4">
              <div className="text-center">
                <img 
                  src={`/${pieceTheme}/wK.svg`} 
                  alt="White King" 
                  className="h-12 w-12 mx-auto"
                />
                <div className="text-xs mt-1">King</div>
              </div>
              <div className="text-center">
                <img 
                  src={`/${pieceTheme}/wQ.svg`} 
                  alt="White Queen" 
                  className="h-12 w-12 mx-auto"
                />
                <div className="text-xs mt-1">Queen</div>
              </div>
              <div className="text-center">
                <img 
                  src={`/${pieceTheme}/wB.svg`} 
                  alt="White Bishop" 
                  className="h-12 w-12 mx-auto"
                />
                <div className="text-xs mt-1">Bishop</div>
              </div>
              <div className="text-center">
                <img 
                  src={`/${pieceTheme}/wN.svg`} 
                  alt="White Knight" 
                  className="h-12 w-12 mx-auto"
                />
                <div className="text-xs mt-1">Knight</div>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* You can add more settings sections here in the future */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-purple-400">More Settings</h2>
          <p className="text-gray-400">Additional game settings will appear here in future updates.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;