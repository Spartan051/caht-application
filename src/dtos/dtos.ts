export interface Message {
  from: string;

  text?: string;
  lat?: string;
  lng?: string;
  url?: string;
}

export interface UserInfo {
  id?: string;
  name: string;
  room: string;
}
