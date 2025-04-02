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

app.use(cors({ origin: url, methods: ['GET', 'POST'], credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("joinRoom", (roomID) => {
        console.log(`Player ${socket.id} is joining room ${roomID}`);

        if (!rooms[roomID]) {
            rooms[roomID] = {
                white: null,
                black: null,
                boardState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" // Correct FEN for a new game
            };
        }
        

        let role = "spectator";
        if (!rooms[roomID].white) {
            rooms[roomID].white = socket.id;
            role = "w";
        } else if (!rooms[roomID].black) {
            rooms[roomID].black = socket.id;
            role = "b";
        }

        socket.join(roomID);
        socket.emit("playerRole", role);
        socket.emit("boardState", rooms[roomID].boardState);
    });

    socket.on("move", ({ move, roomID }) => {
        if (!rooms[roomID]) return;

        const { white, black } = rooms[roomID];
        const playerRole = socket.id === white ? "w" : socket.id === black ? "b" : "spectator";

        if (playerRole === "spectator") return;

        rooms[roomID].boardState = move;
        io.to(roomID).emit("move", move);
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        for (const roomID in rooms) {
            if (rooms[roomID].white === socket.id) {
                rooms[roomID].white = null;
                io.to(roomID).emit("gameOver", "Black wins by opponent disconnection");
            } else if (rooms[roomID].black === socket.id) {
                rooms[roomID].black = null;
                io.to(roomID).emit("gameOver", "White wins by opponent disconnection");
            }
        }
    });
});

const PORT = process.env.SOCKET_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app };
