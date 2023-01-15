const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restart");
const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7 ,8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
const sliderValue = document.getElementById("difficultySlider").value

var slider = document.getElementById("difficultySlider");
var output = document.getElementById("titleDifficulty");

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameRunning = false;

function initGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    gameRunning = true;
};
function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] != "" || !gameRunning) {
        return;
    };

    updateCell(this, cellIndex);
    checkWinner();
};
function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
};
function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
};
function checkWinner() {
    var roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        };
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        };
    };

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        cells.forEach(cell => cell.removeEventListener("click", cellClicked))
    } else if (!options.includes("")) {
        statusText.textContent = `draw!`;
        running = false;
    } else {
        changePlayer();
    }
};
function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
};

initGame();

document.getElementById("difficultySlider").value = "1";