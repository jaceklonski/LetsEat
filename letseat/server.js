const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

global._io = null;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  const io = new Server(httpServer, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  global._io = io;

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.emit("testEvent", { message: "Connected to server" });
    socket.on("orderStatusChanged", (updatedOrder) => {
      console.log("Order status changed (socket emit):", updatedOrder);
      io.emit("orderStatusChanged", updatedOrder);
    });

    socket.on("newOrder", (newOrder) => {
      console.log("New order received (socket emit):", newOrder);
      io.emit("newOrder", newOrder);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
