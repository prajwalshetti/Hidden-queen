// HiddenQueenRules.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "./ui/card";

function HiddenQueenRules() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 rounded-xl shadow-2xl border border-purple-900 overflow-hidden">
        <CardContent className="p-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <h1 className="text-4xl font-extrabold text-center relative z-10">
                <span className="text-purple-500">♛</span> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Hidden Queen Rules
                </span> 
                <span className="text-purple-500">♛</span>
              </h1>
              <motion.div
                className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full z-0"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>

          <motion.p 
            className="text-xl text-center mb-8 text-gray-300"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <span className="text-yellow-300 font-bold">Welcome to Hidden Queen Chess!</span> This is a special version of chess where a <span className="text-purple-400">pawn</span> secretly holds the power of a <span className="text-purple-400">queen</span>!
            <br /><br />
            <span className="inline-block bg-gray-800 px-3 py-1 rounded-full">🎩 <strong>Imagine a magic trick!</strong> One of your pawns is actually a <span className="text-purple-400 font-bold">hidden queen</span> in disguise, but <span className="text-yellow-300 font-bold">your opponent doesn't know which one!</span> 🤯</span>
          </motion.p>

          <motion.div 
            className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="absolute inset-0 bg-purple-900/5"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              style={{
                backgroundSize: '200% 200%',
                backgroundImage: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%)'
              }}
            />

            <motion.h2 
              className="text-3xl font-bold text-center mb-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                How Does It Work? 🧐
              </span>
            </motion.h2>

            <motion.ul 
              className="text-lg space-y-4 relative"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.li variants={item} className="flex items-start space-x-3">
                <span className="text-white text-2xl">♟</span>
                <span><span className="font-bold text-yellow-400">Choosing Your Hidden Queen:</span> On your first move, <span className="font-bold text-white">double-click one of your pawns</span> to designate it as the Hidden Queen. This choice is permanent!</span>
              </motion.li>
              
              <motion.li variants={item} className="flex items-start space-x-3">
                <span className="text-blue-400 text-2xl">🕵️</span>
                <span><span className="font-bold text-yellow-400">Secret Identity:</span> You'll see your chosen pawn as a special piece, but <span className="font-bold text-white">your opponent still sees it as a normal pawn</span> - they won't know which pawn hides your queen!</span>
              </motion.li>
              
              <motion.li variants={item} className="flex items-start space-x-3">
                <span className="text-white text-2xl">♙</span>
                <span><span className="font-bold text-yellow-400">Movement Before Reveal:</span> Your Hidden Queen <span className="font-bold text-white">moves like a regular pawn</span> at first and can capture diagonally like normal pawns.</span>
              </motion.li>
              
              <motion.li variants={item} className="flex items-start space-x-3">
                <span className="text-purple-400 text-2xl">♛</span>
                <span><span className="font-bold text-yellow-400">The Grand Reveal:</span> When your Hidden Queen makes a non-pawn move (like moving diagonally without capturing or moving backward), it <span className="font-bold text-white">transforms into a visible queen</span> for everyone!</span>
              </motion.li>
              
              <motion.li variants={item} className="flex items-start space-x-3">
                <span className="text-yellow-400 text-2xl">✨</span>
                <span><span className="font-bold text-yellow-400">After Revelation:</span> Once revealed, your Hidden Queen <span className="font-bold text-white">behaves exactly like a standard queen</span> with all its powerful moves.</span>
              </motion.li>
              
              <motion.li variants={item} className="flex items-start space-x-3">
                <span className="text-white text-2xl">♚</span>
                <span><span className="font-bold text-yellow-400">Winning the Game:</span> Win by checkmate or by capturing your opponent's king, just like in regular chess.</span>
              </motion.li>
            </motion.ul>
          </motion.div>

          <motion.div 
            className="mt-6 bg-purple-900/20 p-4 rounded-lg border border-purple-800/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-bold text-center mb-2 text-purple-300">Strategic Tips 🧠</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">🔮</span>
                <p className="text-sm text-gray-300">Choose your Hidden Queen carefully! Middle pawns have more movement options.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">🎭</span>
                <p className="text-sm text-gray-300">Try to mislead your opponent about which pawn is special.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">⚡</span>
                <p className="text-sm text-gray-300">Reveal your Hidden Queen at a strategic moment for maximum surprise.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">🛡️</span>
                <p className="text-sm text-gray-300">Protect your Hidden Queen until you're ready to reveal its power!</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 text-center text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-lg">
              <span className="text-yellow-400">🌟</span> This twist makes chess <span className="font-bold text-white">more exciting and unpredictable!</span> <br />
              <span className="text-yellow-400">🎉</span> Will your Hidden Queen turn the tide of battle? <span className="font-bold text-white">Play now and find out!</span> <span className="text-yellow-400">🏆</span>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default HiddenQueenRules;