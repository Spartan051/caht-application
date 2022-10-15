import express from "express";
import http from "http";
import { Server } from "socket.io";
import createMessage from "./src/utils/messages.js";
import Users from "./src/utils/users.js";
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {});
const users = new Users();
app.use(express.static("public"));
io.on("connection", (socket) => {
  socket.on("join", (params) => {
    const { name, room } = params;
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    io.to(room).emit("updateUsersList", users.getUsersList(room));
    socket.emit(
      "newMessage",
      createMessage("Admin", `welcome to ${room} group`)
    );
    socket.broadcast
      .to(params.room)
      .emit("newMessage", createMessage("Admin", `${name} join the group`));
  });
  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newMessage",
        createMessage(user.name, message.text)
      );
      callback && callback();
    }
  });
  socket.on("createLocationMessage", (location) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        createMessage(user.name, location.lat, location.lng)
      );
    }
  });
  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUsersList(user.room));
      io.to(user.room).emit(
        "nesMessage",
        createMessage("Admin", `${user.name} has left chat`)
      );
    }
  });
});
const port = process.env.PORT || 8080;
httpServer.listen(port, () =>
  console.log(`server running on http://localhost:${port}`)
);
