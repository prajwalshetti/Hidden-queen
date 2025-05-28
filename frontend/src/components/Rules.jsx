import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, X, Skull, Flag, Shield } from "lucide-react";
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
    description: "One pawn is dangerous-capture it and you will lose",
    icon: Skull,
    color: "border-red-500"
  },
  { 
    id: 3, 
    title: "Morphed Kings", 
    description: "Find the real king among 3 and capture it!",
    icon: Shield,
    color: "border-green-500"
  },
  { 
    id: 4, 
    title: "Football Chess", 
    description: "Reach your opponent's goal squares to win!",
    icon: Flag,
    color: "border-blue-500"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white p-4 sm:p-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold pb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
          How to play?
        </h1>
        <div className="mt-2 h-1 w-28 sm:w-36 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 mx-auto rounded-full"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 px-2 sm:px-0 max-w-7xl mx-auto w-full">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(80,30,180,0.25)" }}
            whileTap={{ scale: 0.96 }}
            className="cursor-pointer transition-all"
            onClick={() => openRules(card.id)}
          >
            <Card className={`w-full h-52 border-2 ${card.color} bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden`}>
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-2 bg-white/10 rounded-full">
                      <card.icon size={28} className="text-yellow-300" />
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight">{card.title}</h2>
                  </div>
                  <p className="text-base text-gray-300 leading-snug">{card.description}</p>
                </div>
                <div className="flex justify-end mt-6">
                  <span className="text-sm text-blue-400 flex items-center gap-1 font-semibold group">
                    View rules
                    <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      {showRules && activeVariant === 3 && <MorphedKingsRules onClose={closeRules} />}
      {showRules && activeVariant === 4 && <FootballChessRules onClose={closeRules} />}
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
            onClick={()=>{navigate("/")}}
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
            onClick={()=>{navigate("/")}}
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

function MorphedKingsRules({ onClose }) {
  const navigate = useNavigate();
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
        className="w-full max-w-4xl h-5/6 bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 rounded-3xl shadow-2xl overflow-y-auto border-4 border-white mx-4 relative"
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
            <span className="text-4xl text-yellow-200">♚</span>
          </motion.div>
          Morphed King Chess
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <span className="text-4xl text-yellow-200">♚</span>
          </motion.div>
        </motion.h1>
        
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Core Rules</h2>
          <div className="space-y-6">
            <motion.div 
              className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">1.</span> Choose Your True King
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>At the start, secretly select your true king: either your original king or one of your two rooks.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">2.</span> Hidden Identities
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>To your opponent, all three pieces (king and both rooks) appear as kings, making it impossible for them to know which is the real king.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">3.</span> Disguised Rooks
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>Your disguised rooks still move like rooks, even though they look like kings to your opponent.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">4.</span> Real King Movement
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>The real king moves as a traditional king does in standard chess.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">5.</span> Capturing Disguised Rooks
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>If a disguised rook is captured, it is removed from the board and play continues.</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">6.</span> Winning the Game
              </h3>
              <ul className="ml-8 mt-2 list-disc space-y-1">
                <li>Capture your opponent's real king to win the game.</li>
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-center mb-3">Special Rules</h2>
          <ul className="space-y-2 text-lg">
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-purple-500 font-bold mr-2">♟</span> 
              There is <span className="font-bold">no check or checkmate</span> — kings can be directly captured without warning.
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-purple-500 font-bold mr-2">♟</span> 
              Kings can move into or remain in threatened squares.
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-purple-500 font-bold mr-2">♟</span> 
              <span className="font-bold">Castling is not allowed</span> in this variant.
            </motion.li>
            <motion.li 
              className="flex items-start"
              whileHover={{ x: 5 }}
            >
              <span className="text-purple-500 font-bold mr-2">♟</span> 
              <span className="font-bold">En passant</span> pawn captures are not allowed.
            </motion.li>
          </ul>
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <motion.button 
            className="px-6 py-3 text-xl bg-yellow-300 text-gray-900 font-bold rounded-lg"
            onClick={() => { navigate("/") }}
            whileHover={{ scale: 1.1, backgroundColor: "#FBBF24" }}
            whileTap={{ scale: 0.95 }}
          >
            ♚ Start Playing!
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
            onClick={()=>{navigate("/")}}
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