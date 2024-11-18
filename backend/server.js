const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const SERVER_PORT = 3001;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const sharedList = ["test", "re"];
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté :", socket.id);
  socket.emit("updateList", sharedList);

  socket.on("addItem", (item) => {
    sharedList.push(item);
    io.emit("updateList", sharedList);
  });
  socket.on("removeItem", (index) => {
    sharedList.splice(index, 1);
    io.emit("updateList", sharedList);
  });
  socket.on("modifyItem", (index, change) => {
    sharedList[index] = change;
    io.emit("updateList", sharedList);
  });
  socket.on("disconnect", () => {
    console.log("Un utilisateur est déconnecté");
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server listening on ${SERVER_PORT}`);
});
