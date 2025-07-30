import React, { useState, useEffect } from 'react';
import './App.css';

// --- Color theme constants ---
const COLOR_PRIMARY = '#1976d2';   // Blue
const COLOR_ACCENT = '#ff4081';    // Pink
const COLOR_SECONDARY = '#ffffff'; // White

// --- Utility function to determine winner ---
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
};

// Square component (stateless button)
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        backgroundColor: highlight ? COLOR_ACCENT : COLOR_SECONDARY,
        color: value === 'X' ? COLOR_PRIMARY : COLOR_ACCENT,
        borderColor: highlight ? COLOR_ACCENT : '#ddd'
      }}
      aria-label={value ? `Cell: ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

// GameBoard component: shows whole 3x3 grid
function GameBoard({ squares, onSquareClick, winningLine }) {
  // Helper for checking highlight
  const isHighlight = (i) => winningLine && winningLine.includes(i);
  return (
    <div className="ttt-board">
      {Array(3).fill(null).map((_, row) => (
        <div className="ttt-board-row" key={row}>
          {Array(3).fill(null).map((_, col) => {
            const i = row * 3 + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onClick={() => onSquareClick(i)}
                highlight={isHighlight(i)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Gets indices of the winning line (or null)
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // State for game board ("X", "O" or null)
  const [squares, setSquares] = useState(Array(9).fill(null));
  // State: X goes first
  const [xIsNext, setXIsNext] = useState(true);
  // State for tracking winner/highlights (determined after each move)
  const winner = calculateWinner(squares);
  const winningLine = getWinningLine(squares);
  const isDraw = !winner && squares.every(Boolean);

  // For status display
  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? 'Player 1 (X)' : 'Player 2 (O)'}`;
  } else if (isDraw) {
    status = "It's a Draw!";
  } else {
    status = `Next Turn: ${xIsNext ? 'Player 1 (X)' : 'Player 2 (O)'}`;
  }

  // Handle user clicking a square
  // PUBLIC_INTERFACE
  const handleSquareClick = (i) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // Modern light responsive styling, state centering via flexbox
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: COLOR_SECONDARY,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        className="ttt-container"
        style={{
          background: "#f6f9fc",
          borderRadius: "24px",
          padding: "32px 24px",
          boxShadow: "0 8px 32px rgba(25, 118, 210, 0.12)",
          maxWidth: "350px",
          width: "100%",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Status Display */}
        <div
          className="ttt-status"
          style={{
            textAlign: "center",
            color: winner ? COLOR_ACCENT : COLOR_PRIMARY,
            fontWeight: 700,
            fontSize: "1.25rem",
            marginBottom: "24px",
            minHeight: "2.5em"
          }}
        >
          {status}
        </div>
        {/* Game Board */}
        <GameBoard
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        {/* Control Buttons */}
        <div className="ttt-controls" style={{ marginTop: "28px", width: "100%" }}>
          <button
            type="button"
            onClick={handleRestart}
            className="ttt-restart-btn"
            style={{
              background: COLOR_PRIMARY,
              color: COLOR_SECONDARY,
              border: "none",
              borderRadius: "8px",
              padding: "12px 0",
              fontWeight: 600,
              fontSize: "1rem",
              width: "100%",
              margin: "0 auto",
              boxShadow: "0 1px 4px rgba(25, 118, 210, 0.1)",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            aria-label="Restart Game"
          >
            Restart Game
          </button>
        </div>
        {/* Players Display */}
        <div
          className="ttt-players-row"
          style={{ display: "flex", justifyContent: "center", marginTop: "18px", fontSize: ".98rem" }}
        >
          <span
            style={{
              color: COLOR_PRIMARY,
              fontWeight: xIsNext ? 700 : 400,
              marginRight: 16,
              borderBottom: xIsNext && !winner && !isDraw ? `2px solid ${COLOR_PRIMARY}` : "none"
            }}
          >
            Player 1 (X)
          </span>
          <span
            style={{
              color: COLOR_ACCENT,
              fontWeight: !xIsNext ? 700 : 400,
              borderBottom: !xIsNext && !winner && !isDraw ? `2px solid ${COLOR_ACCENT}` : "none"
            }}
          >
            Player 2 (O)
          </span>
        </div>
      </div>
      {/* Small credits row below container */}
      <div style={{ marginTop: "32px", color: "#aaa", fontSize: "0.93rem" }}>
        Interactive Tic Tac Toe – React Demo
      </div>
    </div>
  );
}

export default App;
