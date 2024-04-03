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

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
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
  
  return (
    <>
      <div className="board">
        {Array(y)
          .fill(null)
          .map((_, rowIndex) => (
            <div className="board-row" key={rowIndex}>
              {Array(x)
                .fill(null)
                .map((_, colIndex) => {
                  const index = rowIndex * x + colIndex;
                  return (
                    <Square
                      key={index}
                      color={squares[index]}
                      onSquareClick={() => handleClick(index)}
                    />
                  );
                })}
            </div>
          ))}
      </div>
    </>
  );
}




function checkWin() {
    function diagonal(deltaX, deltaY) {
      for(let i = 0; i < 4; i++) {
        let x = (col+(i*deltaX))
        let y = (newRow+(i*deltaY))
        if(x < 0 || x >= xSize) return false;
        if(y < 0 || y >= ySize) return false;
        if(nextSquares[y][x] != played) return false;
      }
      return true;
    }

    function horizontal(delta) {
      return diagonal(delta, 0)
    }

    function vertical(delta) {
      return diagonal(0, delta)
    }      

    let wonHorizontal = (horizontal(1) || horizontal(-1))
    let wonVertical = (vertical(1) || vertical(-1))

    let wonDiagonal = diagonal(-1, -1) || diagonal(-1, 1) || diagonal(1, 1) || diagonal(1, -1)
    return (wonHorizontal || wonVertical || wonDiagonal)
  } 