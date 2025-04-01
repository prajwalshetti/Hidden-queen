import React, { useState } from 'react';
import ChessBoard from './ChessBoard';
import { Chess } from 'chess.js';

function ChessGame() {
  const [game] = useState(new Chess());
  const [history, setHistory] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  
  // Function to be passed to ChessBoard component for handling move completion
  const onMoveComplete = (move) => {
    setHistory(prev => [...prev, move]);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-100 rounded-lg shadow-lg mx-auto">
      {/* Main board area */}
      <div className="w-full md:w-2/3">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Chess Game</h1>
          <ChessBoard onMoveComplete={onMoveComplete} />
        </div>
      </div>
      
      {/* Game info sidebar */}
      <div className="w-full md:w-1/3 space-y-4">
        {/* Current turn indicator */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Current Turn</h2>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${currentPlayer === 'white' ? 'bg-white' : 'bg-black'} border border-gray-400`}></div>
            <span className="capitalize">{currentPlayer}</span>
          </div>
        </div>
        
        {/* Move history */}
        <div className="bg-white min-h-screen p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Move History</h2>
          {history.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">White</th>
                    <th className="p-2 text-left">Black</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="p-2">{i+1}</td>
                      <td className="p-2">{history[i*2]?.san || history[i*2]}</td>
                      <td className="p-2">{history[i*2+1]?.san || history[i*2+1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No moves yet</p>
          )}
        </div>
        
        {/* Game controls */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Game Controls</h2>
          <div className="flex gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              New Game
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">
              Undo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChessGame;