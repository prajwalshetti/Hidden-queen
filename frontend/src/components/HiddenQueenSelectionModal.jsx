import React, { useState } from 'react';
import { usePieceTheme } from '../context/PieceThemeContext';

const HiddenQueenSelectionModal = ({ 
  isOpen, 
  playerRole, 
  onSelect 
}) => {
  const [hoveredSquare, setHoveredSquare] = useState(null);
  
  if (!isOpen) return null;
  
  // Initial board setup
  const initialBoard = {
    // White pieces on 1st rank
    a1: 'wR', b1: 'wN', c1: 'wB', d1: 'wQ', e1: 'wK', f1: 'wB', g1: 'wN', h1: 'wR',
    // White pawns on 2nd rank
    a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', e2: 'wP', f2: 'wP', g2: 'wP', h2: 'wP',
    // Black pawns on 7th rank
    a7: 'bP', b7: 'bP', c7: 'bP', d7: 'bP', e7: 'bP', f7: 'bP', g7: 'bP', h7: 'bP',
    // Black pieces on 8th rank
    a8: 'bR', b8: 'bN', c8: 'bB', d8: 'bQ', e8: 'bK', f8: 'bB', g8: 'bN', h8: 'bR',
  };

    const { pieceTheme, setPieceTheme } = usePieceTheme();
  
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
        
        // Determine if this pawn is selectable (white pawns on 2nd rank or black pawns on 7th rank)
        // Need to check the actual square notation since our view is flipped
        const isPawnSelectable = (playerRole === 'w' && square[1] === '2' && piece === 'wP') || 
                                (playerRole === 'b' && square[1] === '7' && piece === 'bP');
        
        // Get file index (1-8) for the selection callback
        const fileNumber = files.indexOf(file) + 1;
        
        squares.push({
          square,
          piece,
          isBlackSquare,
          isPawnSelectable,
          fileNumber
        });
      }
    }
    
    return squares;
  };
  
  const renderSquare = ({ square, piece, isBlackSquare, isPawnSelectable, fileNumber }) => {
    // Square background color
    const bgColor = isBlackSquare ? 'bg-gray-700' : 'bg-gray-500';
    
    // Highlight selectable pawns and add hover effect
    const highlightClass = isPawnSelectable 
      ? hoveredSquare === square 
        ? 'border-4 border-yellow-400 cursor-pointer' 
        : 'border-2 border-green-400 cursor-pointer hover:border-yellow-400' 
      : '';
    
    // Handle click only for selectable pawns
    const handleClick = () => {
      if (isPawnSelectable) {
        onSelect(fileNumber);
      }
    };
    
    return (
      <div 
        key={square}
        className={`w-12 h-12 flex items-center justify-center ${bgColor} ${highlightClass}`}
        onClick={handleClick}
        onMouseEnter={() => isPawnSelectable && setHoveredSquare(square)}
        onMouseLeave={() => isPawnSelectable && setHoveredSquare(null)}
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
          Choose a pawn to be your hidden queen
        </h2>
        
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-600 mb-4">
          {boardSquares.map(squareData => renderSquare(squareData))}
        </div>
        
        <p className="text-sm text-gray-400 text-center mt-2">
          Select which pawn will secretly be your hidden queen.
          It will look like a pawn but can move like a queen.
          It will be revealed when you make a non-pawn move with it.
        </p>
      </div>
    </div>
  );
};

export default HiddenQueenSelectionModal;