const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const SERVER_PORT = 3001;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

server.listen(SERVER_PORT, () => {
  console.log(`Server listening on ${SERVER_PORT}`);
});
