"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const message_1 = __importDefault(require("./src/utils/message"));
const users_1 = __importDefault(require("./src/utils/users"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {});
const users = new users_1.default();
app.use(express_1.default.static("public"));
io.on("connection", (socket) => {
    socket.on("join", (params) => {
        const { name, room } = params;
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);
        io.to(room).emit("updateUsersList", users.getUsersList(room));
        socket.emit("newMessage", (0, message_1.default)("Admin", `welcome to ${room} group ${name}`));
        socket.broadcast
            .to(params.room)
            .emit("newMessage", (0, message_1.default)("Admin", `${name} join the group`));
    });
    socket.on("createMessage", (message, callback) => {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit("newMessage", (0, message_1.default)(user.name, message.text));
            callback && callback();
        }
    });
    socket.on("createLocationMessage", (location) => {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit("newLocationMessage", (0, message_1.default)(user.name, "", location.lat, location.lng));
        }
    });
    socket.on("disconnect", () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("updateUsersList", users.getUsersList(user.room));
            io.to(user.room).emit("nesMessage", (0, message_1.default)("Admin", `${user.name} has left chat`));
        }
    });
});
const port = process.env.PORT || 8080;
httpServer.listen(port, () => console.log(`server running on http://localhost:${port}`));
