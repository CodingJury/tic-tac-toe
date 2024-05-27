import {WebSocketServer} from "ws";
import { GameManager } from "./GameManager";
import { User } from "./User";
import { ADD_USER } from "./messageType";

const wss = new WebSocketServer({ port: 8080 })

const gameManager = GameManager.getInstance()

wss.on('connection', (ws) => {
  // ws.on('error', console.error)

  ws.on('message', (data) => {
    console.log('received: %s', data)
    const message = JSON.parse(data.toString())
    if(message.type === ADD_USER) {
      gameManager.addUser(new User(ws, message.payload.username))
    }
  })

  // ws.send('something')

  ws.on('close', () => {
    gameManager.removeUser(ws)
  })
})