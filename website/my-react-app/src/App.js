import React, { useState } from 'react';

function Square({ color, onSquareClick, Enter}) {
  return (
    <button
    onClick={onSquareClick}
    onMouseEnter={Enter}
    className="square">
    <Circle color= {color}/>

    
    </button>
  );
}

function Circle({ color },{hover}) {
  return <div className={`circle ${color}`} ></div>;
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
  console.log(squares)

  
  function handleClick(cellx,celly) {
    let squares1 = structuredClone(squares)
    let bottomrow = 5
    for(let i = 5;i >= 0; i--) {
      if (squares1[i][cellx].player == null||squares1[i][cellx].hover === true) {
        bottomrow=i
      break
      }
    }
    squares1[bottomrow][cellx].player = 'p1'
    squares1[bottomrow][cellx].color = 'yellow'
    squares1[bottomrow][cellx].hover = false



    setSquares(squares1)  
    console.log('clicked')
  }

  function onEnter(cellx,celly) {

    let squares1 = RemoveHovers()
    let bottomrow = 5
    
    for(let i = 5;i >= 0; i--) {
      if (squares1[i][cellx].player == null||squares1[i][cellx].hover === true) {
        bottomrow=i
        squares1[bottomrow][cellx].hover = true
        squares1[bottomrow][cellx].player = "p1"
        squares1[bottomrow][cellx].color = 'yellow'

        break
      }
    }


    setSquares(squares1)  
  }

  function RemoveHovers() {
    let squares1 = structuredClone(squares)

    for(let xi = 5;xi >= 0; xi--) {
      for(let yi = 6; yi >= 0; yi--) {
      if(squares1[xi][yi].hover === true ){
        squares1[xi][yi].player = null
        squares1[xi][yi].color = null
        squares1[xi][yi].hover = false

        console.log(squares1[xi][yi])
        console.log(squares[xi][yi])


       }
      }
    }
    return squares1 
  }

  return (
    // <div Leave={onLeave}> {
    <div> {

      squares.map((row,y) => {
        return <div>{
          row.map((cell,x) => {
            if (cell.player !== undefined) {
              console.log(cell.player)

                return <Square 
              color={cell.color} onSquareClick={(()=>{handleClick(x,y)})}  Enter={(()=>{onEnter(x,y)})}>  
              </Square>
            }
            else {
              return <Square
               onSquareClick={(()=>{handleClick(x,y)})}  Enter={(()=>{onEnter(x,y)})}>  
                </Square>
            }
        })
      }</div>
      })
  } </div>
  )

}