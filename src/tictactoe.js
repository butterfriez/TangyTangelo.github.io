const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restart");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const slider = document.getElementById("difficultySlider");
const output = document.getElementById("titleDifficulty");
const AIPlayer = "O";
const HumanPlayer = "X";


let mainBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameRunning = false;
let scores = {
    X: 10,
    O: -10,
    tie: 0
};

//Basic Game
function initGame() {
    cells.forEach((cell) => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    gameRunning = true;
    setGametype(localStorage.getItem('gametype'));
    initTitle();
}

function initTitle() {
    if(getGametype() === 'Player') output.innerText = '2 Players';
    else if(getGametype() === 'Brainless AI') output.innerText = 'Brainless AI';
    else if(getGametype() === 'Smart AI') output.innerText = 'Smart AI';
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (mainBoard[cellIndex] !== "" || !gameRunning) {
        return;
    }

    updateCell(this, cellIndex);
}

function updateCell(cell, index) {
    mainBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (isGameOver(mainBoard)) {
        gameRunning = false;
        cells.forEach((cell) => cell.removeEventListener("click", cellClicked));
        statusText.textContent = `${currentPlayer} wins!`;
    } else if (!mainBoard.includes("")) {
        gameRunning = false;
        currentPlayer = 'tie'
        statusText.textContent = "Draw!";
    } else {
        changePlayer();
        continueGameMode();
    }
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function getGametype() {
    switch (Number(slider.value)) {
        case 1:
            return 'Player';
        case 2:
            return 'Brainless AI';
        case 3:
            return 'Smart AI';
    }
}

function isGameOver(board) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    currentPlayer = "X";
    mainBoard = ["", "", "", "", "", "", "", "", ""];
    gameRunning = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach((cell) => (cell.textContent = ""));
    cells.forEach((cell) => cell.addEventListener("click", cellClicked));
}

//AI
function continueGameMode() {
    if (getGametype() === 'Brainless AI') {
        if (currentPlayer === AIPlayer) {
            randomAIMove();
        }
    } else if (getGametype() === 'Smart AI') {
        if (currentPlayer === AIPlayer) {
            makeAIMove();
        }
    }
}

function setGametype(value) {
    slider.value = value;
}

function makeAIMove() {
    let bestMove = getBestMove([...mainBoard]);
    updateCell(cells[bestMove], bestMove);
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let bestMoves = []
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = AIPlayer;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score == bestScore) {
                bestMoves.push(i)
            } else if (score > bestScore) {
                bestScore = score;
                bestMoves = [i]
            }
        }
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}


function randomAIMove() {
    let available = [];
    for (let i = 0; i < 9; i++) {
        if (mainBoard[i] === "") {
            available.push(i);
        }
    }
    let value = available[Math.floor(Math.random() * available.length)];
    updateCell(cells[value], value);
}

function minimax(board, depth, isMaximizingPlayer) {
    const result = isGameOver(board);
    if (result) {
        return scores[currentPlayer];
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = AIPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore - depth;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = HumanPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore + depth;
    }
}

slider.oninput = function () {
    restartGame();
    initTitle();
    saveGametype();
};

initGame();