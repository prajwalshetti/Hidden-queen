//App.js
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

    socket.on("joinRoomBack", ({roomID,savedRole}) => {
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
            io.to(roomID).emit("gameOver", "Black wins by resignation");
        } else if (socket.id === black) {
            io.to(roomID).emit("gameOver", "White wins by resignation");
        }
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        
        // Get the room this socket was in
        const roomID = socketToRoom[socket.id];
        if (roomID && rooms[roomID]) {
            const room = rooms[roomID];
            
            if (room.white === socket.id) {
                // room.white = null;
                // io.to(roomID).emit("gameOverr", "Black wins by opponent disconnection");
            } else if (room.black === socket.id) {
                // room.black = null;
                // io.to(roomID).emit("gameOver", "White wins by opponent disconnection");
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