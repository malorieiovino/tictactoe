import streamlit as st
import numpy as np

# Initialize the Tic Tac Toe board
def initialize_board():
    return [" "] * 9

# Display the board
def display_board(board):
    board_html = ""
    for i in range(3):
        row = board[i*3:(i+1)*3]
        board_html += f"<p style='font-size:24px; text-align:center;'>{' | '.join(row)}</p>"
        if i < 2:
            board_html += "<p style='text-align:center;'>-----------</p>"
    return board_html

# Check for a winner
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

# Find the best move for AI
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

st.markdown(display_board(st.session_state.board), unsafe_allow_html=True)

# Check if there's a winner
if st.session_state.winner:
    st.success(f"Game Over! {st.session_state.winner} wins!" if st.session_state.winner != "Draw" else "It's a draw!")
else:
    # Display buttons for each move
    cols = st.columns(3)
    for i in range(9):
        row, col = divmod(i, 3)
        with cols[col]:
            if st.session_state.board[i] == " " and st.session_state.winner is None:
                if st.button(f"{i+1}", key=i):
                    st.session_state.board[i] = "X"
                    st.session_state.turn = "O"
                    # Check for winner
                    winner = check_winner(st.session_state.board)
                    if winner:
                        st.session_state.winner = winner
                    elif " " not in st.session_state.board:
                        st.session_state.winner = "Draw"

    # AI Move
    if st.session_state.turn == "O" and st.session_state.winner is None:
        ai_move = best_move(st.session_state.board)
        if ai_move is not None:
            st.session_state.board[ai_move] = "O"
            st.session_state.turn = "X"
            # Check for winner
            winner = check_winner(st.session_state.board)
            if winner:
                st.session_state.winner = winner
            elif " " not in st.session_state.board:
                st.session_state.winner = "Draw"

st.button("Restart Game", on_click=lambda: [st.session_state.update({"board": initialize_board(), "turn": "X", "winner": None})])
