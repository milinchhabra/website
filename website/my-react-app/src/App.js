import React, { useState } from 'react';

function Square({ color, onSquareClick }) {
  return (
    <button onClick={onSquareClick} className="square">
      <Circle color={color} />
    </button>
  );
}

function Circle({ color }) {
  return <div className="circle" style={{ backgroundColor: color }}></div>;
}


export default function Board() {
  const [x, y] = [7, 6];
  const [squares, setSquares] = useState(Array(y).fill(null).map(()=>new Array(x).fill(null)));


  function handleClick(cellx,celly) {
    let squares1 = JSON.parse(JSON.stringify(squares))
    let bottomrow = 5
    for(let i = 5;i >= 0; i--) {
      console.log(squares1,i,cellx)
      if (squares1[i][cellx] == null) {
      bottomrow=i
      break
      }
    }
    squares1[bottomrow][cellx] = 1
    setSquares(squares1)  
    console.log('clicked')
  }
  
  // function checkMouseCoordinates(event) {
  //   const coordinates = { x: event.clientX, y: event.clientY };
  // //   for (squares){
  // //     if (rowIndex == 1) {
  //       <Circle color="yellow" />
  //     }
  //   }

  // }

  // document.addEventListener('mousemove', checkMouseCoordinates);

  
  return (
    <div> {
      squares.map((row,y) => {
        return <div>{
          row.map((cell,x) => {
            if (cell !== null) {

              return <Square color= 'yellow'></Square>
            }
            else {
              return <Square onSquareClick={(()=>{handleClick(x,y)})}></Square>
            }
        })
      }</div>
      })
  } </div>
  )

}