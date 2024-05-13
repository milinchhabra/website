import React, { useState } from 'react';
import clickSound from './click-sound.wav';
 


function Square({ player, hover, onSquareClick, Enter }) {
  return (
    <button
      onClick={onSquareClick}
      onMouseEnter={Enter}
      className="square">
      {/* {player !== null && (
        <div className={`circle ${player} ${hover ? 'hover' : ''} ${player ? 'show' : ''}`}></div>
      )} */}
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
  if (!winstate) {
    return null; // Return null if winstate is false
  }

  return (
    <div className="card">
      <div className={`card-header ${color}`}>
        <h2 style={{ color: color === 'yellow' ? 'black' : 'white' }}><b>{winner} Won</b></h2>
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

  const [squares, setSquares] = useState(tempsquares);
  const [playerturn, setPlayerTurn] = useState(tempplayerturn)
  const [winstate, setWinState] = useState(false)
  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
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
    setWinState(false)
    setSquares(squares1)  
  }

  function handleClick(cellx, celly) {
    if (!winstate) {
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
  
          setWinState(winstate1);
          setSquares(squaresCopy);
          break;
        }
      }
  
      // Check for tie if all cells are filled and no winner
      let tie = CheckTie()  
      if (tie && !winstate1) {
        // Set winstate to true for tie
        setWinState(true);
        setPlayerTurn(new PlayerInfo("Draw", 'grey', user1));
      }
    }
  }
  

  function onEnter(cellx,celly) {
    if (!winstate) {
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
return (

  <div className='parent'>
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
  <div className='player-info'></div>
  <Card
    color={playerturn.color}
    winner={playerturn.name}
    winstate={winstate}
    onButtonClick={restart}
  />
</div>
)}