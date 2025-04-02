import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";



// Chess Variants Data
const cards = [
  { id: 1, title: "Hidden Queen", description: "A chess variant with a secretly designated pawn!" },
  { id: 2, title: "Another Variant", description: "Explore another unique chess style." },
  { id: 3, title: "Mystery Chess", description: "A game full of unexpected moves!" },
];

export default function ChessVariants() {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={() => card.id === 1 && setShowRules(true)}
        >
          <Card className="w-72 h-40 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Rules Modal */}
      {showRules && <HiddenQueenRules onClose={() => setShowRules(false)} />}
    </div>
  );
}

// Hidden Queen Rules Modal (Colorful & Animated)
function HiddenQueenRules({ onClose }) {
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
            onClick={onClose}
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