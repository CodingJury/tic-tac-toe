import "./TicTacToeBoard.css"
import { useRecoilValue } from "recoil";
import { gameAtom, socketAtom } from "../store/atom";

function TicTacToeBoard() {
  const socket = useRecoilValue(socketAtom)
  const game = useRecoilValue(gameAtom)

  function handleClick(e: any) {
    if(game.start) {
      if(e.target.innerHTML === "") { //only to click on empty board
        console.log('clicked', e.target.id)
        socket?.send(
          JSON.stringify({
            type: "move",
            payload: {
              "moveIndex": e.target.id
          }
          })
        );
      }
    }
  }

  return (
    <table>
      <tbody>
        <tr>
          <td className="cell" id="0" onClick={handleClick}>{game.board[0]}</td>
          <td className="cell" id="1" onClick={handleClick}>{game.board[1]}</td>
          <td className="cell" id="2" onClick={handleClick}>{game.board[2]}</td>
        </tr>
        <tr>
          <td className="cell" id="3" onClick={handleClick}>{game.board[3]}</td>
          <td className="cell" id="4" onClick={handleClick}>{game.board[4]}</td>
          <td className="cell" id="5" onClick={handleClick}>{game.board[5]}</td>
        </tr>
        <tr>
          <td className="cell" id="6" onClick={handleClick}>{game.board[6]}</td>
          <td className="cell" id="7" onClick={handleClick}>{game.board[7]}</td>
          <td className="cell" id="8" onClick={handleClick}>{game.board[8]}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TicTacToeBoard;