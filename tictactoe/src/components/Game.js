import React, { useState } from 'react';
import Board from './Board';
import axios from "axios";

function Game() {
    const [history, setHistory] = useState([{squares: Array(9).fill(null)}]);
    const [xNext, setXNext] = useState(true);
    const [stepNum, setStepNum] = useState(0);
    const [winners, setWinners] = useState([]);
    const [gameDone, setGameDone] = useState(false);

    const newHistory = history;
    const current = newHistory[stepNum];
    const winner = calculateWinner(current.squares);

    window.addEventListener('load', function() {
      refreshList();
    });

    function handleWinners(obj) {
      setWinners(obj);
    }

    function refreshList() {
      axios
        .get("/api/todos/")
        .then((res) => handleWinners(res.data));
    };

    const winnerList = winners.map((curr) => {
      if (curr.id % 2 === 0) {
        return (
          <tr>
            <td className="datum">{curr.id / 2}</td>
            <td className="datum">{curr.title}</td>
          </tr>
        );
      }
    });

    const moves = history.map((step, move) => {
        const desc = move ?
          'Move #' + move :
          'Game Start';
        return (
          <p >
            <div className="white">
            <button onClick={() => jumpTo(move)}>{desc}</button>
            </div>
          </p>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (xNext ? 'X' : 'O');
    }

    function handleClick(i) {
        const newHistory = history.slice(0, stepNum + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = xNext ? 'X' : 'O';
        setHistory(history.concat([{ squares: squares }]));
        setStepNum(history.length);
        setXNext(!xNext);
    }

    function jumpTo(step) {
        setStepNum(step);
        setXNext((step % 2) === 0);
        setHistory(history.slice(0, step + 1));
    }

    function restartBoard() {
      jumpTo(0);
      setGameDone(false);
      setHistory(history.slice(0, 1));
    }

    return (
      <div className="app-face">
        <div className="game">
          <div className="center">
          <div className="game-list">
            <table classNamme="game-table">
              <tr >
                <th className="datum">Game</th>
                <th className="datum">Winner</th>
              </tr>
              { winnerList }
            </table>
          </div>
          <div className="game-board">
            <div className="game-header">{ status }</div>
            <Board
              squares={current.squares}
              onClick={(i) => handleClick(i)}
            />
            <button className="game-footer" onClick={() => restartBoard()}>New Game</button>
          </div>
          <div className="game-info">
              Moves
              { moves }
          </div>    
          </div>    
        </div>
        </div>
  );

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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        if (!gameDone) {
          setGameDone(true);
          addWinner(squares[a]);
          
        }
        return squares[a];
      }
    }
    return null;
  }

  function addWinner(name) {
    const testPost = { 'title': name, 'description': 'test desc', 'completed': false };
      axios
      .post("/api/todos/", testPost)
      .then((res) => refreshList())
      .catch((err) => console.log(err));
  }
  
}

export default Game;