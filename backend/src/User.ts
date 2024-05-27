import { WebSocket } from "ws";

export class User {
  public socket: WebSocket;
  public username: string;

  constructor(socket: WebSocket, username: string) {
    this.socket = socket;
    this.username = username;
  }
}