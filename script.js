const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Load scores from localStorage
let playerWins = localStorage.getItem("playerWins") ? parseInt(localStorage.getItem("playerWins")) : 0;
let aiWins = localStorage.getItem("aiWins") ? parseInt(localStorage.getItem("aiWins")) : 0;

document.getElementById("player-score").textContent = playerWins;
document.getElementById("ai-score").textContent = aiWins;

// Function to check for a winner
function checkWinner(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningCells([a, b, c]);
            return board[a];
        }
    }
    return board.includes("") ? null : "draw";
}

// Function to highlight winning cells
function highlightWinningCells(cellsToHighlight) {
    cellsToHighlight.forEach(index => {
        cells[index].classList.add("win");
    });
}

// Minimax AI function
function minimax(board, isMaximizing) {
    let result = checkWinner(board);
    if (result === "X") return -1;
    if (result === "O") return 1;
    if (result === "draw") return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to make AI move based on difficulty
function bestMove() {
    let difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        return randomMove(); // AI picks random move
    } else if (difficulty === "medium") {
        return Math.random() < 0.5 ? minimaxMove() : randomMove(); // 50% chance of random move
    } else {
        return minimaxMove(); // Always uses Minimax
    }
}

// Random move function (used for easy AI)
function randomMove() {
    let availableMoves = gameBoard.map((cell, index) => (cell === "" ? index : null)).filter(i => i !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Minimax move function (hard AI)
function minimaxMove() {
    return minimax(gameBoard, false) !== null ? minimax(gameBoard, false) : randomMove();
}

// Player move
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        let index = cell.getAttribute("data-index");
        if (gameBoard[index] === "" && gameActive) {
            gameBoard[index] = "X";
            cell.textContent = "X";

            let winner = checkWinner(gameBoard);
            if (winner) {
                updateScore(winner);
                setTimeout(() => alert(`${winner} Wins!`), 100);
                gameActive = false;
                return;
            }

            let aiMove = bestMove();
            if (aiMove !== undefined) {
                gameBoard[aiMove] = "O";
                cells[aiMove].textContent = "O";
            }

            winner = checkWinner(gameBoard);
            if (winner) {
                updateScore(winner);
                setTimeout(() => alert(`${winner} Wins!`), 100);
                gameActive = false;
            }
        }
    });
});

// Function to update scores
function updateScore(winner) {
    if (winner === "X") {
        playerWins++;
        localStorage.setItem("playerWins", playerWins);
        document.getElementById("player-score").textContent = playerWins;
    } else if (winner === "O") {
        aiWins++;
        localStorage.setItem("aiWins", aiWins);
        document.getElementById("ai-score").textContent = aiWins;
    }
}

// Restart game
restartBtn.addEventListener("click", () => {
    gameBoard.fill("");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
    });
    gameActive = true;
});

// Dark Mode Toggle
let isDarkMode = localStorage.getItem("darkMode") === "true";
if (!isDarkMode) {
    document.body.classList.add("light-mode");
}

document.getElementById("toggle-theme").addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("light-mode");
    localStorage.setItem("darkMode", isDarkMode);
});
