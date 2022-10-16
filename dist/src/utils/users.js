"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Users {
    constructor() {
        this.usersList = [];
    }
    addUser(id, name, room) {
        var _a;
        const user = { id, name, room };
        (_a = this.usersList) === null || _a === void 0 ? void 0 : _a.push(user);
        return user;
    }
    getUsersList(room) {
        var _a;
        const users = (_a = this.usersList) === null || _a === void 0 ? void 0 : _a.filter((user) => user.room === room);
        const namesArray = users.map((user) => user.name);
        return namesArray;
    }
    getUser(id) {
        return this.usersList.filter((user) => user.id === id)[0];
    }
    removeUser(id) {
        const user = this.getUser(id);
        if (user) {
            this.usersList = this.usersList.filter((user) => user.id !== id);
        }
        return user;
    }
}
exports.default = Users;
