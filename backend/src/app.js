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

app.use(cors({ origin: url, methods: ['GET', 'POST'], credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("joinRoomBack", ({roomID, savedRole}) => {
        console.log(`Player ${socket.id} is joining room ${roomID}`);

        // Create room if it doesn't exist
        if (!rooms[roomID]) {
            rooms[roomID] = {
                white: null,
                black: null,
                boardState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                spectators: []
            };
        }
        
        // Check if this socket is reconnecting
        let role = "spectator";
        const room = rooms[roomID];
        
        // If socket was previously white or black in this room, restore that role
        if (savedRole=='w') {
            room.white = socket.id;
            role = "w";
        } else if (savedRole=='b') {
            room.black = socket.id;
            role = "b";
        }
        else {
            // Add as spectator
            room.spectators.push(socket.id);
        }

        // Track which room this socket joined
        socketToRoom[socket.id] = roomID;
        
        socket.join(roomID);
        socket.emit("playerRole", role);
        socket.emit("boardState", room.boardState);
    });

    socket.on("joinRoom", (roomID) => {
        console.log(`Player ${socket.id} is joining room ${roomID}`);

        // Create room if it doesn't exist
        if (!rooms[roomID]) {
            rooms[roomID] = {
                white: null,
                black: null,
                boardState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                spectators: []
            };
        }
        
        // Check if this socket is reconnecting
        let role = "spectator";
        const room = rooms[roomID];
        
        // If socket was previously white or black in this room, restore that role
        if (room.white === socket.id) {
            role = "w";
        } else if (room.black === socket.id) {
            role = "b";
        }
        // If roles are available and socket isn't already assigned
        else if (!room.white) {
            room.white = socket.id;
            role = "w";
        } else if (!room.black) {
            room.black = socket.id;
            role = "b";
        } else {
            // Add as spectator
            room.spectators.push(socket.id);
        }

        // Track which room this socket joined
        socketToRoom[socket.id] = roomID;
        
        socket.join(roomID);
        socket.emit("playerRole", role);
        socket.emit("boardState", room.boardState);
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
            room.boardState="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            console.log(`White player left room ${roomID}`);
        } else if (room.black === socket.id) {
            room.black = null;
            room.boardState="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            console.log(`Black player left room ${roomID}`);
        } else {
            // Remove from spectators
            room.spectators = room.spectators.filter(id => id !== socket.id);
            console.log(`Spectator left room ${roomID}`);
        }
        
        // Leave the socket.io room
        socket.leave(roomID);
        
        // Clean up socketToRoom mapping
        delete socketToRoom[socket.id];
        
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
            } else if (room.black === socket.id) {
                // We're not automatically ending the game on disconnect as requested
                room.black = null;
            } else {
                // Remove from spectators if applicable
                room.spectators = room.spectators.filter(id => id !== socket.id);
            }
            
            // Clean up empty rooms
            if (!room.white && !room.black && room.spectators.length === 0) {
                delete rooms[roomID];
            }
        }
        
        // Clean up socketToRoom mapping
        delete socketToRoom[socket.id];
    });
});

const PORT = process.env.SOCKET_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app };