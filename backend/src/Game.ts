import { User } from "./User";
import { GAME_CURRENT_STATE, GAME_OVER, INIT_GAME, MOVE } from "./messageType";

export class Game {
  public player1: User;
  public player2: User;
  private board: ("X"|"O"|"")[];
  private moves: number[];

  constructor(player1: User, player2: User) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = ["","","","","","","","",""]
    this.moves = []

    this.player1.socket.send(JSON.stringify({
      type: INIT_GAME, 
      payload: {
        piece: "X"
      }
    }))
    this.player2.socket.send(JSON.stringify({
      type: INIT_GAME, 
      payload: {
        piece: "O"
      }
    }))
  }

  makeMove(player: User, moveIndex: number) {
    //validate move using zod

    // is it this user move
    if(this.moves.length % 2 === 0 && player.socket !== this.player1.socket) {
      return;
    } 
    if(this.moves.length % 2 === 1 && player.socket !== this.player2.socket) {
      return;
    } 
    // is the move valid

    //update the board
    this.board[moveIndex] = player.socket === this.player1.socket ? "X" : "O";
    //push the move
    this.moves.push(moveIndex)


    //send the updated board to other player
    this.player1.socket.send(JSON.stringify({
      type: GAME_CURRENT_STATE,
      payload: {
        board: this.board
      }
    }))
    this.player2.socket.send(JSON.stringify({
      type: GAME_CURRENT_STATE,
      payload: {
        board: this.board
      }
    }))

    //check if the game is over
    if(this.checkWon(this.moves.length % 2 === 0 ? "O" : "X")) {
      //send the game over the message to other player
      this.player1.socket.send(JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner: this.moves.length % 2 === 0 ? "0" : "X"
        }
      }))
      this.player2.socket.send(JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner: this.moves.length % 2 === 0 ? "0" : "X"
        }
      }))
      return;
    }
  }

  checkWon(piece: "X" | "O") {
    const winComb = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ]

    const plays = this.board.reduce((a: number[] ,e:("X"|"O"|"") ,i: number) => (
      (e === piece) ? a.concat(i) : a
    ), [])

    let gameWon = null;
    for(let [index, win] of winComb.entries()) {
      if(win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = piece;
        break;
      }
    }

    console.log('====================================');
    console.log("gameWon::", gameWon);
    console.log('====================================');

    return gameWon;
  }
}