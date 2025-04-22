import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from "socket.io-client";
import HiddenQueenRules from './HiddenQueenRules';
import RoomCard from './Room';
import { useNavigate } from 'react-router-dom';
import ChatBox from './chat';
import PlayerInfo from './username';
import HQChessBoardWithValidation from './HQChessBoardWithValidation';
import LoadingBoxes from './ui/LoadingBoxes';
import { useValidateChessMode } from '../utils/useValidateChessMode'; // adjust path if needed
import PieceThemeSelector from './ui/PieceThemeSelector';

const socket = io(import.meta.env.VITE_SOCKET_BASE_URL);

function HQChessGame() {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState("");
  const [boardString, setBoardString] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [playerRole, setPlayerRole] = useState("");
  const [boardState, setBoardState] = useState(boardString);
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
  const [hiddenQueenSelectionPhase, setHiddenQueenSelectionPhase] = useState(false);
  const [hqwsquare, setHqwsquare] = useState(null);
  const [hqbsquare, setHqbsquare] = useState(null);
  const [hqwstatus, setHqwstatus] = useState(0);
  const [hqbstatus, setHqbstatus] = useState(0);
  const [roomIDSuffix,setRoomIDSuffix]=useState("_HQ")
  const [boardOrientation,setBoardOrientation]=useState("white-below")
  const hiddenQueenData = {hqwsquare,hqbsquare,hqwstatus,hqbstatus,setHqwsquare,setHqbsquare,setHqwstatus,setHqbstatus};
  const [isReplyingToDrawReq,setIsReplyingToDrawReq]=useState(false)

  // Clock references and state
  const clockInterval = useRef(null);
  const lastTickTime = useRef(Date.now());
  const [lastMoveTime, setLastMoveTime] = useState(null);

    const validateMode = useValidateChessMode();

  // Effect for handling the game clock
  useEffect(() => {
    // Clean up any existing interval
    if (clockInterval.current) {
      clearInterval(clockInterval.current);
      clockInterval.current = null;
    }

    // Only start the clock if the game has started and not ended
    if (gameStarted && !gameEnded && whiteUsername !== "White Player" && blackUsername !== "Black Player" && hqwsquare !== null && hqbsquare !== null) {
      lastTickTime.current = Date.now(); // Reset the timer reference when clock starts
      clockInterval.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - lastTickTime.current)*1.25 / 1000; // Convert to seconds
        lastTickTime.current = now;

        if (isWhiteTurn) {
          setWhiteTime(prevTime => {
            const newTime = Math.max(0, prevTime - elapsed);
            // Emit time update to keep server in sync
            socket.emit("updateTime", {
              roomID,
              whiteTime: newTime,
              blackTime,
              lastMoveTime: now
            });
            
            if (newTime <= 0 && !gameEnded) {
              handleTimeUp('white');
            }
            
            return newTime;
          });
        } else {
          setBlackTime(prevTime => {
            const newTime = Math.max(0, prevTime - elapsed);
            // Emit time update to keep server in sync
            socket.emit("updateTime", {
              roomID,
              whiteTime,
              blackTime: newTime,
              lastMoveTime: now
            });
            
            if (newTime <= 0 && !gameEnded) {
              handleTimeUp('black');
            }
            
            return newTime;
          });
        }
      }, 100); // Update every 100ms for smoother countdown
    }

    return () => {
      if (clockInterval.current) {
        clearInterval(clockInterval.current);
      }
    };
  }, [gameStarted, gameEnded, isWhiteTurn, whiteTime, blackTime, whiteUsername, blackUsername, hqwsquare, hqbsquare]);

  useEffect(() => {
    const savedRoomID = localStorage.getItem('roomID');
    const savedRole = localStorage.getItem('playerRole');
    const savedUsername = localStorage.getItem('username');
    
    if (savedUsername) setUsername(savedUsername);
    
    if (savedRoomID && savedRole) {
      const isValidMode = validateMode(); 
      if (isValidMode) {
        setRoomID(savedRoomID);
        setPlayerRole(savedRole);
        setGameStarted(true);
        
        socket.emit("joinRoomBack", {
          roomID: savedRoomID, 
          savedRole, 
          username: savedUsername || "Player"
        });

        socket.emit("requestTimeSync", { roomID: savedRoomID });
      }
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
      // Reset last tick time on move to prevent time skips
      lastTickTime.current = Date.now();
    });
    
    socket.on("gameOver", (msg) => {
      setMessage(msg);
      setGameEnded(true);
      localStorage.removeItem('roomID');
      localStorage.removeItem('playerRole');
    });
    
    socket.on("playersInfo", (info) => {
      if (info.whiteUsername) setWhiteUsername(info.whiteUsername);
      if (info.blackUsername) setBlackUsername(info.blackUsername);
    });

    socket.on("playersHQ",(info)=>{
      if(info.hqwsquare) setHqwsquare(info.hqwsquare);
      if(info.hqbsquare) setHqbsquare(info.hqbsquare);
      if(info.hqwstatus !== undefined) setHqwstatus(info.hqwstatus);
      if(info.hqbstatus !== undefined) setHqbstatus(info.hqbstatus);
    });
    
    // New listeners for time synchronization
    socket.on("timeSync", (timeData) => {
      setWhiteTime(timeData.whiteTime);
      setBlackTime(timeData.blackTime);
      setLastMoveTime(timeData.lastMoveTime);
      setIsWhiteTurn(timeData.currentTurn === "w");
      
      // Reset the tick timer to prevent jumps
      lastTickTime.current = Date.now();
    });
    
    socket.on("timeUpdate", (timeData) => {
      setWhiteTime(timeData.whiteTime);
      setBlackTime(timeData.blackTime);
      setLastMoveTime(timeData.lastMoveTime);
      
      // Reset the tick timer to prevent jumps
      lastTickTime.current = Date.now();
    });

    socket.on("showMessage", (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(""), 10000);
    });
    
    socket.on("replyToDrawReq", () => setIsReplyingToDrawReq(true));

    return () => {
      socket.off("playerRole");
      socket.off("boardState");
      socket.off("move");
      socket.off("gameOver");
      socket.off("playersInfo");
      socket.off("playersHQ");
      socket.off("timeSync");
      socket.off("timeUpdate");
      socket.off("showMessage");
      socket.off("replyToDrawReq");
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
    setHiddenQueenSelectionPhase(true);
    setRoomID(roomID);
    socket.emit("joinRoom", { roomID, username });
    setGameStarted(true);
    localStorage.setItem('roomID', roomID);
    
    // Request time sync when joining a room
    socket.emit("requestTimeSync", { roomID });
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
    setBoardState(boardString);
    setMessage("");
    setGameEnded(false);
    
    // Reset clock
    setWhiteTime(600);
    setBlackTime(600);
    
    // Reset hidden queen data
    setHqwsquare(null);
    setHqbsquare(null);
    setHqwstatus(0);
    setHqbstatus(0);
    
    navigate('/dashboard');
  };
  
  const handleTimeUp = (color) => {
    if (!gameEnded) {
      const winner = color === 'white' ? 'Black' : 'White';
      setMessage(`Time's up! ${winner} wins by timeout.`);
      setGameEnded(true);
      socket.emit("timeOut", { roomID, color: color === 'white' ? 'w' : 'b' });
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

  const toggleBoardOrientation = () => {
    setBoardOrientation((prev) =>
      prev === "white-below" ? "black-below" : "white-below"
    );
  };  

  // Handle hidden queen selection
  const handleHiddenQueenSelection = (col) => {
    console.log("The pawn is selected on the column", col);
    let file = String.fromCharCode(96 + col); // converts 1->a, 2->b, etc.
    // For white, hidden queen pawn is on rank 2; for black, rank 7.
    let rank = playerRole === 'w' ? "2" : "7";
    const selectedSquare = file + rank;
        
    // Emit the event to the backend
    socket.emit("changeToQueen", { roomID, index: col, isWhite: playerRole === 'w' });
    
    setHiddenQueenSelectionPhase(false);
  };

  // Format time for display (convert seconds to mm:ss format)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const chatInfo = getChatInfo();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-center mb-6">
          <motion.h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ y: -20 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300 }}>
            Hidden Queen Chess
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

              
              <RoomCard joinRoom={joinRoom} roomIDSuffix={roomIDSuffix} />
              
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
                  <p>Room ID: {roomID.replace(/_(HQ|PP|FB|PHANTOM)$/, '')}</p>
                  <p>Your role: {playerRole === 'w' ? 'White' : playerRole === 'b' ? 'Black' : 'Spectator'}</p>
                  <p className="mt-4 text-gray-300 font-semibold">Players:</p>
                  <p>White: {whiteUsername || "Waiting for player..."}</p>
                  <p>Black: {blackUsername || "Waiting for player..."}</p>
                  
                  <div className="mt-4 text-gray-300 font-semibold">Time Control:</div>
                  <div className="flex justify-between mt-2">
                    <div className="text-white font-mono">White: {formatTime(whiteTime)}</div>
                    <div className="text-white font-mono">Black: {formatTime(blackTime)}</div>
                  </div>
                  
                  {(playerRole === 'w' || playerRole === 'b') && (
                    <div className="mt-4">
                      <p className="text-gray-300 font-semibold">Hidden Queen:</p>
                      {playerRole === 'w' && (
                        <p>Your hidden queen: {hqwsquare || "Not selected"} 
                        
                        </p>
                      )}
                      {playerRole === 'b' && (
                        <p>Your hidden queen: {hqbsquare || "Not selected"}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <p className="mt-4 text-gray-300 font-semibold mt-5 mb-1">Piece Theme:</p>
                    <div className="p-1"><PieceThemeSelector/></div>
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    Game statistics and additional controls will appear here in future updates.
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-1 flex flex-col space-y-4">
              {(playerRole==="b"||boardOrientation === "black-below") ? (
                <PlayerInfo username={getPlayerName('w')} rating={null} isActive={isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"} timeRemaining={whiteTime} onTimeUp={() => handleTimeUp('white')} playerColor="white" isYou={playerRole === 'w'} formattedTime={formatTime(whiteTime)} />
              ) : (
                <PlayerInfo username={getPlayerName('b')} rating={null} isActive={!isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"} timeRemaining={blackTime} onTimeUp={() => handleTimeUp('black')} playerColor="black" isYou={playerRole === 'b'} formattedTime={formatTime(blackTime)} />
              )}
                
                <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-gray-700 px-4 py-2 rounded-lg">
                      <span className="text-gray-400">Role:</span> 
                      <span className="ml-2 font-bold text-purple-400">
                        {playerRole === 'w' ? 'White' : playerRole === 'b' ? 'Black' : 'Spectator'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-3">
                      {playerRole !== "spectator" && !gameEnded && !isResigning && hqbsquare !== null && hqwsquare !== null && (
                        <button onClick={confirmResign}
                          className="bg-red-700 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-lg transition-all duration-300">
                          Resign
                        </button>
                      )}

                      {playerRole !== "spectator" && !gameEnded && !isResigning && hqbsquare !== null && hqwsquare !== null && (
                        <button
                        onClick={()=>socket.emit("drawReq", { roomID, color: playerRole })}
                        className="bg-orange-700 hover:bg-orange-600 text-white py-1 px-3 rounded-lg shadow-lg transition-all duration-300">
                          Draw Req
                          </button>
                      )}

                      {(playerRole === "spectator" || gameEnded || hqbsquare === null || hqwsquare === null) && (
                        <button onClick={handleLeaveRoom}
                          className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300">
                          Leave Room
                        </button>
                      )}

                      {(gameEnded) && (
                      <button onClick={()=>navigate("/dashboard/feedback")} className="px-1 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300">Give feedback</button>
                      )}

                    {playerRole === "spectator" && (
                      <button
                        onClick={toggleBoardOrientation}
                        className="px-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
                      >
                        Flip Board
                      </button>
                    )}
                    </div>
                  </div>

                  {hiddenQueenSelectionPhase && (playerRole === 'w' || playerRole === 'b') && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-purple-700 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-center mb-4 text-purple-400">
                          Select Your Hidden Queen
                        </h2>
                        <p className="text-gray-300 mb-4">
                          Choose which pawn will secretly be your hidden queen. It will look like a pawn but can move like a queen.
                          It will be revealed to your opponent when you make a non-pawn move with it.
                        </p>
                        <div className="grid grid-cols-8 gap-2 mb-4">
                          {(playerRole === "b" ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]).map((col) => (
                            <button
                              key={col}
                              onClick={() => handleHiddenQueenSelection(col)}
                              className="bg-gray-700 hover:bg-purple-700 text-white py-4 rounded transition-colors"
                            >
                              {String.fromCharCode(96 + col)}
                            </button>
                          ))}
                        </div>

                        <p className="text-sm text-gray-400">
                          {playerRole === 'w' 
                            ? "Your pawns are on the 2nd rank (a2-h2)" 
                            : "Your pawns are on the 7th rank (a7-h7)"}
                        </p>
                      </div>
                    </div>
                  )}
                  
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
              {isReplyingToDrawReq && !gameEnded &&(
                <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-between space-x-4">
                <p className="text-white">Your opponent offered a draw</p>
                <div className="flex space-x-2">
                  <button onClick={() => socket.emit("drawGame", { roomID })} className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg">Accept</button>
                  <button onClick={() => {socket.emit("drawDeclined", { roomID, color: playerRole });setIsReplyingToDrawReq(false)}} className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg">Decline</button>
                </div></div>
              )}
                  
                  {message && (
                      <div className={`mb-4 p-3 rounded-lg border ${gameEnded ? 'bg-purple-900/50 text-purple-200 border-purple-700' : 'bg-yellow-900/50 text-yellow-200 border-yellow-700'}`}>
                      {message}
                    </div>
                  )}
                  
                  {(hqwsquare === null || hqbsquare === null) ? (
                    <div className="flex flex-col justify-center items-center min-h-[70vh] bg-black text-white space-y-4">
                      <LoadingBoxes />
                    </div>
                  ) : (
                    <div>
                      <HQChessBoardWithValidation
                        socket={socket}
                        roomID={roomID}
                        playerRole={playerRole}
                        boardState={boardState}
                        hiddenQueenData={hiddenQueenData}
                        gameEnded={gameEnded}
                        boardOrientation={boardOrientation}
                      />
                    </div>
                  )}
                </div>
                
                {(playerRole==="b"||boardOrientation === "black-below") ? (
                  <PlayerInfo username={getPlayerName('b')} rating={null} isActive={!isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"} timeRemaining={blackTime} onTimeUp={() => handleTimeUp('black')} playerColor="black" isYou={playerRole === 'b'} formattedTime={formatTime(blackTime)} />
                ) : (
                  <PlayerInfo username={getPlayerName('w')} rating={null} isActive={isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"} timeRemaining={whiteTime} onTimeUp={() => handleTimeUp('white')} playerColor="white" isYou={playerRole === 'w'} formattedTime={formatTime(whiteTime)} />
                )}
              </div>
              
              <div className="h-full">
                <ChatBox socket={socket} roomID={roomID} username={username || "Anonymous"} playerRole={playerRole}
                  chatTitle={chatInfo.title} chatDescription={chatInfo.description}/>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default HQChessGame;