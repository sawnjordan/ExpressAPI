const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineAdminUsers = [];

const addNewAdminUser = (userName, socketId) => {
  if (!onlineAdminUsers.some((user) => user.userName === userName)) {
    onlineAdminUsers.push({ userName, socketId });
    console.log(
      `User "${userName}" connected. Online Admin Users:`,
      onlineAdminUsers
    );
  }
};

const removeAdminUser = (socketId) => {
  const userToRemove = onlineAdminUsers.find(
    (user) => user.socketId === socketId
  );
  if (userToRemove) {
    onlineAdminUsers = onlineAdminUsers.filter(
      (user) => user.socketId !== socketId
    );
    console.log(
      `User "${userToRemove.userName}" disconnected. Online Admin Users:`,
      onlineAdminUsers
    );
  }
};

io.on("connection", (socket) => {
  console.log("A user connected");
  console.log(socket.id);

  socket.on("joinAdminRoom", () => {
    socket.join("admin-room");
    socket.emit("test", { msg: "hello here" });
  });

  socket.on("newAdminUser", (userName) => {
    addNewAdminUser(userName, socket.id);
  });
  //   Listen for order events
  socket.on("sendOrderNotification", (data) => {
    // Broadcast the order details to all connected clients (admins)
    io.to(data.room).emit("getOrderNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeAdminUser(socket.id);
  });
});

module.exports = server;
