import React, { useState } from 'react';

function Square({ color,hover, onSquareClick, Enter}) {
  return (
    <button
    onClick={onSquareClick}
    onMouseEnter={Enter}
    className="square">


    <div className={`circle ${hover ? `hover${color}` : color}`}></div>
    <div class='hole'></div>
    
    
    </button>
  );
}



class SqInfo {
  constructor(player, hover) { 
    this.player = player
    this.hover = hover
    this.color = null
   }
  
}


export default function Board() {
  const [x, y] = [7, 6];
  const tempsquares = [];
  for (let i = 0; i < y; i++) {
      tempsquares.push(new Array(x).fill(null).map(() => new SqInfo(null,false)));
  }
  const [squares, setSquares] = useState(tempsquares);
  const [playerturn, setPlayerTurn] = useState('p1')
  
  function getColor() {
    if (playerturn === "p1") {
      return "yellow"    
    }
    else if (playerturn === "p2") {
      return "red"    }    
  }

  function handleClick(cellx,celly) {
    let squares1 = structuredClone(squares)
    let bottomrow = 5
    for(let i = 5;i >= 0; i--) {
      if (squares1[i][cellx].player == null||squares1[i][cellx].hover === true) {
        bottomrow=i
      break
      }
    }
    squares1[bottomrow][cellx].player = playerturn
    squares1[bottomrow][cellx].hover = false
    squares1[bottomrow][cellx].color = getColor()

    setSquares(squares1)  



    if (playerturn === "p1") {
      setPlayerTurn("p2")
    }
    else {
      setPlayerTurn("p1")
    }
    console.log(playerturn)
  }

  function onEnter(cellx,celly) {

    let squares1 = RemoveHovers()
    let bottomrow = 5
    
    for(let i = 5;i >= 0; i--) {
      if (squares1[i][cellx].player == null||squares1[i][cellx].hover === true) {
        bottomrow=i
        squares1[bottomrow][cellx].hover = true
        squares1[bottomrow][cellx].player = playerturn
        squares1[bottomrow][cellx].color = getColor()


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
        squares1[xi][yi].color = null


       }
      }
    }
    return squares1 
  }

  return (
    <div class="board" onMouseLeave={onLeave}> {
    // <div onMouseLeave={RemoveHovers}  > {
      squares.map((row,y) => {
        return <div>{
          row.map((cell,x) => {
                return <Square 
              color={cell.color} hover={cell.hover} onSquareClick={(()=>{handleClick(x,y)})}  Enter={(()=>{onEnter(x,y)})}>  
              </Square>
        })
      }</div>})
  } </div>
  )

}