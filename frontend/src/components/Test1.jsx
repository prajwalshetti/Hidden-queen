
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080"); // Update with your server URL

function Test1() {
    const [role, setRole] = useState(null);
    const [roomID, setRoomID] = useState(null);
    const [boardState, setBoardState] = useState("initial-fen-string-here");

    useEffect(() => {
        // Check if roomID and role are stored in localStorage
        const storedRoomID = localStorage.getItem("roomID");
        const storedRole = localStorage.getItem("role");

        if (storedRoomID && storedRole) {
            setRoomID(storedRoomID);
            setRole(storedRole);
            socket.emit("joinRoom", storedRoomID); // Rejoin the game on page load
        } else {
            const newRoomID = `room-${Math.floor(Math.random() * 1000)}`;
            setRoomID(newRoomID);
            socket.emit("joinRoom", newRoomID); // Join a new room
        }

        // Listen for player role and board state from the server
        socket.on("playerRole", (playerRole) => {
            setRole(playerRole);
            localStorage.setItem("role", playerRole); // Store role in localStorage
        });

        socket.on("boardState", (fen) => {
            setBoardState(fen);
        });

        socket.on("move", (move) => {
            console.log("Move received:", move);
        });

        socket.on("spectatorRole", () => {
            setRole("spectator");
        });

        return () => {
            socket.off("playerRole");
            socket.off("boardState");
            socket.off("move");
            socket.off("spectatorRole");
        };
    }, []);

    const handleMove = () => {
        const move = { from: "e2", to: "e4" }; // Example move, modify as needed
        socket.emit("move", move, roomID); // Emit move event
    };

    const handleResign = () => {
        socket.emit("disconnect"); // Resign (disconnect from the game)
        localStorage.removeItem("roomID");
        localStorage.removeItem("role");
    };

    return (
        <div>
            <h1>Test 1: Hidden Queen Chess</h1>
            <p>Role: {role}</p>
            <p>Room ID: {roomID}</p>
            <button onClick={handleMove}>Make Move</button>
            <button onClick={handleResign}>Resign</button>
            <div>
                <h2>Board State: {boardState}</h2>
                {/* Render the chessboard here */}
            </div>
        </div>
    );
}

export default Test1;
