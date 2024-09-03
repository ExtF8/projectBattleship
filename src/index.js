import Game from './modules/classes/Game.js';

import { convertCoordinatesToIndices, convertCoordinatesFromIndices } from './utility/utils.js';

import {
    updateButtonLabel,
    updateRandomButtonState,
    resetGameboardVisuals,
    displayPlacedRandomShips,
    renderGameboard,
    updateWinner,
    updateCellUI,
    updatePlayerOneScore,
    updatePlayerTwoScore,
    updatePlayerOneShipsStats,
    updatePlayerTwoShipsStats,
} from './modules/dom/gameUi.js';

const gameStateButton = document.getElementById('gameStateToggle');
const randomizeShips = document.getElementById('randomPlacement');
const playerOneGameboard = document.getElementById('playerOneGameboard');
const playerTwoGameboard = document.getElementById('playerTwoGameboard');

export let GAME;

function initGame() {
    GAME = new Game();
    GAME.initializeGame();

    GAME.playerOne.gameboard.placeShipsRandomly(GAME.playerOneShips);
    GAME.playerTwo.gameboard.placeShipsRandomly(GAME.playerTwoShips);

    renderGameboard(GAME.playerOne.gameboard.grid, playerOneGameboard);
    renderGameboard(GAME.playerTwo.gameboard.grid, playerTwoGameboard);

    // Initialize Game Button State
    updateButtonLabel();

    return GAME;
}

initGame();

gameStateButton.addEventListener('click', toggleGameState);
randomizeShips.addEventListener('click', displayPlacedRandomShips);

function toggleGameState() {
    if (GAME.hasGameStarted) {
        quitGame(); // If the game has already started, quit it
    } else if (GAME.isGameOver) {
        endCurrentGame();
    } else {
        startGame(); // Otherwise, start a new game
    }
}

// Function to start the game
function startGame() {
    if (GAME.isGameOver) {
        endCurrentGame();
    }

    console.log('Starting game...');
    GAME.startGame();

    // Enable clicks only on Player Two's board
    manageCellEvents(true);

    // Disable ship randomization when the game is in progress
    randomizeShips.removeEventListener('click', displayPlacedRandomShips);

    updateButtonLabel();
    updateRandomButtonState();
}

function areYouSureToQuitGame() {
    // Show confirmation dialog
    const confirmEndGame = window.confirm(
        `This will reset all progress.\nAre you sure you want to end the game?`
    );

    return confirmEndGame;
}

// Function to end the game
function quitGame() {
    // If player cancels the confirmation, return early and do nothing
    if (!areYouSureToQuitGame()) {
        return;
    }

    endCurrentGame();
}

function endCurrentGame() {
    console.log('Ending game...');
    GAME.endGame();

    // Disable cell clicks as the game is no longer active
    manageCellEvents(false);

    displayPlacedRandomShips();
    updateButtonLabel();
    updateRandomButtonState();
    GAME.resetGame();

    initGame();

    // Re-enable the random ship placement button
    randomizeShips.addEventListener('click', displayPlacedRandomShips);

    // Reset the game board visually if you want to clear hits, misses, etc.
    resetGameboardVisuals(playerOneGameboard, 'playerOneShips');
    resetGameboardVisuals(playerTwoGameboard, 'playerTwoShips');
}

export function manageCellEvents(enable) {
    const cells = playerTwoGameboard.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (enable) {
            cell.addEventListener('click', cellClickHandler);
        } else {
            cell.removeEventListener('click', cellClickHandler);
        }
    });
}

function cellClickHandler(event) {
    const cell = event.currentTarget;
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    // Ensure that the cell is only clickable once per turn
    if (cell.classList.contains('marked') || GAME.isGameOver) {
        return;
    }

    handleAttack(col, row, playerTwoGameboard);
}

function handleAttack(col, row, gridElement) {
    const [x, y] = convertCoordinatesFromIndices([col, row]);

    GAME.takeTurn([x, y]);

    updateCellUI(col, row, gridElement);
    updatePlayerOneScore();
    updatePlayerTwoShipsStats(col, row);

    manageCellEvents(false);

    // Check if the game is over after the player one attack
    if (GAME.currentTurn === GAME.playerOne) {
        if (checkForWin()) {
            return;
        }
    }

    togglePlayerTurnState(gridElement, true);

    setTimeout(() => {
        handleComputerAttack(gridElement);
    }, 1000);
}

function handleComputerAttack(gridElement) {
    togglePlayerTurnState(gridElement, false);
    // Handle the computer's turn, which happens inside takeTurn()
    const lastComputerAttack = GAME.playerTwo.attackHistory.slice(-1)[0]; // Get last attack result

    if (lastComputerAttack) {
        const [computerCol, computerRow] = convertCoordinatesToIndices(
            lastComputerAttack.coordinates
        );
        updatePlayerOneShipsStats(computerCol, computerRow);
        // Update Player One's board UI after the computer's attack
        updateCellUI(computerCol, computerRow, playerOneGameboard);
        updatePlayerTwoScore();
    }

    if (checkForWin()) {
        return;
    }

    manageCellEvents(true);
}

function checkForWin() {
    if (GAME.isGameOver) {
        updateWinner();

        return true;
    }
    return false;
}

function togglePlayerTurnState(gridElement, isWaiting) {
    const cells = [...gridElement.childNodes];

    cells.forEach(cell => {
        if (cell.classList.contains('cell')) {
            cell.classList.toggle('waitTurn', isWaiting);
        }
    });
}
