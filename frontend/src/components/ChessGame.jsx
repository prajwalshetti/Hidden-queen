//ChessGame.jsx
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
  const [isResigning, setIsResigning] = useState(false);

  useEffect(() => {
    // Check localStorage on component mount
    const savedRoomID = localStorage.getItem('roomID');
    const savedRole = localStorage.getItem('playerRole');
    
    if (savedRoomID && savedRole) {
      setRoomID(savedRoomID);
      setPlayerRole(savedRole);
      setGameStarted(true);
      
      // Reconnect to the room
      socket.emit("joinRoomBack", {roomID: savedRoomID, savedRole});
      }
    
    socket.on("playerRole", (role) => {
      setPlayerRole(role);
      localStorage.setItem('playerRole', role);
    });
    
    socket.on("boardState", (state) => {
      setBoardState(state);
    });
    
    socket.on("move", (move) => {
      setBoardState(move);
    });
    
    socket.on("gameOver", (msg) => {
      setMessage(msg);
      // Clear localStorage when game ends
      localStorage.removeItem('roomID');
      localStorage.removeItem('playerRole');
    });

    return () => {
      socket.off("playerRole");
      socket.off("boardState");
      socket.off("move");
      socket.off("gameOver");
    };
  }, []);

  const joinRoom = (roomID) => {
    setRoomID(roomID);
    socket.emit("joinRoom", roomID);
    setGameStarted(true);
    
    // Save to localStorage
    localStorage.setItem('roomID', roomID);
    // playerRole will be set when server responds
  };

  const handleResign = () => {
    if (playerRole !== "spectator") {
      socket.emit("resign", { roomID });
      setMessage(`You resigned. ${playerRole === 'w' ? 'Black' : 'White'} wins.`);
      
      // Clear localStorage on resign
      localStorage.removeItem('roomID');
      localStorage.removeItem('playerRole');
    }
  };

  const confirmResign = () => {
    setIsResigning(true);
  };
  
  const cancelResign = () => {
    setIsResigning(false);
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
                  <span className="ml-2 font-bold text-purple-400">{playerRole === 'w' ? 'White' : playerRole === 'b' ? 'Black' : 'Spectator'}</span>
                </motion.div>
                
                {playerRole !== "spectator" && !isResigning && (
                  <motion.button
                    onClick={confirmResign}
                    className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resign
                  </motion.button>
                )}
              </div>
              
              {isResigning && (
                <motion.div 
                  className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="mb-3 text-center">Are you sure you want to resign?</p>
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={handleResign}
                      className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                    >
                      Yes, Resign
                    </button>
                    <button 
                      onClick={cancelResign}
                      className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
              
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