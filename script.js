const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Winning patterns
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            return gameBoard[a];
        }
    }
    return gameBoard.includes("") ? null : "draw";
}

function handlePlayerMove(index) {
    if (gameBoard[index] === "" && gameActive) {
        gameBoard[index] = "X";
        cells[index].textContent = "X";

        let winner = checkWinner();
        if (winner) {
            setTimeout(() => alert(`${winner} Wins!`), 100);
            return;
        }

        setTimeout(() => aiMove(), 400);
    }
}

function aiMove() {
    if (!gameActive) return;

    let move = bestMove();
    if (move !== undefined && move !== null) {
        gameBoard[move] = "O";
        cells[move].textContent = "O";
    }

    let winner = checkWinner();
    if (winner) {
        setTimeout(() => alert(`${winner} Wins!`), 100);
        gameActive = false;
    }
}

function bestMove() {
    let availableMoves = gameBoard.map((cell, index) => (cell === "" ? index : null)).filter(i => i !== null);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
}

restartBtn.addEventListener("click", () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    gameActive = true;
});

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        handlePlayerMove(cell.getAttribute("data-index"));
    });
});
