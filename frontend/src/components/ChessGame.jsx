import React, { useState, useEffect } from 'react';
import ChessBoardWithValidation from './ChessBoardWithValidation';
import { io } from "socket.io-client";
import MainRules from './MainRules';

const socket = io("http://localhost:8080");

function ChessGame() {
  const [roomID, setRoomID] = useState("");
  const [playerRole, setPlayerRole] = useState("");
  const [boardState, setBoardState] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"); // Correct FEN
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("playerRole", (role) => setPlayerRole(role));
    socket.on("boardState", (state) => setBoardState(state));
    socket.on("move", (move) => setBoardState(move));
    socket.on("gameOver", (msg) => setMessage(msg));
  }, []);

  const joinRoom = () => {
    if (!roomID.trim()) return alert("Enter a valid room ID");
    socket.emit("joinRoom", roomID);
    setGameStarted(true);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg mx-auto">
      {!gameStarted ? (
        <div>
          <h1 className="text-2xl font-bold">Enter Room</h1>
          <input
            type="text"
            placeholder="Room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            className="border p-2"
          />
          <button onClick={joinRoom} className="bg-blue-500 text-white p-2 ml-2">
            Join
          </button>
          <MainRules/>
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-bold">Your role: {playerRole}</h1>
          {message && <p className="text-red-500">{message}</p>}
          <ChessBoardWithValidation socket={socket} roomID={roomID} playerRole={playerRole} boardState={boardState} />
        </div>
      )}
    </div>
  );
}

export default ChessGame;
