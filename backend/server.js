const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const roomCodeMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", ({ roomId, username, language }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    if (!roomCodeMap[roomId]) {
      roomCodeMap[roomId] = "";
    }

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });

    socket.emit("sync-code", {
      code: roomCodeMap[roomId],
      language,
    });
  });

  socket.on("code-change", ({ roomId, code }) => {
    if (!roomId) return;
    roomCodeMap[roomId] = code;

    socket.to(roomId).emit("code-change", { code });
  });

  socket.on("request-code", ({ roomId, socketId }) => {
    if (roomCodeMap[roomId]) {
      io.to(socketId).emit("sync-code", {
        code: roomCodeMap[roomId],
        language: null,
      });
    }
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];

    rooms.forEach((roomId) => {
      if (io.sockets.adapter.rooms.get(roomId)?.size === 0) {
        delete roomCodeMap[roomId]; 
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Socket.IO server running on port ${PORT}`));
