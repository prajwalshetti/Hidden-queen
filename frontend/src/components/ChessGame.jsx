import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChessBoardWithValidation from './ChessBoardWithValidation';
import { io } from "socket.io-client";
import HiddenQueenRules from './HiddenQueenRules';
import RoomCard from './Room';
import { useNavigate } from 'react-router-dom';
import ChatBox from './chat';
import PlayerInfo from './username';

const socket = io("http://localhost:8080");

function ChessGame() {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState("");
  const [playerRole, setPlayerRole] = useState("");
  const [boardState, setBoardState] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [showRules, setShowRules] = useState(true);
  const [isResigning, setIsResigning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  // New state variables for player information and clock
  const [username, setUsername] = useState("");
  const [whiteUsername, setWhiteUsername] = useState("White Player");
  const [blackUsername, setBlackUsername] = useState("Black Player");
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes
  const [blackTime, setBlackTime] = useState(600); // 10 minutes
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    // Check localStorage on component mount
    const savedRoomID = localStorage.getItem('roomID');
    const savedRole = localStorage.getItem('playerRole');
    const savedUsername = localStorage.getItem('username');
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    
    if (savedRoomID && savedRole) {
      setRoomID(savedRoomID);
      setPlayerRole(savedRole);
      setGameStarted(true);
      
      // Reconnect to the room
      socket.emit("joinRoomBack", {roomID: savedRoomID, savedRole, username: savedUsername || "Player"});
    }
    
    socket.on("playerRole", (role) => {
      setPlayerRole(role);
      localStorage.setItem('playerRole', role);
      
      // Update player username based on role
      if (role === 'w') {
        setWhiteUsername(username || "You");
      } else if (role === 'b') {
        setBlackUsername(username || "You");
      }
    });
    
    socket.on("boardState", (state) => {
      setBoardState(state);
      // Update turn based on FEN string
      const isTurnWhite = state.split(" ")[1] === "w";
      setIsWhiteTurn(isTurnWhite);
    });
    
    socket.on("move", (move) => {
      setBoardState(move);
      // Update turn based on FEN string
      const isTurnWhite = move.split(" ")[1] === "w";
      setIsWhiteTurn(isTurnWhite);
    });
    
    socket.on("gameOver", (msg) => {
      setMessage(msg);
      setGameEnded(true);
    });

    socket.on("opponentResigned", (msg) => {
      setMessage(msg);
      setGameEnded(true);
    });
    
    socket.on("playerInfo", (info) => {
      if (info.role === 'w') {
        setWhiteUsername(info.username || "White Player");
      } else if (info.role === 'b') {
        setBlackUsername(info.username || "Black Player");
      }
    });

    return () => {
      socket.off("playerRole");
      socket.off("boardState");
      socket.off("move");
      socket.off("gameOver");
      socket.off("opponentResigned");
      socket.off("playerInfo");
    };
  }, [username]);

  const joinRoom = (roomID) => {
    if (!username) {
      setShowUsernameModal(true);
      localStorage.setItem('pendingRoomID', roomID);
      return;
    }
    
    completeJoinRoom(roomID);
  };
  
  const completeJoinRoom = (roomID) => {
    setRoomID(roomID);
    socket.emit("joinRoom", roomID);
    setGameStarted(true);
    
    // Save to localStorage
    localStorage.setItem('roomID', roomID);
    // playerRole will be set when server responds
    
    // Emit player info to server
    socket.emit("playerInfo", { roomID, username });
  };
  
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setUsername(usernameInput);
      localStorage.setItem('username', usernameInput);
      setShowUsernameModal(false);
      
      const pendingRoomID = localStorage.getItem('pendingRoomID');
      if (pendingRoomID) {
        localStorage.removeItem('pendingRoomID');
        completeJoinRoom(pendingRoomID);
      }
    }
  };

  const handleResign = () => {
    if (playerRole !== "spectator") {
      socket.emit("resign", { roomID });
      setMessage(`You resigned. ${playerRole === 'w' ? 'Black' : 'White'} wins.`);
      setGameEnded(true);
    }
  };

  const confirmResign = () => {
    setIsResigning(true);
  };
  
  const cancelResign = () => {
    setIsResigning(false);
  };

  const handleLeaveRoom = () => {
    // Emit leave room event to server
    socket.emit("leaveRoom", { roomID });
    
    // Clear localStorage
    localStorage.removeItem('roomID');
    localStorage.removeItem('playerRole');
    
    // Reset states
    setGameStarted(false);
    setMessage("");
    setGameEnded(false);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const handleTimeUp = (color) => {
    if (!gameEnded) {
      const winner = color === 'white' ? 'Black' : 'White';
      setMessage(`Time's up! ${winner} wins by timeout.`);
      setGameEnded(true);
      socket.emit("timeUp", { roomID, loser: color === 'white' ? 'w' : 'b' });
    }
  };

  // Helper function to get the appropriate username display
  const getPlayerName = (role) => {
    if (playerRole === role) {
      return username || "You";
    } else if (role === 'w') {
      return whiteUsername;
    } else if (role === 'b') {
      return blackUsername;
    }
    return "Player";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <motion.div 
        className="max-w-7xl mx-auto"
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
          {showUsernameModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-xl shadow-xl border border-purple-700 max-w-md w-full"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h2 className="text-2xl font-bold text-center mb-4 text-purple-400">Enter Your Username</h2>
                <form onSubmit={handleUsernameSubmit}>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                    placeholder="Username"
                    autoFocus
                  />
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      onClick={() => setShowUsernameModal(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Confirm
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {!gameStarted ? (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Username setup */}
              <motion.div
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-4 text-purple-400">Set Your Username</h2>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={username || "Enter username"}
                  />
                  <motion.button
                    onClick={() => {
                      if (usernameInput.trim()) {
                        setUsername(usernameInput);
                        localStorage.setItem('username', usernameInput);
                        setUsernameInput("");
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Set
                  </motion.button>
                </div>
                {username && (
                  <p className="mt-2 text-green-400">
                    Current username: <span className="font-bold">{username}</span>
                  </p>
                )}
              </motion.div>
              
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
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Left sidebar for dashboard (empty for now) */}
              <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 hidden md:block">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Game Dashboard</h3>
                <div className="text-gray-400 text-sm">
                  <p>Room ID: {roomID}</p>
                  <p>Your role: {playerRole === 'w' ? 'White' : playerRole === 'b' ? 'Black' : 'Spectator'}</p>
                  <p className="mt-4 text-xs text-gray-500">Game statistics and additional controls will appear here in future updates.</p>
                </div>
              </div>
              
              {/* Main chess board and controls */}
              <div className="md:col-span-1 flex flex-col space-y-4">
                {/* Top player info (black) */}
                <PlayerInfo 
                  username={getPlayerName('b')}
                  rating={null}
                  isActive={!isWhiteTurn && !gameEnded}
                  timeRemaining={blackTime}
                  onTimeUp={() => handleTimeUp('black')}
                  playerColor="black"
                />
                
                <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
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
                    
                    <div className="flex space-x-3">
                      {/* Show Resign button only for players when game is active */}
                      {playerRole !== "spectator" && !gameEnded && !isResigning && (
                        <motion.button
                          onClick={confirmResign}
                          className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Resign
                        </motion.button>
                      )}
                      
                      {/* Show Leave button for spectators always, and for players after game ends */}
                      {(playerRole === "spectator" || gameEnded) && (
                        <motion.button
                          onClick={handleLeaveRoom}
                          className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          Leave Room
                        </motion.button>
                      )}
                    </div>
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
                      className={`mb-4 p-3 rounded-lg border ${gameEnded ? 'bg-purple-900/50 text-purple-200 border-purple-700' : 'bg-red-900/50 text-red-200 border-red-700'}`}
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
                      gameEnded={gameEnded}
                    />
                  </motion.div>
                </div>
                
                {/* Bottom player info (white) */}
                <PlayerInfo 
                  username={getPlayerName('w')}
                  rating={null}
                  isActive={isWhiteTurn && !gameEnded}
                  timeRemaining={whiteTime}
                  onTimeUp={() => handleTimeUp('white')}
                  playerColor="white"
                />
              </div>
              
              {/* Chat section */}
              <div className="h-full">
                <ChatBox 
                  socket={socket} 
                  roomID={roomID} 
                  username={username || "Anonymous"} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ChessGame;