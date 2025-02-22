const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");

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

// AI Move Function
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

// Function to pick AI move
function bestMove() {
    let availableMoves = gameBoard.map((cell, index) => (cell === "" ? index : null)).filter(i => i !== null);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
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

