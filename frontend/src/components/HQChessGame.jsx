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
import PlayOnlineButton from './ui/PlayOnlineButton';
import HiddenQueenSelectionModal from './HiddenQueenSelectionModal';

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
  const [connected, setConnected] = useState(socket.connected);

  const usernameRef = useRef(username);
  useEffect(() => {usernameRef.current = username;}, [username]);

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
      // lastTickTime.current = Date.now(); // Reset the timer reference when clock starts
      clockInterval.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - lastTickTime.current)*1.25 / 1000; // Convert to seconds
        lastTickTime.current = now;

        if (isWhiteTurn&&connected) {
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
        } else if(connected){
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
  }, [gameStarted, gameEnded, isWhiteTurn, whiteTime, blackTime, whiteUsername, blackUsername, hqwsquare, hqbsquare,connected]);

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

    socket.on("generatedRoomId", (roomId) => {
      let roomID=String(roomId)
      console.log(roomID)
      completeJoinRoom(roomID)
    });

    socket.on("showMessage", (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(""), 10000);
    });
    
    socket.on("replyToDrawReq", () => setIsReplyingToDrawReq(true));

    socket.on("connect",    () => {
      setConnected(true)
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
    });
    socket.on("disconnect", () => setConnected(false));

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
      socket.off("generatedRoomId");
      socket.off("connect");
      socket.off("disconnect");
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

  const handlePlayOnline=()=>{
    if (!username) {
      setShowUsernameModal(true);
      return;
    }
    console.log("Play Online pressed")
    socket.emit("playOnline", {variantType:"HQ"});
  }
  
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
      setIsResigning(false)
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
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-6">
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

              
              <div className="flex flex-col md:flex-row gap-6 w-full p-4">
  {/* Play Online Button Component */}
  <div className="w-full md:w-1/2 mb-6 md:mb-0">
    <PlayOnlineButton handlePlayOnline={handlePlayOnline} />
  </div>

  {/* Room Card Component */}
  <div className="w-full md:w-1/2">
    <RoomCard joinRoom={joinRoom} roomIDSuffix={roomIDSuffix} />
  </div>
</div>              
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
                    <p className="text-gray-300 font-semibold mt-5 mb-1">Piece Theme:</p>
                    <div className="p-1"><PieceThemeSelector/></div>
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    Game statistics and additional controls will appear here in future updates.
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-1 flex flex-col space-y-4">
              {(playerRole==="b"||boardOrientation === "black-below") ? (
                <PlayerInfo username={getPlayerName('w')} rating={null} isActive={isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"&& hqwsquare !== null && hqbsquare !== null} timeRemaining={whiteTime} onTimeUp={() => handleTimeUp('white')} playerColor="white" isYou={playerRole === 'w'} formattedTime={formatTime(whiteTime)} />
              ) : (
                <PlayerInfo username={getPlayerName('b')} rating={null} isActive={!isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"&& hqwsquare !== null && hqbsquare !== null} timeRemaining={blackTime} onTimeUp={() => handleTimeUp('black')} playerColor="black" isYou={playerRole === 'b'} formattedTime={formatTime(blackTime)} />
              )}
                
                <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    
                    <div className="flex flex-row space-x-1 sm:space-y-0">
                        {(playerRole === "spectator" || gameEnded || hqbsquare === null || hqwsquare === null) && (
                          <button
                            onClick={handleLeaveRoom}
                            className="sm:w-auto bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 text-center"
                          >
                            Leave Room
                          </button>
                        )}
  
                        {gameEnded && (
                          <button
                            onClick={() => navigate("/dashboard/feedback")}
                            className="sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg shadow-md font-semibold hover:scale-105 transition-transform duration-300 text-center"
                          >
                            Give Feedback
                          </button>
                        )}
  
                        {playerRole === "spectator" && !gameEnded && (
                          <button
                            onClick={toggleBoardOrientation}
                            className="sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg shadow-md font-semibold hover:scale-105 transition-transform duration-300 text-center"
                          >
                            Flip Board
                          </button>
                        )}
                      </div>
  
  {                    (playerRole!="spectator"&&!gameEnded)&&(<div className={`flex items-center mb-2 sm:mb-0 ${connected ? "text-green-500" : "text-red-500"}`}>
    <span className={`w-2 h-2 mr-2 rounded-full animate-pulse ${connected ? "bg-green-500" : "bg-red-500"}`} />
    {connected ? "Connected" : "Disconnected"}
  </div>)}
  
                    </div>

                  <HiddenQueenSelectionModal
  isOpen={hiddenQueenSelectionPhase && (playerRole === 'w' || playerRole === 'b')}
  playerRole={playerRole}
  onSelect={handleHiddenQueenSelection}
/>
                  
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
{isReplyingToDrawReq && !gameEnded && (
  <div className="mb-4 p-3 sm:p-4 bg-gray-700 rounded-lg border border-gray-600 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:justify-between sm:space-x-4">
    <p className="text-white text-center sm:text-left">Your opponent offered a draw</p>
    <div className="flex flex-row space-x-2">
      <button 
        onClick={() => socket.emit("drawGame", { roomID })} 
        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
      >
        Accept
      </button>
      <button 
        onClick={() => {socket.emit("drawDeclined", { roomID, color: playerRole });setIsReplyingToDrawReq(false)}} 
        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
      >
        Decline
      </button>
    </div>
  </div>
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
                    <div className="w-full max-w-full overflow-x-auto flex justify-center items-center">
  <div className="w-full max-w-[90vw] sm:max-w-[400px]">
    <HQChessBoardWithValidation
      socket={socket}
      roomID={roomID}
      playerRole={playerRole}
      boardState={boardState}
      hiddenQueenData={hiddenQueenData}
      gameEnded={gameEnded}
      boardOrientation={boardOrientation}
      isConnected={connected}
    />
  </div>
</div>

                  )}
                </div>
                
                {(playerRole==="b"||boardOrientation === "black-below") ? (
                  <PlayerInfo username={getPlayerName('b')} rating={null} isActive={!isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"&& hqwsquare !== null && hqbsquare !== null} timeRemaining={blackTime} onTimeUp={() => handleTimeUp('black')} playerColor="black" isYou={playerRole === 'b'} formattedTime={formatTime(blackTime)} />
                ) : (
                  <PlayerInfo username={getPlayerName('w')} rating={null} isActive={isWhiteTurn && !gameEnded&&whiteUsername !== "White Player" &&blackUsername !== "Black Player"&& hqwsquare !== null && hqbsquare !== null} timeRemaining={whiteTime} onTimeUp={() => handleTimeUp('white')} playerColor="white" isYou={playerRole === 'w'} formattedTime={formatTime(whiteTime)} />
                )}
                                {playerRole !== "spectator" && !gameEnded && !isResigning && hqbsquare !== null && hqwsquare !== null && (
                  <div className="flex flex-row gap-2 justify-end w-full">
                    <button 
                      onClick={confirmResign}
                      className="bg-red-700 hover:bg-red-600 active:bg-red-800 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 text-sm sm:text-base">
                      Resign
                    </button>
                    
                    <button
                      onClick={() => socket.emit("drawReq", { roomID, color: playerRole })}
                      className="bg-orange-700 hover:bg-orange-600 active:bg-orange-800 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 text-sm sm:text-base">
                      Draw Request
                    </button>
                  </div>
                )}
                <div style={{ border: '1px solid #444', borderRadius: '10px', padding: '12px 16px', backgroundColor: '#1e1e1e', maxWidth: '100%', fontSize: '16px', lineHeight: '1.5', color: '#f1f1f1', boxShadow: '0 2px 6px rgba(0,0,0,0.5)', margin: '10px auto', wordWrap: 'break-word' }}>
  <p style={{ margin: '0 0 8px 0', color: '#ab47bc', fontWeight: 'bold' }}>👑 Hidden Queen Chess Rules:</p>
  <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
    <li>Each player secretly picks one pawn to be their <strong>Hidden Queen</strong>.</li>
    <li>It appears as a normal pawn to the opponent until you make a queen-like move.</li>
    <li>Capture the king to win</li>
    <li>No En Passant, No checkmate</li>
  </ul>
</div>

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