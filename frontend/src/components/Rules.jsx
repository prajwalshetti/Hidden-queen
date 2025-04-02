import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

// Chess Variants Data
const cards = [
  { id: 1, title: "Hidden Queen", description: "A chess variant with a surprise queen!" },
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

// 🎨 Hidden Queen Rules Modal (Colorful & Animated)
function HiddenQueenRules({ onClose }) {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-[90vw] h-[80vh] bg-gradient-to-r from-blue-400 to-purple-500 text-white p-10 rounded-3xl shadow-2xl overflow-y-auto border-4 border-white"
      >
        <h1 className="text-5xl font-extrabold text-center mb-6 animate-pulse">♛ Hidden Queen Rules ♛</h1>
        
        <p className="text-2xl mb-6 text-center">
          <span className="text-yellow-300 font-bold">Welcome to Hidden Queen Chess!</span> This is a special version of chess where something exciting happens...
          <br /><br />
          🎩 **Imagine a magic trick!** There is a **hidden queen** on the board, but **you don’t know where she is!** 🤯
        </p>

        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-4">How Does It Work? 🧐</h2>
          <ul className="text-xl list-disc pl-10 leading-relaxed">
            <li>📌 At the start, the **queen is NOT on the board.**</li>
            <li>🕵️ You play chess **as usual**, but **somewhere** the queen is secretly waiting.</li>
            <li>🎭 **The queen appears** when a special move is made! It could be after a certain number of moves or when a piece is captured.</li>
            <li>♛ Once she appears, she moves like a normal queen! **(Straight & diagonal, like in regular chess)**</li>
            <li>🧠 **You must change your strategy!** Suddenly, you have a powerful piece in the game!</li>
          </ul>
        </div>

        <p className="text-xl text-center mt-6">
          🌟 This makes chess **more exciting** because you never know **when or where the queen will appear!** <br />
          🎉 Will she save you? Or will she surprise your opponent? Play and find out! 🏆
        </p>

        {/* Close Button */}
        <div className="flex justify-center mt-8">
          <Button 
            className="px-6 py-3 text-2xl bg-yellow-300 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-110"
            onClick={onClose}
          >
            🎭 Close & Play!
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
