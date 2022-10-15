import { UserInfo } from "../dtos/dtos";

export default class Users {
  public usersList?: UserInfo[];

  constructor() {
    this.usersList = [];
  }

  addUser(id: string, name: string, room: string): UserInfo {
    const user: UserInfo = { id, name, room };
    this.usersList?.push(user);
    return user;
  }

  getUsersList(room: string): string[] {
    const users: UserInfo[] | undefined = this.usersList?.filter(
      (user) => user.room === room
    );
    const namesArray: string[] = users!.map((user) => user.name);
    return namesArray;
  }

  getUser(id: string): UserInfo {
    return this.usersList!.filter((user) => user.id === id)[0];
  }

  removeUser(id: string): UserInfo {
    const user: UserInfo = this.getUser(id);

    if (user) {
      this.usersList = this.usersList!.filter((user) => user.id !== id);
    }
    return user;
  }
}
