import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handlePlay = (varID) => {
    if(varID=='hidden-queen') navigate('/hqchessGame')
    else if(varID=='poisoned-pawn') navigate('/ppchessGame')
    else if(varID=='football-chess') navigate('/fbchessGame')
      
    else navigate('/chessGame');
  };

  const chessVariants = [
    {
      id: 'hidden-queen',
      name: 'Hidden Queen',
      imagePath: "https://res.cloudinary.com/dwixyksno/image/upload/v1743702190/hidden-queen_w7z78z.png"
    },
    {
      id: 'poisoned-pawn',
      name: 'Poisoned Pawn',
      imagePath: 'https://res.cloudinary.com/dwixyksno/image/upload/v1743702277/poisoned-pawn_lywepm.png',
    },
    {
      id: 'football-chess',
      name: 'Football Chess',
      imagePath: 'https://res.cloudinary.com/dwixyksno/image/upload/v1744961841/WhatsApp_Image_2025-04-18_at_12.03.38_26083d67_xopxlr.jpg',
    },
    {
      id: 'normal-chess',
      name: 'Normal Chess',
      imagePath: 'https://res.cloudinary.com/dwixyksno/image/upload/v1743702268/normal-chess_c1mrax.png',
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 py-9 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-9">Chess Variants</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chessVariants.map((variant) => (
            <div 
              key={variant.id} 
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-700"
            >
              <div className="h-64 flex items-center justify-center bg-gray-700">
                <img 
                  src={variant.imagePath} 
                  alt={`${variant.name} chess variant`} 
                  className="max-h-full max-w-full object-contain p-2"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">{variant.name}</h2>
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