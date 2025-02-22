const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Load scores from localStorage
let playerWins = localStorage.getItem("playerWins") ? parseInt(localStorage.getItem("playerWins")) : 0;
let aiWins = localStorage.getItem("aiWins") ? parseInt(localStorage.getItem("aiWins")) : 0;

// Update scoreboard display
document.getElementById("player-score").textContent = playerWins;
document.getElementById("ai-score").textContent = aiWins;

// Winning patterns
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Function to check for a winner
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

// Function to handle player move
function handlePlayerMove(index) {
    if (gameBoard[index] === "" && gameActive) {
        gameBoard[index] = "X";
        cells[index].textContent = "X";

        let winner = checkWinner();
        if (winner) {
            updateScore(winner);
            setTimeout(() => alert(`${winner} Wins!`), 100);
            return;
        }

        setTimeout(() => aiMove(), 400);
    }
}

// AI Move Function (based on difficulty selection)
function aiMove() {
    if (!gameActive) return;

    let move = bestMove();
    if (move !== undefined && move !== null) {
        gameBoard[move] = "O";
        cells[move].textContent = "O";
    }

    let winner = checkWinner();
    if (winner) {
        updateScore(winner);
        setTimeout(() => alert(`${winner} Wins!`), 100);
        gameActive = false;
    }
}

// Function to determine AI move based on difficulty
function bestMove() {
    let difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        return randomMove();  // AI picks random move
    } else if (difficulty === "medium") {
        return Math.random() < 0.5 ? minimaxMove() : randomMove(); // 50% chance of random move
    } else {
        return minimaxMove();  // Always uses Minimax
    }
}

// Random move function (Easy AI)
function randomMove() {
    let availableMoves = gameBoard.map((cell, index) => (cell === "" ? index : null)).filter(i => i !== null);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
}

// Minimax move function (Hard AI)
function minimaxMove() {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === "") {
            gameBoard[i] = "O";
            let score = minimax(gameBoard, false);
            gameBoard[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Minimax algorithm (AI decision-making)
function minimax(board, isMaximizing) {
    let result = checkWinner();
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

// Function to update score
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
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    gameActive = true;
});

// Attach event listeners to all cells
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        handlePlayerMove(cell.getAttribute("data-index"));
    });
});

