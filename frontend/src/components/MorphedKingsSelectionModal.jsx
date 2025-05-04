import React, { useState } from 'react';
import { usePieceTheme } from '../context/PieceThemeContext';

const MorphedKingsSelectionModal = ({ 
  isOpen, 
  playerRole, 
  onSelect 
}) => {
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const { pieceTheme } = usePieceTheme();
  
  if (!isOpen) return null;
  
  // Initial board setup
  const initialBoard = {
    // White pieces on 1st rank
    a1: 'wK', b1: 'wN', c1: 'wB', d1: 'wQ', e1: 'wK', f1: 'wB', g1: 'wN', h1: 'wK',
    // White pawns on 2nd rank
    a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', e2: 'wP', f2: 'wP', g2: 'wP', h2: 'wP',
    // Black pawns on 7th rank
    a7: 'bP', b7: 'bP', c7: 'bP', d7: 'bP', e7: 'bP', f7: 'bP', g7: 'bP', h7: 'bP',
    // Black pieces on 8th rank
    a8: 'bK', b8: 'bN', c8: 'bB', d8: 'bQ', e8: 'bK', f8: 'bB', g8: 'bN', h8: 'bK',
  };
  
  // Generate board squares in correct order based on player perspective
  const generateBoardSquares = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    
    let orderedFiles = [...files];
    let orderedRanks = [...ranks];
    
    // For white's perspective, ranks start from 8 down to 1 (white pieces at bottom)
    if (playerRole === 'w') {
      orderedRanks.reverse();
    }
    // For black's perspective, ranks are 1 to 8 but files are reversed (black pieces at bottom)
    else if (playerRole === 'b') {
      orderedFiles.reverse();
    }
    
    const squares = [];
    
    // Generate all 64 squares
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      const rank = orderedRanks[rankIndex];
      
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const file = orderedFiles[fileIndex];
        const square = `${file}${rank}`;
        const piece = initialBoard[square] || null;
        const isBlackSquare = (fileIndex + rankIndex) % 2 === 1;
        
        // Determine if this piece is selectable (king or rooks on the player's back rank)
        let isSelectable = false;
        let selectValue = null;
        
        // The rank where the player's pieces start
        const playerBackRank = playerRole === 'w' ? '1' : '8';
        
        if (square[1] === playerBackRank&&piece === `${playerRole}K`) {
                if (square[0] === 'a') {
                isSelectable = true;
                selectValue = 1;
                } else if (square[0] === 'h') {
                isSelectable = true;
                selectValue = 8;
                } else{
                    isSelectable = true;
                    selectValue = 0;
                }
        }
        
        squares.push({
          square,
          piece,
          isBlackSquare,
          isSelectable,
          selectValue
        });
      }
    }
    
    return squares;
  };
  
  const renderSquare = ({ square, piece, isBlackSquare, isSelectable, selectValue }) => {
    // Square background color
    const bgColor = isBlackSquare ? 'bg-gray-700' : 'bg-gray-500';
    
    // Highlight selectable pieces and add hover effect
    const highlightClass = isSelectable 
      ? hoveredSquare === square 
        ? 'border-4 border-yellow-400 cursor-pointer' 
        : 'border-2 border-green-400 cursor-pointer hover:border-yellow-400' 
      : '';
    
    // Handle click only for selectable pieces
    const handleClick = () => {
      if (isSelectable) {
        onSelect(selectValue);
      }
    };
    
    return (
      <div 
        key={square}
        className={`w-12 h-12 flex items-center justify-center ${bgColor} ${highlightClass}`}
        onClick={handleClick}
        onMouseEnter={() => isSelectable && setHoveredSquare(square)}
        onMouseLeave={() => isSelectable && setHoveredSquare(null)}
      >
        {piece && (
          <img 
            src={`/${pieceTheme}/${piece}.svg`} 
            alt={piece} 
            className="w-10 h-10"
          />
        )}
      </div>
    );
  };
  
  const boardSquares = generateBoardSquares();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-purple-700 max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-purple-400">
          Choose the real king
        </h2>
        
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-600 mb-4">
          {boardSquares.map(squareData => renderSquare(squareData))}
        </div>
        
        <p className="text-sm text-gray-400 text-center mt-2">
          Select which piece will be your real king.
          The king and rooks will appear normal, but only one will act as your king.
          When your opponent captures this piece, you will lose the game.
        </p>
      </div>
    </div>
  );
};

export default MorphedKingsSelectionModal;