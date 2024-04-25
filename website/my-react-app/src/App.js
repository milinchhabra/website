import React, { useState } from 'react';
import clickSound from './click-sound.wav';


function Square({ player, hover, onSquareClick, Enter }) {
  return (
    <button
      onClick={onSquareClick}
      onMouseEnter={Enter}
      className="square">
      {}
      {player !== null && (
        <div className={`circle ${player} ${hover ? 'hover' : ''} ${player ? 'show' : ''}`}></div>
      )}
      <div className='hole'></div>
    </button>
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


export default function Board() {
  const [x, y] = [7, 6];
  let tempsquares = [];
  let winstate = false
  for (let xi = 0; xi < y; xi++) {
    tempsquares[xi] = [];
    for (let yi = 0; yi < x; yi++) {
      tempsquares[xi][yi] = new SqInfo(null,false,xi,yi);
    }
  }
  const [squares, setSquares] = useState(tempsquares);
  const [playerturn, setPlayerTurn] = useState('p1')
  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };


  function handleClick(cellx,celly) {
    let squares1 = structuredClone(squares)
    let bottomrow = 5
    for(let i = 5;i >= 0; i--) {
      if (squares1[i][cellx].player == null||squares1[i][cellx].hover === true) {
        bottomrow=i
        squares1[bottomrow][cellx].player = playerturn
        squares1[bottomrow][cellx].hover = false
        winstate = CheckWin(squares1[bottomrow][cellx])
        setTimeout(() => {
          playClickSound();
        }, 250);
      break
      }
    }

    setSquares(squares1)  

    if (playerturn === "p1") {
      setPlayerTurn("p2")
    }
    else {
      setPlayerTurn("p1")
    }

  }

  function onEnter(cellx,celly) {

    let squares1 = RemoveHovers()
    let bottomrow = 5
    
    for(let i = 5;i >= 0; i--) {
      if (squares1[i][cellx].player == null||squares1[i][cellx].hover === true) {
        bottomrow=i
        squares1[bottomrow][cellx].hover = true
        squares1[bottomrow][cellx].player = playerturn
        break
      }
    }


    setSquares(squares1)  
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
      if (linelength === 4) {
        win = true;
        console.log("Player " + playerturn + " wins!");

      }
    }
    return win;
  }
  return (
    <div class="board" onMouseLeave={onLeave}> {
    // <div onMouseLeave={RemoveHovers}  > {
      squares.map((row,y) => {
        return <div>{
          row.map((cell,x) => {
                return <Square 
              player={cell.player} hover={cell.hover} onSquareClick={(()=>{handleClick(x,y)})}  Enter={(()=>{onEnter(x,y)})}>  
              </Square>
        })
      }</div>})
  } </div>
  )

}
