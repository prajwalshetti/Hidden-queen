import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const url = process.env.FRONT_END_URL;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }
});

let rooms = {};
let socketToRoom = {}; // Track which room each socket is in
let socketRoles = {}; // Track each socket's role

app.use(cors({ origin: url, methods: ['GET', 'POST'], credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("joinRoomBack", ({roomID, savedRole, username}) => {
        console.log(`Player ${socket.id} (${username}) is rejoining room ${roomID}`);

        // Create room if it doesn't exist
        if (!rooms[roomID]) {
            rooms[roomID] = {
                white: null,
                black: null,
                whiteUsername: null,
                blackUsername: null,
                boardState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                spectators: [],
                playerMessages: [], // Messages between white and black players
                spectatorMessages: [] // Messages among spectators
            };
        }
        
        // Check if this socket is reconnecting
        let role = "spectator";
        const room = rooms[roomID];
        
        // If socket was previously white or black in this room, restore that role
        if (savedRole=='w') {
            room.white = socket.id;
            room.whiteUsername = username || "Player";
            role = "w";
        } else if (savedRole=='b') {
            room.black = socket.id;
            room.blackUsername = username || "Player";
            role = "b";
        }
        else {
            // Add as spectator
            room.spectators.push(socket.id);
        }

        // Track which room this socket joined and its role
        socketToRoom[socket.id] = roomID;
        socketRoles[socket.id] = role;
        
        socket.join(roomID);
        socket.emit("playerRole", role);
        socket.emit("boardState", room.boardState);
        
        // Send chat history based on role
        if (role === 'w' || role === 'b') {
            socket.emit("chatHistory", room.playerMessages);
        } else {
            socket.emit("chatHistory", room.spectatorMessages);
        }
        
        // Broadcast player info to all clients in the room, including usernames
        io.to(roomID).emit("playersInfo", {
            whiteUsername: room.whiteUsername,
            blackUsername: room.blackUsername
        });
    });

    socket.on("joinRoom", ({roomID, username}) => {
        console.log(`Player ${socket.id} (${username}) is joining room ${roomID}`);

        // Create room if it doesn't exist
        if (!rooms[roomID]) {
            rooms[roomID] = {
                white: null,
                black: null,
                whiteUsername: null,
                blackUsername: null,
                boardState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                spectators: [],
                playerMessages: [], // Messages between white and black players
                spectatorMessages: [] // Messages among spectators
            };
        }
        
        // Check if this socket is reconnecting
        let role = "spectator";
        const room = rooms[roomID];
        
        // If socket was previously white or black in this room, restore that role
        if (room.white === socket.id) {
            role = "w";
            room.whiteUsername = username || "Player";
        } else if (room.black === socket.id) {
            role = "b";
            room.blackUsername = username || "Player";
        }
        // If roles are available and socket isn't already assigned
        else if (!room.white) {
            room.white = socket.id;
            room.whiteUsername = username || "Player";
            role = "w";
        } else if (!room.black) {
            room.black = socket.id;
            room.blackUsername = username || "Player";
            role = "b";
        } else {
            // Add as spectator
            room.spectators.push(socket.id);
        }

        // Track which room this socket joined and its role
        socketToRoom[socket.id] = roomID;
        socketRoles[socket.id] = role;
        
        socket.join(roomID);
        socket.emit("playerRole", role);
        socket.emit("boardState", room.boardState);
        
        // Send chat history based on role
        if (role === 'w' || role === 'b') {
            socket.emit("chatHistory", room.playerMessages);
        } else {
            socket.emit("chatHistory", room.spectatorMessages);
        }
        
        // Broadcast player info to all clients in the room, including usernames
        io.to(roomID).emit("playersInfo", {
            whiteUsername: room.whiteUsername,
            blackUsername: room.blackUsername
        });
    });

    // Handle chat messages
    socket.on("sendMessage", (message) => {
        const roomID = message.roomID;
        const room = rooms[roomID];
        
        if (!room) return;
        
        const senderRole = socketRoles[socket.id];
        
        // Handle player messages (between white and black only)
        if (senderRole === 'w' || senderRole === 'b') {
            // Store message in room's player messages
            room.playerMessages.push(message);
            
            // Send message to white and black players only
            if (room.white) {
                io.to(room.white).emit("chatMessage", message);
            }
            if (room.black) {
                io.to(room.black).emit("chatMessage", message);
            }
        } 
        // Handle spectator messages (among spectators only)
        else if (senderRole === 'spectator') {
            // Store message in room's spectator messages
            room.spectatorMessages.push(message);
            
            // Send message to all spectators
            room.spectators.forEach(spectatorId => {
                io.to(spectatorId).emit("chatMessage", message);
            });
        }
    });

    // Handle username updates
    socket.on("updateUsername", ({ roomID, role, username }) => {
        if (!rooms[roomID]) return;
        
        const room = rooms[roomID];
        
        if (role === 'w') {
            room.whiteUsername = username || "Player";
        } else if (role === 'b') {
            room.blackUsername = username || "Player";
        }
        
        // Broadcast updated player info
        io.to(roomID).emit("playersInfo", {
            whiteUsername: room.whiteUsername,
            blackUsername: room.blackUsername
        });
    });

    socket.on("move", ({ move, roomID }) => {
        if (!rooms[roomID]) return;

        const { white, black } = rooms[roomID];
        const playerRole = socket.id === white ? "w" : socket.id === black ? "b" : "spectator";

        if (playerRole === "spectator") return;

        rooms[roomID].boardState = move;
        io.to(roomID).emit("move", move);
    });

    socket.on("resign", ({ roomID }) => {
        if (!rooms[roomID]) return;

        const { white, black } = rooms[roomID];
        if (socket.id === white) {
            // Send message to the player who resigned
            socket.emit("gameOver", "You resigned. Black wins.");
            
            // Send message to the opponent about the resignation
            if (black) {
                io.to(black).emit("opponentResigned", "White resigned. You win!");
            }
            
            // Inform spectators
            rooms[roomID].spectators.forEach(spectatorId => {
                io.to(spectatorId).emit("gameOver", "White resigned. Black wins.");
            });
        } else if (socket.id === black) {
            // Send message to the player who resigned
            socket.emit("gameOver", "You resigned. White wins.");
            
            // Send message to the opponent about the resignation
            if (white) {
                io.to(white).emit("opponentResigned", "Black resigned. You win!");
            }
            
            // Inform spectators
            rooms[roomID].spectators.forEach(spectatorId => {
                io.to(spectatorId).emit("gameOver", "Black resigned. White wins.");
            });
        }
    });

    socket.on("leaveRoom", ({ roomID }) => {
        if (!rooms[roomID]) return;
        
        const room = rooms[roomID];
        
        // Remove the player from the appropriate role
        if (room.white === socket.id) {
            room.white = null;
            room.whiteUsername = null;
            room.boardState="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            console.log(`White player left room ${roomID}`);
            
            // Broadcast updated player info
            io.to(roomID).emit("playersInfo", {
                whiteUsername: null,
                blackUsername: room.blackUsername
            });
        } else if (room.black === socket.id) {
            room.black = null;
            room.blackUsername = null;
            room.boardState="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            console.log(`Black player left room ${roomID}`);
            
            // Broadcast updated player info
            io.to(roomID).emit("playersInfo", {
                whiteUsername: room.whiteUsername,
                blackUsername: null
            });
        } else {
            // Remove from spectators
            room.spectators = room.spectators.filter(id => id !== socket.id);
            console.log(`Spectator left room ${roomID}`);
        }
        
        // Clear chat if both players have left
        if (!room.white && !room.black) {
            room.playerMessages = [];
        }
        
        // If no spectators left, clear spectator messages
        if (room.spectators.length === 0) {
            room.spectatorMessages = [];
        }
        
        // Leave the socket.io room
        socket.leave(roomID);
        
        // Clean up socket mappings
        delete socketToRoom[socket.id];
        delete socketRoles[socket.id];
        
        // Clean up empty rooms
        if (!room.white && !room.black && room.spectators.length === 0) {
            delete rooms[roomID];
            console.log(`Room ${roomID} deleted (empty)`);
        }
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        
        // Get the room this socket was in
        const roomID = socketToRoom[socket.id];
        if (roomID && rooms[roomID]) {
            const room = rooms[roomID];
            
            if (room.white === socket.id) {
                // We're not automatically ending the game on disconnect as requested
                room.white = null;
                // Don't reset the username on disconnect to allow reconnection
            } else if (room.black === socket.id) {
                // We're not automatically ending the game on disconnect as requested
                room.black = null;
                // Don't reset the username on disconnect to allow reconnection
            } else {
                // Remove from spectators if applicable
                room.spectators = room.spectators.filter(id => id !== socket.id);
            }
            
            // Clean up empty rooms
            if (!room.white && !room.black && room.spectators.length === 0) {
                delete rooms[roomID];
            }
        }
        
        // Clean up socket mappings
        delete socketToRoom[socket.id];
        delete socketRoles[socket.id];
    });
});

const PORT = process.env.SOCKET_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app };