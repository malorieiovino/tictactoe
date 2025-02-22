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

# Create a proper grid layout
st.markdown(
    """
    <style>
    .tictactoe-grid {
        display: grid;
        grid-template-columns: 100px 100px 100px;
        grid-gap: 5px;
        justify-content: center;
    }
    .cell {
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        border: 2px solid white;
        background-color: #1E1E1E;
        color: white;
        font-family: Arial, sans-serif;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Display the board as a structured grid
st.write("### Your Turn: " + ("X (You)" if st.session_state.turn == "X" else "O (AI)"))

board_html = "<div class='tictactoe-grid'>"
for i in range(9):
    if st.session_state.board[i] == " " and st.session_state.winner is None:
        # Clicking on an empty cell places X
        if st.button(" ", key=i):
            st.session_state.board[i] = "X"
            st.session_state.turn = "O"
    board_html += f"<div class='cell'>{st.session_state.board[i]}</div>"
board_html += "</div>"

st.markdown(board_html, unsafe_allow_html=True)

# Check for winner
if check_winner(st.session_state.board):
    st.session_state.winner = check_winner(st.session_state.board)
elif " " not in st.session_state.board:
    st.session_state.winner = "Draw"

# AI Move (immediately after player's turn)
if st.session_state.turn == "O" and st.session_state.winner is None:
    ai_move = best_move(st.session_state.board)
    if ai_move is not None:
        st.session_state.board[ai_move] = "O"
        st.session_state.turn = "X"

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

