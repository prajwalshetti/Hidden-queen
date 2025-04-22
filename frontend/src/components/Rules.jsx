import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, X, Skull, Flag } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

// Chess Variants Data with icons
const cards = [
  { 
    id: 1, 
    title: "Hidden Queen", 
    description: "A chess variant with a secretly designated pawn!",
    icon: Crown,
    color: "border-purple-500"
  },
  { 
    id: 2, 
    title: "Poisoned Pawn", 
    description: "Designate a poisoned pawn - capturing it means instant defeat!",
    icon: Skull,
    color: "border-red-500"
  },
  { 
    id: 3, 
    title: "Football Chess", 
    description: "Reach your opponent's goal squares to win!",
    icon: Flag,
    color: "border-green-500"
  },
];

export default function ChessVariants() {
  const [showRules, setShowRules] = useState(false);
  const [activeVariant, setActiveVariant] = useState(null);
  
  const openRules = (variantId) => {
    setActiveVariant(variantId);
    setShowRules(true);
  };
  
  const closeRules = () => {
    setShowRules(false);
    setActiveVariant(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className={`text-center mb-10 transition-all duration-300`}>
          <h1 className="text-6xl font-bold pb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            How to play?
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 mx-auto"></div>
        </div>
      
      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer"
            onClick={() => openRules(card.id)}
          >
            <Card className={`w-80 h-44 border ${card.color} bg-gray-800 rounded-xl shadow-lg`}>
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <card.icon size={24} />
                    <h2 className="text-xl font-bold">{card.title}</h2>
                  </div>
                  <p className="text-gray-300">{card.description}</p>
                </div>
                
                <div className="flex justify-end mt-4">
                  <span className="text-sm text-blue-400 flex items-center gap-1">
                    View rules
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Rules Modals */}
      {showRules && activeVariant === 1 && <HiddenQueenRules onClose={closeRules} />}
      {showRules && activeVariant === 2 && <PoisonedPawnRules onClose={closeRules} />}
      {showRules && activeVariant === 3 && <FootballChessRules onClose={closeRules} />}
    </div>
  );
}

// Hidden Queen Rules Modal (Colorful & Animated)
function HiddenQueenRules({ onClose }) {
  const navigate=useNavigate()
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full max-w-4xl h-5/6 bg-gradient-to-r from-blue-400 to-purple-500 text-white p-8 rounded-3xl shadow-2xl overflow-y-auto border-4 border-white mx-4 relative"
      >
        {/* Close button */}
        <motion.button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
          whileHover={{ scale: 1.2, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <X size={24} />
        </motion.button>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold text-center mb-6 flex justify-center items-center gap-3"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Crown size={36} className="text-yellow-300" />
          </motion.div>
          Hidden Queen Chess
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Crown size={36} className="text-yellow-300" />
          </motion.div>
        </motion.h1>
        
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Official Rules</h2>
          
          <div className="space-y-6">
            <motion.div 
              className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">1.</span> Choosing the Hidden Queen
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>On your <span className="font-bold text-blue-600">first move</span>, you <span className="font-bold">must</span> double-click one of your pawns to designate it as the Hidden Queen.</li>
                <li>Once selected, this choice <span className="font-bold">cannot be changed</span>.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">2.</span> Hidden Queen's Appearance
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>For <span className="font-bold text-green-600">you</span>, the Hidden Queen appears as a unique piece.</li>
                <li>For <span className="font-bold text-red-600">your opponent</span>, it still looks like a normal pawn.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">3.</span> Movement and Reveal
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>The Hidden Queen moves like a pawn <span className="font-bold">until</span> it makes a <span className="font-bold">non-pawn move</span>.</li>
                <li>Non-pawn moves include: moving diagonally without capturing or moving backward.</li>
                <li>When it makes such a move, it <span className="font-bold text-purple-600">transforms into a visible queen</span> for everyone.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">4.</span> Capturing and Gameplay
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>The Hidden Queen can <span className="font-bold">capture pieces like a pawn</span> before being revealed.</li>
                <li>Once revealed, it behaves exactly like a standard queen.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">5.</span> Winning Conditions
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>Win by <span className="font-bold">checkmate</span> or by <span className="font-bold">capturing the opponent's king</span>.</li>
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-2xl font-bold text-center mb-3">Strategy Tips</h2>
          <ul className="space-y-2 text-lg">
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-yellow-500 font-bold mr-2">★</span> 
              <span>Choose your Hidden Queen carefully - central pawns have more mobility</span>
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-yellow-500 font-bold mr-2">★</span> 
              <span>Time your queen's reveal strategically for maximum surprise</span>
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-yellow-500 font-bold mr-2">★</span> 
              <span>Watch your opponent's moves carefully - they might have a Hidden Queen too!</span>
            </motion.li>
          </ul>
        </motion.div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <motion.button 
            className="px-6 py-3 text-xl bg-yellow-300 text-gray-900 font-bold rounded-lg"
            onClick={()=>{navigate("/dashboard")}}
            whileHover={{ scale: 1.1, backgroundColor: "#FBBF24" }}
            whileTap={{ scale: 0.95 }}
            
          >
            ♛ Start Playing!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Poisoned Pawn Rules Modal
function PoisonedPawnRules({ onClose }) {
  const navigate = useNavigate()
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full max-w-4xl h-5/6 bg-gradient-to-r from-green-500 to-teal-600 text-white p-8 rounded-3xl shadow-2xl overflow-y-auto border-4 border-white mx-4 relative"
      >
        {/* Close button */}
        <motion.button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
          whileHover={{ scale: 1.2, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <X size={24} />
        </motion.button>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold text-center mb-6 flex justify-center items-center gap-3"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Skull size={36} className="text-green-300" />
          </motion.div>
          Poisoned Pawn Chess
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Skull size={36} className="text-green-300" />
          </motion.div>
        </motion.h1>
        
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Official Rules</h2>
          
          <div className="space-y-6">
            <motion.div 
              className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">1.</span> Choosing the Poisoned Pawn
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>Each player <span className="font-bold text-green-600">secretly designates</span> one of their pawns as the "poisoned pawn" before the game begins.</li>
                <li>Once selected, this choice <span className="font-bold">cannot be changed</span>.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">2.</span> Standard Movement
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>The game follows all <span className="font-bold text-blue-600">standard chess rules</span> for movement and capture.</li>
                <li>All pieces move and capture according to traditional chess rules.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">3.</span> Capturing the Poisoned Pawn
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>If a player <span className="font-bold">captures their opponent's poisoned pawn</span>, they <span className="font-bold text-red-600">immediately lose</span> the game.</li>
                <li>The capture triggers an instant victory for the owner of the poisoned pawn.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">4.</span> Normal Pawn Usage
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>The poisoned pawn can be <span className="font-bold">moved and used like any other pawn</span> throughout the game.</li>
                <li>It has no special movement capabilities and follows standard pawn rules.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">5.</span> Alternative Win Conditions
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>Standard win conditions like <span className="font-bold">checkmate, resignation, or timeout</span> still apply.</li>
                <li>Players can win through traditional means if no poisoned pawn is captured.</li>
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-2xl font-bold text-center mb-3">Strategy Tips</h2>
          <ul className="space-y-2 text-lg">
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-green-500 font-bold mr-2">★</span> 
              <span>Choose a pawn that's likely to be captured - central pawns are good candidates</span>
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-green-500 font-bold mr-2">★</span> 
              <span>Try to bait your opponent into capturing your poisoned pawn</span>
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-green-500 font-bold mr-2">★</span> 
              <span>Be cautious when capturing opponent pawns - one might be poisoned!</span>
            </motion.li>
          </ul>
        </motion.div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <motion.button 
            className="px-6 py-3 text-xl bg-green-300 text-gray-900 font-bold rounded-lg"
            onClick={()=>{navigate("/dashboard")}}
            whileHover={{ scale: 1.1, backgroundColor: "#6EE7B7" }}
            whileTap={{ scale: 0.95 }}
          >
            ♟ Start Playing!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Football Chess Rules Modal
function FootballChessRules({ onClose }) {
  const navigate = useNavigate()
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full max-w-4xl h-5/6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-2xl overflow-y-auto border-4 border-white mx-4 relative"
      >
        {/* Close button */}
        <motion.button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
          whileHover={{ scale: 1.2, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <X size={24} />
        </motion.button>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold text-center mb-6 flex justify-center items-center gap-3"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Flag size={36} className="text-blue-300" />
          </motion.div>
          Football Chess
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Flag size={36} className="text-blue-300" />
          </motion.div>
        </motion.h1>
        
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Official Rules</h2>
          
          <div className="space-y-6">
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">1.</span> Standard Movement
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>The game follows <span className="font-bold text-blue-600">standard chess rules</span> for piece movement, with special win conditions.</li>
                <li>All pieces move according to traditional chess rules.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">2.</span> Goal Zones
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>Your opponent's <span className="font-bold text-green-600">king and queen starting squares</span> serve as your "goal zones".</li>
                <li>For White, the goal posts are the <span className="font-bold">e8 and d8 squares</span>.</li>
                <li>For Black, the goal posts are the <span className="font-bold">e1 and d1 squares</span>.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">3.</span> Scoring a Goal
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>You <span className="font-bold text-green-600">win immediately</span> by landing any of your pieces on either of these goal squares.</li>
                <li>This is called "scoring a goal" and results in instant victory.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">4.</span> Check Rules
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>If your king is in check, you <span className="font-bold text-red-600">must respond legally to the check on your next move</span> either by moving the king, blocking the check, or capturing the attacking piece if possible.</li>
                <li>Standard check rules still apply.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">5.</span> No Checkmate or Draw
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>There is <span className="font-bold">no checkmate or draw</span> - the game continues until someone scores a goal by reaching a target square.</li>
                <li>Traditional win conditions of chess do not apply in this variant.</li>
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-2xl font-bold text-center mb-3">Strategy Tips</h2>
          <ul className="space-y-2 text-lg">
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-blue-500 font-bold mr-2">★</span> 
              <span>Position your pieces for a direct run at your opponent's goal squares</span>
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-blue-500 font-bold mr-2">★</span> 
              <span>Knights can be particularly useful for jumping past defensive lines</span>
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-blue-500 font-bold mr-2">★</span> 
              <span>Defend your goal squares at all costs - once they're reached, the game is over!</span>
            </motion.li>
          </ul>
        </motion.div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <motion.button 
            className="px-6 py-3 text-xl bg-blue-300 text-gray-900 font-bold rounded-lg"
            onClick={()=>{navigate("/dashboard")}}
            whileHover={{ scale: 1.1, backgroundColor: "#93C5FD" }}
            whileTap={{ scale: 0.95 }}
          >
            ⚽ Start Playing!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}