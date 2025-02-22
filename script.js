const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function checkWinner(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningCells([a, b, c]);  // Highlight winning cells
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

// Function to find the AI's best move
function bestMove() {
    let bestScore = -Infinity;
    let move;
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

// Player move
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        let index = cell.getAttribute("data-index");
        if (gameBoard[index] === "" && gameActive) {
            gameBoard[index] = "X";
            cell.textContent = "X";

            let winner = checkWinner(gameBoard);
            if (winner) {
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
                setTimeout(() => alert(`${winner} Wins!`), 100);
                gameActive = false;
            }
        }
    });
});

// Restart game
restartBtn.addEventListener("click", () => {
    gameBoard.fill("");
    cells.forEach(cell => cell.textContent = "");
    gameActive = true;
});

