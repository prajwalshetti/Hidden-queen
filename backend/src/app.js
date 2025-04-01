import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const url = process.env.FRONT_END_URL;

// Create HTTP server to use with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO with proper CORS configuration
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }
});

let rooms = {}; // Stores room states

// Express middleware
app.use(cors({
    origin: url,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

// WebSocket Event Handling
io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    // Listen for joinRoom event
    socket.on("joinRoom", (roomID) => {
        console.log(`Player ${socket.id} is joining room ${roomID}`);

        // Check if the room exists or create it
        if (!rooms[roomID]) {
            rooms[roomID] = { white: null, black: null, boardState: "initial-fen-string-here" };
        }

        // Assign player role based on room status
        if (!rooms[roomID].white) {
            rooms[roomID].white = socket.id;
            socket.emit("playerRole", "w");
        } else if (!rooms[roomID].black) {
            rooms[roomID].black = socket.id;
            socket.emit("playerRole", "b");
        } else {
            socket.emit("spectatorRole");
        }

        // Send the current board state to the player
        socket.emit("boardState", rooms[roomID].boardState);
    });

    // Handle move requests
    socket.on("move", (move, roomID) => {
        console.log(`Move received in room ${roomID}: ${move}`);
        
        // Broadcast move to all players in the room
        io.to(roomID).emit("move", move);

        // Update board state after move (you should compute the actual new FEN string here)
        rooms[roomID].boardState = "new-fen-after-move"; // Update with actual FEN string after move
        io.to(roomID).emit("boardState", rooms[roomID].boardState);
    });

    // Handle player disconnection
    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        
        // Check which room the player was in and remove them
        for (const roomID in rooms) {
            if (rooms[roomID].white === socket.id) {
                rooms[roomID].white = null;
            } else if (rooms[roomID].black === socket.id) {
                rooms[roomID].black = null;
            }
        }

        // Broadcast that a player has disconnected and reset the board
        io.emit("boardState", "reset-fen-string"); // You can change this to a real reset state
    });
});

// Start the server on the specified port
const PORT = process.env.SOCKET_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app };
