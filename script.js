const game = [
  null, null, null,
  null, null, null,
  null, null, null
];
const player = 'X';
const ai = 'O';

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', async () => {
    const index = cell.getAttribute('data-index');
    if (game[index] === null) {
      await makeMove(index, player);
      if (!checkWin(game, player) && !checkDraw(game)) {
        await makeMove(findBestMove(game), ai);
      }
    }
  });
});

const displayBoard = async () => {
  document.querySelectorAll('.cell').forEach(cell => {
    const index = cell.getAttribute('data-index');
    cell.textContent = game[index];
    cell.classList.remove('winning-cell');
  });
}

const makeMove = async (position, player) => {
  game[position] = player;
  await displayBoard();
  const winningLine = checkWin(game, player);
  if (winningLine) {
    highlightWinningLine(winningLine);
    await new Promise(resolve => setTimeout(resolve, 100));
    await alert(`${player} wins!`);
    resetGame();
  } else if (checkDraw(game)) {
    await alert("It's a draw!");
    resetGame();
  }
}

const checkWin = (board, player) => {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let condition of winConditions) {
    if (condition.every(index => board[index] === player)) {
      return condition;
    }
  }
  return null;
}

const checkDraw = (board) => {
  return board.every(cell => cell !== null);
}

const minimax = (board, depth, isMaximizing) => {
  if (checkWin(board, ai)) return 10 - depth;
  if (checkWin(board, player)) return depth - 10;
  if (checkDraw(board)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = ai;
        let eval = minimax(board, depth + 1, false);
        board[i] = null;
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = player;
        let eval = minimax(board, depth + 1, true);
        board[i] = null;
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
}

const findBestMove = (board) => {
  let bestMove = -1;
  let bestValue = -Infinity;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = ai;
      let moveValue = minimax(board, 0, false);
      board[i] = null;
      if (moveValue > bestValue) {
        bestMove = i;
        bestValue = moveValue;
      }
    }
  }
  return bestMove;
}

const highlightWinningLine = (line) => {
  line.forEach(index => {
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.classList.add('winning-cell');
  });
}

const resetGame = () => {
  game.fill(null);
  displayBoard();
}
