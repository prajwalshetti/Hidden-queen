//06-04-2025
//prajwal
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChessBoardWithValidation from './ChessBoardWithValidation';
import { io } from "socket.io-client";
import HiddenQueenRules from './HiddenQueenRules';
import RoomCard from './Room';
import { useNavigate } from 'react-router-dom';
import ChatBox from './chat';
import PlayerInfo from './username';
import LoadingBoxes from './ui/LoadingBoxes';

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
  const [username, setUsername] = useState("");
  const [whiteUsername, setWhiteUsername] = useState("White Player");
  const [blackUsername, setBlackUsername] = useState("Black Player");
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes
  const [blackTime, setBlackTime] = useState(600); // 10 minutes
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isDrawRequested, setIsDrawRequested] = useState(false);

  useEffect(() => {
    const savedRoomID = localStorage.getItem('roomID');
    const savedRole = localStorage.getItem('playerRole');
    const savedUsername = localStorage.getItem('username');
    
    if (savedUsername) setUsername(savedUsername);
    
    if (savedRoomID && savedRole) {
      setRoomID(savedRoomID);
      setPlayerRole(savedRole);
      setGameStarted(true);
      socket.emit("joinRoomBack", {
        roomID: savedRoomID, 
        savedRole, 
        username: savedUsername || "Player"
      });
    }
    
    socket.on("playerRole", (role) => {
      setPlayerRole(role);
      localStorage.setItem('playerRole', role);
    });
    
    socket.on("boardState", (state) => {
      setBoardState(state);
      setIsWhiteTurn(state.split(" ")[1] === "w");
    });
    
    socket.on("move", (move) => {
      setBoardState(move);
      setIsWhiteTurn(move.split(" ")[1] === "w");
    });
    
    socket.on("gameOver", (msg) => {
      setMessage(msg);
      setGameEnded(true);
    });

    socket.on("opponentResigned", (msg) => {
      setMessage(msg);
      setGameEnded(true);
    });
    
    socket.on("playersInfo", (info) => {
      if (info.whiteUsername) setWhiteUsername(info.whiteUsername);
      if (info.blackUsername) setBlackUsername(info.blackUsername);
    });

    return () => {
      socket.off("playerRole");
      socket.off("boardState");
      socket.off("move");
      socket.off("gameOver");
      socket.off("opponentResigned");
      socket.off("playersInfo");
    };
  }, []);

  useEffect(() => {
    if (roomID && playerRole && username) {
      socket.emit("updateUsername", { roomID, role: playerRole, username });
    }
  }, [username, roomID, playerRole]);

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
    socket.emit("joinRoom", { roomID, username });
    setGameStarted(true);
    localStorage.setItem('roomID', roomID);
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

  const confirmResign = () => setIsResigning(true);
  const cancelResign = () => setIsResigning(false);

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", { roomID });
    localStorage.removeItem('roomID');
    localStorage.removeItem('playerRole');
    setGameStarted(false);
    setRoomID("");
    setPlayerRole("");
    setBoardState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setMessage("");
    setGameEnded(false);
    navigate('/dashboard');
  };

  
  const handleDrawRequest=()=>{
    const eventName = isDrawRequested ? "drawReqBack" : "drawReq";
    socket.emit(eventName, { roomID, color: playerRole });

    setIsDrawRequested(!isDrawRequested);
  }
  
  const handleTimeUp = (color) => {
    if (!gameEnded) {
      const winner = color === 'white' ? 'Black' : 'White';
      setMessage(`Time's up! ${winner} wins by timeout.`);
      setGameEnded(true);
      socket.emit("timeUp", { roomID, loser: color === 'white' ? 'w' : 'b' });
    }
  };

  const getPlayerName = (role) => {
    if (role === 'w') return whiteUsername || "White Player";
    else if (role === 'b') return blackUsername || "Black Player";
    return "Player";
  };

  const getChatInfo = () => {
    if (playerRole === 'w' || playerRole === 'b') {
      const opponent = playerRole === 'w' ? blackUsername || "Black Player" : whiteUsername || "White Player";
      return { title: "Player Chat", description: `Chat with ${opponent}` };
    } else {
      return { title: "Spectator Chat", description: "Chat with other spectators" };
    }
  };

  const chatInfo = getChatInfo();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-center mb-6">
          <motion.h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ y: -20 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300 }}>
            Phantom Chess
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">
          {showUsernameModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-purple-700 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-4 text-purple-400">Enter Your Username</h2>
                <form onSubmit={handleUsernameSubmit}>
                  <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                    placeholder="Username" autoFocus />
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setShowUsernameModal(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
                      Cancel
                    </button>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {!gameStarted ? (
            <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-purple-400">Set Your Username</h2>
                <div className="flex items-center space-x-3">
                  <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={username || "Enter username"} />
                  <button onClick={() => {
                      if (usernameInput.trim()) {
                        setUsername(usernameInput);
                        localStorage.setItem('username', usernameInput);
                        setUsernameInput("");
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
                    Set
                  </button>
                </div>
                {username && (
                  <p className="mt-2 text-green-400">
                    Current username: <span className="font-bold">{username}</span>
                  </p>
                )}
              </div>
              
              <RoomCard joinRoom={joinRoom} />
              
              <div className="mt-4">
                <button onClick={() => setShowRules(!showRules)} 
                  className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-700 shadow-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-purple-900/30 hover:shadow-lg">
                  <span className="text-purple-400">{showRules ? "♟" : "♛"}</span>
                  <span>{showRules ? "Hide Rules" : "Show Hidden Queen Rules"}</span>
                </button>
                
                {showRules && (
                  <div style={{ transition: "all 0.3s ease", opacity: 1, height: "auto" }}>
                    <HiddenQueenRules onClose={() => setShowRules(false)} />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div key="gameStarted" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 hidden md:block">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Game Dashboard</h3>
                <div className="text-gray-400 text-sm">
                  <p>Room ID: {roomID}</p>
                  <p>Your role: {playerRole === 'w' ? 'White' : playerRole === 'b' ? 'Black' : 'Spectator'}</p>
                  <p className="mt-4 text-gray-300 font-semibold">Players:</p>
                  <p>White: {whiteUsername || "Waiting for player..."}</p>
                  <p>Black: {blackUsername || "Waiting for player..."}</p>
                  <p className="mt-4 text-xs text-gray-500">
                    Game statistics and additional controls will appear here in future updates.
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-1 flex flex-col space-y-4">
                <PlayerInfo username={getPlayerName('b')} rating={null} isActive={!isWhiteTurn && !gameEnded}
                  timeRemaining={blackTime} onTimeUp={() => handleTimeUp('black')} playerColor="black" isYou={playerRole === 'b'} />
                
                <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-gray-700 px-4 py-2 rounded-lg">
                      <span className="text-gray-400">Role:</span> 
                      <span className="ml-2 font-bold text-purple-400">
                        {playerRole === 'w' ? 'White' : playerRole === 'b' ? 'Black' : 'Spectator'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-3">
                      {playerRole !== "spectator" && !gameEnded && !isResigning && blackUsername!=="Black Player"&&(
                        <button onClick={confirmResign}
                          className="bg-red-700 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-lg transition-all duration-300">
                          Resign
                        </button>
                      )}

                      {playerRole !== "spectator" && !gameEnded && !isResigning && blackUsername !== "Black Player" && (
                        <button
                          onClick={handleDrawRequest}
                          className="bg-orange-700 hover:bg-orange-600 text-white py-1 px-3 rounded-lg shadow-lg transition-all duration-300">
                          {isDrawRequested ? "Cancel Draw Req" : "Draw Req"}
                        </button>
                      )}

                      {(playerRole === "spectator" || gameEnded || blackUsername==="Black Player") && (
                        <button onClick={handleLeaveRoom}
                          className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300">
                          Leave Room
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {isResigning && (
                    <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <p className="mb-3 text-center">Are you sure you want to resign?</p>
                      <div className="flex justify-center space-x-4">
                        <button onClick={handleResign} className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
                          Yes, Resign
                        </button>
                        <button onClick={cancelResign} className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {message && (
                    <div className={`mb-4 p-3 rounded-lg border ${gameEnded ? 'bg-purple-900/50 text-purple-200 border-purple-700' : 'bg-red-900/50 text-red-200 border-red-700'}`}>
                      {message}
                    </div>
                  )}
                  
                  {
  blackUsername === "Black Player" ? (
<div className="flex justify-center items-center min-h-[70vh] bg-black">
  <LoadingBoxes />
</div>
  ) : (
    <div>
      <ChessBoardWithValidation 
        socket={socket} 
        roomID={roomID} 
        playerRole={playerRole} 
        boardState={boardState} 
        gameEnded={gameEnded} 
      />
    </div>
  )
}

                </div>
                
                <PlayerInfo username={getPlayerName('w')} rating={null} isActive={isWhiteTurn && !gameEnded}
                  timeRemaining={whiteTime} onTimeUp={() => handleTimeUp('white')} playerColor="white" isYou={playerRole === 'w'} />
              </div>
              
              <div className="h-full">
                <ChatBox socket={socket} roomID={roomID} username={username || "Anonymous"} playerRole={playerRole}
                  chatTitle={chatInfo.title} chatDescription={chatInfo.description} />
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ChessGame;