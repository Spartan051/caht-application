import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Message, UserInfo } from "./src/dtos/dtos";
import createMessage from "./src/utils/message";
import Users from "./src/utils/users";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {});
const users = new Users();

app.use(express.static("public"));

io.on("connection", (socket: any): void => {
  socket.on("join", (params: UserInfo): void => {
    const { name, room }: UserInfo = params;
    socket.join(room);

    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);

    io.to(room).emit("updateUsersList", users.getUsersList(room));

    socket.emit(
      "newMessage",
      createMessage("Admin", `welcome to ${room} group ${name}`)
    );

    socket.broadcast
      .to(params.room)
      .emit("newMessage", createMessage("Admin", `${name} join the group`));
  });

  socket.on("createMessage", (message: Message, callback?: Function): void => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newMessage",
        createMessage(user.name, message.text!)
      );
      callback && callback();
    }
  });

  socket.on("createLocationMessage", (location: Message): void => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        createMessage(user.name, "", location.lat!, location.lng!)
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

const port: number | string = process.env.PORT || 8080;
httpServer.listen(port, () =>
  console.log(`server running on http://localhost:${port}`)
);
