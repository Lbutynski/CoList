const express = require("express");
const http = require("http");
const { default: mongoose } = require("mongoose");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const MONGO_URI = process.env.MONGO_URI;
const SERVER_FRONT_ADDRESS = process.env.SERVER_FRONT_ADDRESS;

(async () => {
  await mongoose.connect(MONGO_URI);
})();

const listItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [String],
});
const ListItem = new mongoose.model("ListItem", listItemSchema);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: SERVER_FRONT_ADDRESS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const retrieveList = async (id) => {
  const list = await ListItem.findById(id);
  if (!list) {
    list = await ListItem.create({
      _id: id,
      name: defaultName,
      items: [],
    });
  }
  return list.items;
};

io.on("connection", async (socket) => {
  console.log("Un utilisateur est connecté :", socket.id);
  const listId = "673b5242259d4a54b7caf04e";
  let list = await retrieveList(listId);
  socket.emit("updateList", list);

  socket.on("addItem", async (item) => {
    await ListItem.findByIdAndUpdate(
      listId,
      { $push: { items: item } },
      { new: true }
    );
    list = await retrieveList(listId);
    io.emit("updateList", list);
  });
  socket.on("removeItem", async (index) => {
    const currentList = await ListItem.findById(listId);
    if (currentList && currentList.items[index]) {
      currentList.items.splice(index, 1);
      await currentList.save();
      list = await retrieveList(listId);
      io.emit("updateList", list);
    }
  });
  socket.on("changeItem", async (index, newItem) => {
    const currentList = await ListItem.findById(listId);
    if (currentList && currentList.items[index]) {
      currentList.items[index] = newItem;
      await currentList.save();
      list = await retrieveList(listId);
      io.emit("updateList", list);
    }
  });
  socket.on("disconnect", () => {
    console.log("Un utilisateur est déconnecté");
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server listening on ${SERVER_PORT}`);
});
