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
const maxDepth = 7;

let mainBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let AIPlayer = "O";
let HumanPlayer = "X";
let gameRunning = false;
let minimaxStep;
let scores = {
    X: 10,
    O: -10,
    tie: 0
};

function initGame() {
    cells.forEach((cell) => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    gameRunning = true;
    minimaxStep = 0;
    setGametype(localStorage.getItem('gametype'));
    initTitle();
}

function initTitle() {
    if(getGametype() === 'Player') output.innerText = '2 Players';
    else if(getGametype() === 'Brainless AI') output.innerText = 'Brainless AI';
    else if(getGametype() === 'Smart AI') output.innerText = 'Smart AI';
}

function setGametype(value) {
    slider.value = value;
}

function saveGametype() {
    localStorage.setItem('gametype', slider.value);
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

    if (checkWinner(mainBoard)) {
        gameRunning = false;
        cells.forEach((cell) => cell.removeEventListener("click", cellClicked));
        statusText.textContent = `${currentPlayer} wins!`;
    } else if (!mainBoard.includes("")) {
        gameRunning = false;
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

function checkWinner(board) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            return true;
        }
    }
    return false;
}

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

function makeAIMove() {
    let bestMove = getBestMove();
    updateCell(cells[bestMove], bestMove);
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < mainBoard.length; i++) {
        if (mainBoard[i] === "") {
            mainBoard[i] = AIPlayer;
            let score = minimax(mainBoard, 0, false);
            mainBoard[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function restartGame() {
    currentPlayer = "X";
    mainBoard = ["", "", "", "", "", "", "", "", ""];
    minimaxStep = 0;
    gameRunning = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach((cell) => (cell.textContent = ""));
    cells.forEach((cell) => cell.addEventListener("click", cellClicked));
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
    let result = checkWinner(board);
    if (result) {
        return scores[currentPlayer];
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = AIPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = HumanPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

slider.oninput = function (e) {
    restartGame();
    initTitle();
    saveGametype();
};

initGame();
