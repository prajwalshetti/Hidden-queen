import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handlePlay = (varID) => {
    if(varID=='hidden-queen') navigate('/hqchessGame')
    else if(varID=='poisoned-pawn') navigate('/ppchessGame')
    else if(varID=='football-chess') navigate('/fbchessGame')
    else if(varID=='morphed-kings') navigate('/mkchessgame')
    else navigate('/chessGame');
  };

  const chessVariants = [
    {
      id: 'hidden-queen',
      name: 'Hidden Queen',
      imagePath: "hidden-queen-photo1.jpg"
    },
    {
      id: 'poisoned-pawn',
      name: 'Poisoned Pawn',
      imagePath: 'poisoned-pawn-photo.jpg',
    },
    {
      id: 'morphed-kings',
      name: 'Morphed Kings',
      imagePath: 'morphed-kings-photo.jpg',
    },
    {
      id: 'football-chess',
      name: 'Football Chess',
      imagePath: 'football-chess-photo.jpg',
    },
    {
      id: 'normal-chess',
      name: 'Normal Chess',
      imagePath: 'normal-chess-photo.jpg',
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 py-6 px-3 sm:py-9 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-7  sm:mb-10 transition-all duration-300">
          <h1 className="text-6xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Chess Variants
          </h1>
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 mx-auto"></div>
        </div>        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {chessVariants.map((variant) => (
            <div 
              key={variant.id} 
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-700"
            >
              <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center bg-gray-700">
                <img 
                  src={variant.imagePath} 
                  alt={`${variant.name} chess variant`} 
                  className="max-h-full max-w-full object-contain p-2"
                />
              </div>
              
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{variant.name}</h2>
                <button
                  onClick={() => handlePlay(variant.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;