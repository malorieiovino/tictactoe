import streamlit as st
import numpy as np

# Function to initialize the game board
def initialize_board():
    return [" "] * 9

# Function to check for a winner
def check_winner(board):
    win_patterns = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),  # Rows
        (0, 3, 6), (1, 4, 7), (2, 5, 8),  # Columns
        (0, 4, 8), (2, 4, 6)              # Diagonals
    ]
    for a, b, c in win_patterns:
        if board[a] == board[b] == board[c] and board[a] != " ":
            return board[a]
    return None

# Minimax Algorithm for AI
def minimax(board, is_maximizing):
    winner = check_winner(board)
    if winner == "O":
        return 1
    elif winner == "X":
        return -1
    elif " " not in board:
        return 0  # Draw

    if is_maximizing:
        best_score = -np.inf
        for i in range(9):
            if board[i] == " ":
                board[i] = "O"
                score = minimax(board, False)
                board[i] = " "
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = np.inf
        for i in range(9):
            if board[i] == " ":
                board[i] = "X"
                score = minimax(board, True)
                board[i] = " "
                best_score = min(score, best_score)
        return best_score

# Function to find the best AI move
def best_move(board):
    best_score = -np.inf
    move = None
    for i in range(9):
        if board[i] == " ":
            board[i] = "O"
            score = minimax(board, False)
            board[i] = " "
            if score > best_score:
                best_score = score
                move = i
    return move

# Streamlit UI
st.title("Tic Tac Toe - Play Against AI")

# Initialize session state
if "board" not in st.session_state:
    st.session_state.board = initialize_board()
if "turn" not in st.session_state:
    st.session_state.turn = "X"
if "winner" not in st.session_state:
    st.session_state.winner = None
if "clicked_index" not in st.session_state:
    st.session_state.clicked_index = None  # Track clicked cell

# CSS for proper grid layout
st.markdown(
    """
    <style>
    .tictactoe-container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
    .tictactoe-grid {
        display: grid;
        grid-template-columns: 100px 100px 100px;
        gap: 5px;
        justify-content: center;
    }
    .cell {
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        font-weight: bold;
        border: 3px solid white;
        background-color: black;
        color: white;
        font-family: Arial, sans-serif;
        cursor: pointer;
    }
    .cell:hover {
        background-color: #333;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Show player turn
st.write(f"### Your Turn: {'X (You)' if st.session_state.turn == 'X' else 'O (AI)'}")

# Create a 3x3 Tic Tac Toe grid
clicked_index = None
grid = [[" " for _ in range(3)] for _ in range(3)]

# Use Streamlit columns for a structured 3x3 board
cols = st.columns(3)
for row in range(3):
    for col in range(3):
        index = row * 3 + col
        with cols[col]:
            if st.session_state.board[index] == " " and st.session_state.winner is None:
                if st.button(" ", key=f"move_{index}"):  
                    clicked_index = index  # Capture the clicked cell
            else:
                st.markdown(f"<div class='cell'>{st.session_state.board[index]}</div>", unsafe_allow_html=True)

# Handle player move (if a cell was clicked)
if clicked_index is not None and st.session_state.board[clicked_index] == " ":
    st.session_state.board[clicked_index] = "X"
    st.session_state.turn = "O"

# AI Move (automatically after player)
if st.session_state.turn == "O" and st.session_state.winner is None:
    ai_move = best_move(st.session_state.board)
    if ai_move is not None:
        st.session_state.board[ai_move] = "O"
        st.session_state.turn = "X"

# Check for winner
if check_winner(st.session_state.board):
    st.session_state.winner = check_winner(st.session_state.board)
elif " " not in st.session_state.board:
    st.session_state.winner = "Draw"

# Show game status
if st.session_state.winner:
    if st.session_state.winner == "Draw":
        st.warning("It's a Draw!")
    else:
        st.success(f"{st.session_state.winner} Wins!")

# Restart button
if st.button("Restart Game"):
    st.session_state.board = initialize_board()
    st.session_state.turn = "X"
    st.session_state.winner = None


