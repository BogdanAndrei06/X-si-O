import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

function Square({ value, onSquareClick, disabled }) {
  return (
    <button
      className={`square ${value ? "filled" : ""}`}
      onClick={onSquareClick}
      disabled={disabled || value !== null}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, gameOver }) {
  function handleClick(i) {
    if (gameOver || calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `🏆 Câștigător: ${winner}`
    : gameOver
    ? "🤝 Egalitate!"
    : `👉 Următorul jucător: ${xIsNext ? "X" : "O"}`;

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            disabled={gameOver}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [autoResetMsg, setAutoResetMsg] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // ✅ Confetti full screen cu redimensionare automată
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winnerNow = calculateWinner(nextSquares);
    setWinner(winnerNow);

    if (winnerNow || !nextSquares.includes(null)) {
      setGameOver(true);
      setShowCelebration(true);
      setAutoResetMsg(true);

      // ✅ Reset automat după 4 secunde
      setTimeout(() => {
        resetGame();
        setAutoResetMsg(false);
      }, 4000);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setWinner(null);
    setGameOver(false);
    setShowCelebration(false);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(null);
    setGameOver(false);
    setShowCelebration(false);
  }

  const moves = history.map((_, move) => {
    const description = move ? `Mutarea #${move}` : "Începutul jocului";
    const isActive = move === currentMove;

    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={`move-btn ${isActive ? "active" : ""}`}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game-container">
      {showCelebration && (
        <>
          {/* 🎉 Confetti full-screen */}
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={800}
            gravity={0.3}
            recycle={false}
          />

          {/* 🎆 Artificii simple simulate */}
          <div className="fireworks">
            <div className="firework f1"></div>
            <div className="firework f2"></div>
            <div className="firework f3"></div>
          </div>

          <div className="celebration-message animate-pop">
            {winner ? `🎉 Felicitări, ${winner}!` : "🤝 Remiză!"}
          </div>
        </>
      )}

      {autoResetMsg && (
        <div className="auto-reset-msg">
          🔄 Se pregătește un joc nou...
        </div>
      )}

      <div className="game">
        <h1 className="title glow">✨ X și O Deluxe ✨</h1>

        <div className="game-layout">
          <div className={`game-board ${winner ? "winner-glow" : ""}`}>
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
              gameOver={gameOver}
            />
            {!gameOver && (
              <button className="reset-btn" onClick={resetGame}>
                🔁 Resetează manual
              </button>
            )}
          </div>

          <div className="game-info">
            <h3>Mutări:</h3>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
