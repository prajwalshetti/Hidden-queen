import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const url = process.env.FRONT_END_URL;
const boardString="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Helper function to update the board string
function updateBoardStateToQueen(boardString, selectedColumn,isWhite) {
    // Split FEN into board placement and other fields (side to move, etc.)
    const parts = boardString.split(" ");
    const boardRows = parts[0].split("/");
  
    // For white, pawns are on rank 2 (index 6, since FEN rows go from rank8 at index 0 to rank1 at index 7)
    // For black, pawns are on rank 7 (index 1)
    const rowIndex = isWhite ? 6 : 1;
    const rowStr = boardRows[rowIndex];
    
    // Since in the pawn rows there are exactly 8 characters (all pawns),
    // we can treat the row as a simple array.
    const row = rowStr.split("");
    const fileIndex = selectedColumn - 1; // convert 1-based index to 0-based
    
    // Check if the pawn is at that file and update it
    if (isWhite) {
      if (row[fileIndex] === "P") {
        row[fileIndex] = "Q";
      }
    } else {
      if (row[fileIndex] === "p") {
        row[fileIndex] = "q";
      }
    }
    
    // Update the row and rebuild the FEN
    boardRows[rowIndex] = row.join("");
    parts[0] = boardRows.join("/");
    return parts.join(" ");
  }  

  function changeToQueen(roomID, isWhite, index) {
    const room = rooms[roomID];
    if (!room || index < 1 || index > 8) return;

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const square = files[index - 1] + (isWhite ? '2' : '7'); // 'a2' for white, 'a7' for black

    if (isWhite) {
        room.hqwsquare = square;
        room.hqwstatus = 1; // Assigned
        console.log("White Hidden Queen assigned to square: ", square);
    } else {
        room.hqbsquare = square;
        room.hqbstatus = 1; // Assigned
        console.log("Black Hidden Queen assigned to square: ", square);
    }

}


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

    socket.on("changeToQueen", ({ roomID, index, isWhite }) => {
        console.log(`Received changeToQueen for room ${roomID} with index ${index}`);
        
        // Retrieve the room
        const room = rooms[roomID];
        if (!room) {
            console.error("Room not found:", roomID);
            return;
        }
        
        if (roomID.endsWith('_HQ')) {
            room.boardState = updateBoardStateToQueen(room.boardState, index, isWhite);
        }
        changeToQueen(roomID, isWhite, index)
        io.to(roomID).emit("boardState", room.boardState);
                io.to(roomID).emit("playersHQ", {
            hqwsquare: room.hqwsquare,
            hqbsquare: room.hqbsquare,
            hqwstatus: room.hqwstatus,
            hqbstatus: room.hqbstatus
        });
    });    

    socket.on("revealHQ", ({ roomID, color }) => {
        const room = rooms[roomID];
        if (!room) return;
    
        if (color === "w") {
            room.hqwstatus = 2; // Revealed
            console.log(`White Hidden Queen revealed in room ${roomID}`);
        } else if (color === "b") {
            room.hqbstatus = 2; // Revealed
            console.log(`Black Hidden Queen revealed in room ${roomID}`);
        }
    
        // Emit the updated HQ info to all clients in the room
        io.to(roomID).emit("playersHQ", {
            hqwsquare: room.hqwsquare,
            hqbsquare: room.hqbsquare,
            hqwstatus: room.hqwstatus,
            hqbstatus: room.hqbstatus
        });
    });

    socket.on("changeHQSquare", ({ roomID, color, newSquare }) => {
        const room = rooms[roomID];
        if (!room) return;
    
        if (color === "w" && room.hqwstatus < 3) {
            room.hqwsquare = newSquare;
        } else if (color === "b" && room.hqbstatus < 3) {
            room.hqbsquare = newSquare;
        }        
    
        io.to(roomID).emit("playersHQ", {
            hqwsquare: room.hqwsquare,
            hqbsquare: room.hqbsquare,
            hqwstatus: room.hqwstatus,
            hqbstatus: room.hqbstatus
        });
    });    

    

    socket.on("captureHQ", ({ roomID, color }) => {
        const room = rooms[roomID];
        if (!room) return;
    
        if (color === "w" && room.hqwstatus < 3) {
            room.hqwstatus = 3; // Captured
            console.log(`White HQ captured`);
        } else if (color === "b" && room.hqbstatus < 3) {
            room.hqbstatus = 3; // Captured
            console.log(`Black HQ captured`);
        }
    
        // Emit updated HQ data
        io.to(roomID).emit("playersHQ", {
            hqwsquare: room.hqwsquare,
            hqbsquare: room.hqbsquare,
            hqwstatus: room.hqwstatus,
            hqbstatus: room.hqbstatus,
        });
    });

    socket.on("capturePP", ({ roomID, color }) => {
        const room = rooms[roomID];
        if (!room) return;
        const message = `Poisoned pawn captured. ${color === "w" ? "White" : "Black"} wins.`;
        io.to(roomID).emit("gameOver", message);
    });

    socket.on("goalScored", ({ roomID, color }) => {
        const room = rooms[roomID];
        if (!room) return;
        const message = `Goal scored. ${color === "w" ? "White" : "Black"} wins.`;
        io.to(roomID).emit("gameOver", message);
    });

    socket.on("updateTime", ({ roomID, whiteTime, blackTime, lastMoveTime }) => {
        if (!rooms[roomID]) return;
        
        const room = rooms[roomID];
        room.whiteTime = whiteTime;
        room.blackTime = blackTime;
        room.lastMoveTime = lastMoveTime;
        
        // Broadcast updated time to all clients in the room
        io.to(roomID).emit("timeUpdate", {
            whiteTime,
            blackTime,
            lastMoveTime
        });
    });

    socket.on("requestTimeSync", ({ roomID }) => {
        if (!rooms[roomID]) return;
        
        const room = rooms[roomID];
        socket.emit("timeSync", {
            whiteTime: room.whiteTime,
            blackTime: room.blackTime,
            lastMoveTime: room.lastMoveTime,
            currentTurn: room.boardState.split(" ")[1]
        });
    });

    socket.on("kingCaptured", ({ roomID, winner }) => {
        const message = `King Captured. ${winner === "w" ? "White" : "Black"} wins.`;
        io.to(roomID).emit("gameOver", message);

        if(winner==="w")
        io.to(roomID).emit("kingNull","b");
        else
        io.to(roomID).emit("kingNull","w");
    });

    // Checkmate handler
    socket.on("checkmated", ({ roomID, winner }) => {
        const message = `Checkmate. ${winner === "w" ? "White" : "Black"} wins.`;
        io.to(roomID).emit("gameOver", message);
    });

    // Draw handler
    socket.on("drawGame", ({ roomID }) => {
        const message = "The game ended in a draw.";
        io.to(roomID).emit("gameOver", message);
    });

    socket.on("drawReq", ({ roomID, color }) => {
        if (!rooms[roomID]) return;
        const room = rooms[roomID];
        if (color === "w") room.drawReq.white = true;
        else room.drawReq.black = true;
        const username = color === "w" ? room.whiteUsername : room.blackUsername;
        const message = { username, text: `${username} has requested a draw.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), playerRole: color };
        room.playerMessages.push(message); room.spectatorMessages.push(message);
        if (room.white) io.to(room.white).emit("chatMessage", message);
        if (room.black) io.to(room.black).emit("chatMessage", message);
        io.to(roomID).emit("showMessage", `${username} has requested a draw.`);
        room.spectators.forEach(id => io.to(id).emit("chatMessage", message));
        if (room.drawReq.white && room.drawReq.black) io.to(roomID).emit("gameOver", "The game ended in a draw by mutual agreement.");
      });
      
      socket.on("drawReqBack", ({ roomID, color }) => {
        if (!rooms[roomID]) return;
        const room = rooms[roomID];
        if (color === "w") room.drawReq.white = false;
        else room.drawReq.black = false;
        const username = color === "w" ? room.whiteUsername : room.blackUsername;
        const message = { username, text: `${username} has withdrawn their draw request.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), playerRole: color };
        room.playerMessages.push(message); room.spectatorMessages.push(message);
        if (room.white) io.to(room.white).emit("chatMessage", message);
        if (room.black) io.to(room.black).emit("chatMessage", message);
        room.spectators.forEach(id => io.to(id).emit("chatMessage", message));
      });
      
    
    socket.on("joinRoomBack", ({roomID, savedRole, username}) => {
        console.log(`Player ${socket.id} (${username}) is rejoining room ${roomID}`);

        // Create room if it doesn't exist
        if (!rooms[roomID]) {
            socket.emit("gameOver","Refresh")
            return false;
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
        
        // Send time data
        socket.emit("timeSync", {
            whiteTime: room.whiteTime,
            blackTime: room.blackTime,
            lastMoveTime: room.lastMoveTime,
            currentTurn: room.boardState.split(" ")[1]
        });
        
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
        io.to(roomID).emit("playersHQ", {
            hqwsquare:room.hqwsquare,
            hqbsquare:room.hqbsquare,
            hqwstatus:room.hqwstatus,
            hqbstatus:room.hqbstatus
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
                boardState: boardString,
                spectators: [],
                playerMessages: [], // Messages between white and black players
                spectatorMessages: [], // Messages among spectators
                hqwsquare: null, 
                hqbsquare: null, 
                hqwstatus: 0, 
                hqbstatus: 0,
                drawReq: {
                    white: false,
                    black: false
                },
                // Adding clock properties
                whiteTime: 600, // 10 minutes in seconds
                blackTime: 600,
                lastMoveTime: Date.now() // Track when the last move was made
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
        
        // Send time data
        socket.emit("timeSync", {
            whiteTime: room.whiteTime,
            blackTime: room.blackTime,
            lastMoveTime: room.lastMoveTime,
            currentTurn: room.boardState.split(" ")[1]
        });
        
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
        io.to(roomID).emit("playersHQ", {
            hqwsquare:room.hqwsquare,
            hqbsquare:room.hqbsquare,
            hqwstatus:room.hqwstatus,
            hqbstatus:room.hqbstatus
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
        io.to(roomID).emit("playersHQ", {
            hqwsquare:room.hqwsquare,
            hqbsquare:room.hqbsquare,
            hqwstatus:room.hqwstatus,
            hqbstatus:room.hqbstatus
        });
    });

    socket.on("move", ({ move, roomID }) => {
        if (!rooms[roomID]) return;

        const room = rooms[roomID];
        const { white, black } = room;
        const playerRole = socket.id === white ? "w" : socket.id === black ? "b" : "spectator";

        if (playerRole === "spectator") return;

        // Update board state
        room.boardState = move;
        
        // Update last move time
        room.lastMoveTime = Date.now();
        
        // Broadcast move to all clients
        io.to(roomID).emit("move", move);
        
        // Send updated time info
        io.to(roomID).emit("timeUpdate", {
            whiteTime: room.whiteTime,
            blackTime: room.blackTime,
            lastMoveTime: room.lastMoveTime
        });
    });

    socket.on("timeOut", ({ roomID, color }) => {
        if (!rooms[roomID]) return;
        
        const winner = color === 'w' ? 'Black' : 'White';
        const message = `Time's up! ${winner} wins by timeout.`;
        io.to(roomID).emit("gameOver", message);
    });

    socket.on("resign", ({ roomID }) => {
        if (!rooms[roomID]) return;

        const { white, black } = rooms[roomID];
        if (socket.id === white) {
            // Send message to the player who resigned
            socket.emit("gameOver", "You resigned. Black wins.");
            
            // Send message to the opponent about the resignation
            if (black) {
                io.to(black).emit("gameOver", "White resigned. You win!");
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
                io.to(white).emit("gameOver", "Black resigned. You win!");
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
            room.boardState=boardString;
            console.log(`White player left room ${roomID}`);
            
            // Broadcast updated player info
            io.to(roomID).emit("playersInfo", {
                whiteUsername: null,
                blackUsername: room.blackUsername
            });
            io.to(roomID).emit("playersHQ", {
                hqwsquare:room.hqwsquare,
                hqbsquare:room.hqbsquare,
                hqwstatus:room.hqwstatus,
                hqbstatus:room.hqbstatus
            });
        } else if (room.black === socket.id) {
            room.black = null;
            room.blackUsername = null;
            room.boardState=boardString;
            console.log(`Black player left room ${roomID}`);
            
            // Broadcast updated player info
            io.to(roomID).emit("playersInfo", {
                whiteUsername: room.whiteUsername,
                blackUsername: null
            });
            io.to(roomID).emit("playersHQ", {
                hqwsquare:room.hqwsquare,
                hqbsquare:room.hqbsquare,
                hqwstatus:room.hqwstatus,
                hqbstatus:room.hqbstatus
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
                // room.white = null;
                // Don't reset the username on disconnect to allow reconnection
            } else if (room.black === socket.id) {
                // We're not automatically ending the game on disconnect as requested
                // room.black = null;
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