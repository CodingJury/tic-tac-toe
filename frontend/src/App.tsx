import { useEffect } from "react";
import { useRecoilState } from "recoil";
import TicTacToeBoard from "./components/TicTacToeBoard";
import { gameAtom, socketAtom, usernameAtom } from "./store/atom";

function App() { 
  const [socket, setSocket] = useRecoilState(socketAtom)
  const [username, setUsername] = useRecoilState(usernameAtom);
  const [game, setGame] = useRecoilState(gameAtom)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to websocket");
      setSocket(ws);
    };

    ws.onmessage = (message) => {
      console.log("Received message", message.data);
      const data = JSON.parse(message.data.toString());
      const { type, payload } = data;

      switch (type) {
        case "init_game": {
          setGame(prev => ({...prev, "piece": payload.piece, start: true}));
          break;
        }
        
        case "game_current_state": {
          setGame(prev => ({...prev, board: payload.board}));
          break;
        }
        
        case "game_over": {
          setGame(prev => ({...prev, start: false, wonBy: payload.winner}));
          break;
        }

        default:
          console.log("this case is not handled [DEFAULT CASAE]");
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  if(game.wonBy) {
    alert("Game is won by: "+game.wonBy)
  }

  function handleUserName(e: any) {
    setUsername(e.target.value);
  }

  function addUser() {
    if (username) {
      socket?.send(
        JSON.stringify({
          type: "add_user",
          payload: {
            username: username,
          },
        })
      );
    }
  }

  function initGame() {
    socket?.send(
      JSON.stringify({
        type: "init_game",
      })
    );
  }

  if (!socket) {
    return <div>Connecting to socket server. [Loadiong...]</div>;
  }

  return (
    <>
      <input type="text" onChange={handleUserName} value={username} />
      <button onClick={addUser}>ADD USER</button>
      <button onClick={initGame}>INIT GAME</button>
      {JSON.stringify(game)}

      <TicTacToeBoard />
    </>
  );
}



export default App;
