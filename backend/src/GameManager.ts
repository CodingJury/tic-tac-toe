import { WebSocket } from "ws";
import { User } from "./User";
import { INIT_GAME, MOVE } from "./messageType";
import { Game } from "./Game";

export class GameManager {
  private static instance: GameManager;
  private games: Game[];
  private pendingUser: User | null;
  private users: User[];
  // private connectedUsers: Map<string, User[]>;

  private constructor() {
    this.games = []
    this.pendingUser = null;
    this.users = []
    // this.connectedUsers = new Map<string, User[]>()
  }

  static getInstance() {
    if(!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager.instance
  }

  addUser(user: User) {
    const isUserAlreadyPresent = this.users.find(u => u.socket === user.socket)
    if(isUserAlreadyPresent) {
      console.error(`${user.username} Already Present`)
      return;
    }
    this.users.push(user);
    console.log('user added')
    
    this.addHandler(user)
  }

  private addHandler(user: User) {
    console.log('Add Handler is called')
    user.socket.on('message', async (data) => {
      const message = JSON.parse(data.toString())
      console.log('MESSAGE: ', message)
      
      if(message.type === INIT_GAME) {
        console.log('INIT GAME')
        if(this.pendingUser) {
          console.log('----------ONE---------')
          //start a game
          const game = new Game(user, this.pendingUser)
          this.games.push(game)
          this.pendingUser = null;
        } else {
          console.log('----------TWO---------')
          // mark user as pendingUser
          this.pendingUser = user;
        }
      }

      if(message.type === MOVE) {
        console.log('MOVE')
        const game = this.games.find(game => game.player1 === user || game.player2 === user)
        if(game) {
          game.makeMove(user, message.payload.moveIndex)
        }
      }

      //LOG THE DATA
      // GameManager.instance.log()
    })
  }
  
  removeUser(socket: WebSocket) {
    const user = this.users.find(user => user.socket === socket)
    if(!user) {
      console.error('User not found')
      return;
    }
    this.users = this.users.filter(user => user.socket !== socket)
    
    console.log('user removed')
  }

  log() {
    console.log("--------LOG------")
    console.log(this.games)
    const LogPendingUser = this.pendingUser?.username;
    console.log(LogPendingUser)
    const LogUsers = this.users.map((user) => user.username)
    console.log(LogUsers)
    console.log("-----------------")
  }
}
