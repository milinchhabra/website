import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import clickSound from './click-sound.wav';
 


function Square({ player, hover, onSquareClick, Enter }) {
  return (
    <button
      onClick={onSquareClick}
      onMouseEnter={Enter}
      className="square">
    </button>
  );
}
function Circle({ player, hover}) {
  if (player === null) {
    return null; // Return null if winstate is false
  }
  return (
    <div className={`circle ${player} ${hover ? 'hover' : ''} ${player ? 'show' : ''}`}></div>

  )
}

function Card({ color, winner, winstate, onButtonClick }) {
  let headerText;
  if (winstate === 'draw') {
    headerText = 'Draw';
  } else {
    headerText = `${winner} Won`;
  }
  if (winstate === "playing") {
    return null; // Return null if winstate is false
  }
  return (
    <div className="card">
      <div className={`card-header ${color}`}>
          <h2 style={{ color: color === 'yellow' ? 'black' : 'white' }}>
            <b>{headerText}</b>
          </h2>
        <button className="close-button" onClick={onButtonClick}>
        <div style={{ color: color === 'yellow' ? 'black' : 'white' }}><b>B</b></div>
        </button>
      </div>
      <div className="card-body">
        <button className="restart-button" onClick={onButtonClick}>
          <h2><b>Rematch</b></h2>
        </button>
      </div>
    </div>
  );
}



class SqInfo {
  constructor(player, hover, x, y) { 
    this.player = player
    this.hover = hover
    this.x = x
    this.y = y
   }
  
}

class PlayerInfo {
  constructor(player,color,name) {
    this.player = player
    this.color = color
    this.name = name
  }
}

export default function Board() {
  const [x, y] = [7, 6];
  let tempsquares = [];
  for (let xi = 0; xi < y; xi++) {
    tempsquares[xi] = [];
    for (let yi = 0; yi < x; yi++) {
      tempsquares[xi][yi] = new SqInfo(null,false,xi,yi);
    }
  }
let user1 = 'test1'
let user2 = 'test2'
let tempplayerturn = new PlayerInfo('p1', 'yellow', user1)

const [connectionid, setConnectionId] = useState('');
const [peer, setPeer] = useState(null); // State to hold the Peer instance
const [connection, setConnection] = useState(null); // State to hold the Peer instance
useEffect(() => {
  // Create a new Peer instance when the component mounts
  const peer = new Peer();
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    });
  // Set up event handler for incoming connections
  peer.on('connection', (connection) => {
    connection.on('data', (data) => {
    console.log('Received data from peer ' + connection.peer + ': ' + data);
    setConnection(peer.connect(connection.peer));

    });
  });
  setPeer(peer);
  return () => {
    peer.disconnect();
    peer.destroy();
  };
}, []);
  
const [squares, setSquares] = useState(tempsquares);
const [playerturn, setPlayerTurn] = useState(tempplayerturn)
const [gamestate, setGameState] = useState('playing')
const playClickSound = () => {
const audio = new Audio(clickSound); audio.play();
};

  function restart(){
    let squares1 = [];

    for (let xi = 0; xi < y; xi++) {
      squares1[xi] = [];
      for (let yi = 0; yi < x; yi++) {
        squares1[xi][yi] = new SqInfo(null,false,xi,yi);
      }
    }  
    setPlayerTurn(new PlayerInfo('p1', 'yellow', user1))
    setGameState('playing')
    setSquares(squares1)  
  }

  function handleClick(cellx, celly) {
    connection.send(cellx, celly)
    if (gamestate === "playing") {
      let squaresCopy = structuredClone(squares);
      let bottomRow = 5;
      let winstate1 = false;
  
      // Find the bottom-most empty cell in the clicked column
      for (let i = 5; i >= 0; i--) {
        if (squaresCopy[i][cellx].player === null || squaresCopy[i][cellx].hover === true) {
          bottomRow = i;
          squaresCopy[bottomRow][cellx].player = playerturn.player;
          squaresCopy[bottomRow][cellx].hover = false;
          winstate1 = CheckWin(squaresCopy[bottomRow][cellx]);
  
          // Play click sound after a short delay
          setTimeout(() => {
            playClickSound();
          }, 250);
  
          if (!winstate1) {
            // Toggle player turn
            const nextPlayer = playerturn.player === 'p1' 
              ? new PlayerInfo('p2', 'red', user2) 
              : new PlayerInfo('p1', 'yellow', user1);
            setPlayerTurn(nextPlayer);
          }
          else {
            setGameState("win");
          }
          setSquares(squaresCopy);
          break;
        }
      }
  
      // Check for tie if all cells are filled and no winner
      let tie = CheckTie()  
      if (tie && !winstate1) {
        // Set winstate to true for tie
        setGameState("draw");
        setPlayerTurn(new PlayerInfo(null, 'grey', user1));
      }
    }
  }
  

  function onEnter(cellx,celly) {
    if (gamestate === "playing") {
    let squares1 = RemoveHovers()
    let bottomrow = 5
    
    for(let i = 5;i >= 0; i--) {
      if (squares1[i][cellx].player == null||squares1[i][cellx].hover === true) {
        bottomrow=i
        squares1[bottomrow][cellx].hover = true
        squares1[bottomrow][cellx].player = playerturn.player
        break
      }
    }


    setSquares(squares1)  
  }
  }

  function onLeave(){
    let squares1 = RemoveHovers()
    setSquares(squares1)  
  }

  function RemoveHovers() {

    let squares1 = structuredClone(squares)

    for(let xi = 5;xi >= 0; xi--) {
      for(let yi = 6; yi >= 0; yi--) {
      if(squares1[xi][yi].hover === true ){
        squares1[xi][yi].player = null
        squares1[xi][yi].hover = false

       }
      }
    }
    return squares1 
  }

  function CheckTie() {
    for(let xi = 5;xi >= 0; xi--) {
      for(let yi = 6; yi >= 0; yi--) {
      if(squares[xi][yi].player === null ){
        return false
      }
    }
  }
  return true
  }

  function CheckWin(square) {
    //square should equal squares[x][y]
    let win = false;
    let directions = [
      [-1, -1], [0, -1], [-1, 0], [-1, 1]
    ];

    if (square.player != null) {
      directions.forEach(direction => {
        checkdirection(direction[0], direction[1]);
      });
    }

    function checkdirection(dy, dx) {
      let linelength = 1;

      for (let i = 1; i < 4; i++) {
        const nextX = square.x + dx * i;
        const nextY = square.y + dy * i;
        if (
          squares[nextX] != null &&
          squares[nextX][nextY] != null &&
          squares[nextX][nextY].player === square.player &&
          squares[nextX][nextY].hover === false
        ) {
          linelength++;
        } else {
          break;
        }
      }
      for (let i = 1; i < 4; i++) {
        const nextX = square.x + (-1 * dx) * i;
        const nextY = square.y + (-1 * dy) * i;
        if (
          squares[nextX] != null &&
          squares[nextX][nextY] != null &&
          squares[nextX][nextY].player === square.player &&
          squares[nextX][nextY].hover === false
        ) {
          linelength++;
        } else {
          break;
        }
      }
      if (linelength >= 4) {
        win = true;
        console.log("Player " + playerturn.player + " wins!");

      }
    }
    return win;
  }

  function connect(peerId) {
  
    const connection1 = peer.connect(peerId); // Connect to the specified peer ID
    console.log('Connecting to peer: ' + peerId);

    connection1.on('open', () => {
      console.log('Connection opened with peer: ' + peerId);
      // Send a message when the connection is open
      connection1.send('hi');
      console.log("Sent 'hi'");
    });
    setConnection(connection1)

  }
  


  
return (

  <div id='parent'>
    <link href="https://db.onlinewebfonts.com/c/369414b7f68cb9a1ba2e7089f801ec67?family=Chess+Glyph+Regular" rel="stylesheet"></link>
  <div className='board'>
    <div className="board-back" onMouseLeave={onLeave}>
      {squares.map((row, y) => (
        <div key={y}>
          {row.map((cell, x) => (
            <div className='square-container' key={`${y}-${x}`}>
              <Square
                player={cell.player}
                hover={cell.hover}
                onSquareClick={() => handleClick(x, y)}
                Enter={() => onEnter(x, y)} 
              />
              <Circle
                player={cell.player}
                hover={cell.hover}
              />
            </div>
          ))}
        </div>
      ))}
      <div className='board-front'></div>
    </div>
  </div>
  <div id='player-info'>
     <div className='player-left'>
      <div className = 'player-left-icon'> </div>
      <div className = 'player-left-text'>{user1} </div>
     </div>
     <div className='player-right'>
     <div className = 'player-right-text'>{user2} </div>
      <div className = 'player-right-icon'> </div>
     </div>
     <div>

     </div>
  </div>
  <Card
    color={playerturn.color}
    winner={playerturn.name}
    winstate={gamestate}
    onButtonClick={restart}
  />
  <div>
<input
  type="text"
  value={connectionid}
  onChange={(e) => setConnectionId(e.target.value)}
  placeholder="Enter Peer ID"
/>
<button onClick={() => connect(connectionid)}>Connect</button>
</div>
</div>
)}