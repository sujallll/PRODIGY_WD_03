const statusDisplay = document.querySelector('.game--status');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex, callback) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    if (callback) {
        callback();
    }
}

function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] === currentPlayer && gameState[b] === currentPlayer && gameState[c] === currentPlayer) {
            return true;
        }
    }
    return false;
}

function handleResultValidation() {
    if (checkWin()) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();

    // AI's move after the user's move
    setTimeout(handleAIMove, 10000); // Adjust the delay as needed
}

function getRandomEmptyCell() {
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === "") {
            acc.push(index);
        }
        return acc;
    }, []);

    if (emptyCells.length === 0) {
        return null; // No empty cells
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

function handleAIMove() {
    if (!gameActive) {
        return;
    }

    const emptyCellIndex = getRandomEmptyCell();

    if (emptyCellIndex !== null) {
        const emptyCell = document.querySelector(`[data-cell-index="${emptyCellIndex}"]`);

        // Pass a callback to handleResultValidation
        handleCellPlayed(emptyCell, emptyCellIndex, handleResultValidation);
    }
}

function handleCellClick(clickedCellEvent) {
    // Human player's move
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // Pass a callback to handleResultValidation
    handleCellPlayed(clickedCell, clickedCellIndex, handleResultValidation);
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
