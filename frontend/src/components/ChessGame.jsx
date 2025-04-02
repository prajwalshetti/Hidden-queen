// ChessGame.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChessBoardWithValidation from './ChessBoardWithValidation';
import { io } from "socket.io-client";
import HiddenQueenRules from './HiddenQueenRules';
import RoomCard from './Room';

const socket = io("http://localhost:8080");

function ChessGame() {
  const [roomID, setRoomID] = useState("");
  const [playerRole, setPlayerRole] = useState("");
  const [boardState, setBoardState] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [showRules, setShowRules] = useState(true);

  useEffect(() => {
    socket.on("playerRole", (role) => setPlayerRole(role));
    socket.on("boardState", (state) => setBoardState(state));
    socket.on("move", (move) => setBoardState(move));
    socket.on("gameOver", (msg) => setMessage(msg));
  }, []);

  const joinRoom = (roomID) => {
    setRoomID(roomID);
    socket.emit("joinRoom", roomID);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <motion.h1 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Hidden Queen Chess
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <RoomCard joinRoom={joinRoom} />
              
              <motion.div 
                layout 
                className="mt-4"
              >
                <motion.button 
                  onClick={() => setShowRules(!showRules)} 
                  className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-700 shadow-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-purple-900/30 hover:shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-purple-400">{showRules ? "♟" : "♛"}</span>
                  <span>{showRules ? "Hide Rules" : "Show Hidden Queen Rules"}</span>
                </motion.button>
                
                <AnimatePresence>
                  {showRules && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HiddenQueenRules onClose={() => setShowRules(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="gameStarted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <motion.div 
                  className="bg-gray-700 px-4 py-2 rounded-lg"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <span className="text-gray-400">Role:</span> 
                  <span className="ml-2 font-bold text-purple-400">{playerRole}</span>
                </motion.div>
                
                <motion.button
                  onClick={() => setGameStarted(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Leave Game
                </motion.button>
              </div>
              
              {message && (
                <motion.div 
                  className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg border border-red-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message}
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ChessBoardWithValidation 
                  socket={socket} 
                  roomID={roomID} 
                  playerRole={playerRole} 
                  boardState={boardState} 
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ChessGame;