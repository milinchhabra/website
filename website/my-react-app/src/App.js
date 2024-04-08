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
  const [xIsNext, setXIsNext] = useState(true);
  const [x, y] = [7, 6]; // Define dimensions here
  const [squares, setSquares] = useState(Array(x * y).fill(null));


  function handleClick(cellx,celly) {
    let squares1 = JSON.parse(JSON.stringify(squares))
    let bottomrow = 5
    for(let i = 5;i >= 0; i--) {
      console.log(squares1,i,cellx)
      if (squares1[i][cellx] == null) {
      bottomrow=i
      break
      }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'Yellow' : 'Red';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    
    const winner = calculateWinner(nextSquares);
    if (winner) {
      // Do something when there's a winner, such as displaying a message or preventing further moves
      console.log(`Player ${winner} wins!`);
    }
  }
  
  // function checkMouseCoordinates(event) {
  //   const coordinates = { x: event.clientX, y: event.clientY };
  // //   for (squares){
  // //     if (rowIndex == 1) {
  //       <Circle color="yellow" />
  //     }
  //   }




  return (
    <div> {
      squares.map((row,y) => {
        return <div>{
          row.map((cell,x) => {
            if (cell !== null) {

    function horizontal(delta) {
      return diagonal(delta, 0)
    }
            else {
              return <Square onSquareClick={(()=>{handleClick(x,y)})}></Square>
            }

    let wonHorizontal = (horizontal(1) || horizontal(-1))
    let wonVertical = (vertical(1) || vertical(-1))

    let wonDiagonal = diagonal(-1, -1) || diagonal(-1, 1) || diagonal(1, 1) || diagonal(1, -1)
    return (wonHorizontal || wonVertical || wonDiagonal)
  } 