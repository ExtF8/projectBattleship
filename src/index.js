import Game from './modules/classes/Game.js';
import { Gameboard } from './modules/classes/Gameboard.js';
import { Ship } from './modules/classes/Ship.js';

const startGameButton = document.getElementById('startGame');
const randomizeShips = document.getElementById('randomPlacement');
const playerOneGameboard = document.getElementById('playerOneGameboard');
const playerTwoGameboard = document.getElementById('playerTwoGameboard');

const GAME = new Game();
GAME.initializeGame();

GAME.playerOne.gameboard.placeShipsRandomly(GAME.playerOneShips);
GAME.playerTwo.gameboard.placeShipsRandomly(GAME.playerTwoShips);

renderGameboard(GAME.playerOne.gameboard.grid, playerOneGameboard);
renderGameboard(GAME.playerTwo.gameboard.grid, playerTwoGameboard);

function startGame() {
    console.log('start game clicked');

    GAME.startGame();

    if (GAME.hasGameStarted) {
        startGameButton.innerText = 'End Game';
    } else {
        startGameButton.innerText = 'Start New Game';
    }

    randomizeShips.removeEventListener('click', displayPlacedRandomShips);
    manageCellEvents(true); // Allow clicks only on Player Two's board
}

startGameButton.addEventListener('click', startGame);

function displayPlacedRandomShips() {
    GAME.playerOne.gameboard.clearShips();
    GAME.playerTwo.gameboard.clearShips();
    GAME.shipManager.clearPositions();

    GAME.playerOne.gameboard.placeShipsRandomly(GAME.playerOneShips);
    GAME.playerTwo.gameboard.placeShipsRandomly(GAME.playerTwoShips);

    renderGameboard(GAME.playerOne.gameboard.grid, playerOneGameboard);
    renderGameboard(GAME.playerTwo.gameboard.grid, playerTwoGameboard);
}

randomizeShips.addEventListener('click', displayPlacedRandomShips);

function renderGameboard(grid, gridElement) {
    gridElement.innerHTML = ''; // Clear any existing content

    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');

            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;

            if (cell === null) {
                cellElement.classList.add('empty-cell');
            } else if (cell instanceof Ship) {
                cellElement.classList.add('ship-cell');
            }

            if (gridElement.id === 'playerTwoGameboard') {
                cellElement.classList.add('cell-PlayerTwo');
                cellElement.classList.remove('ship-cell');
            }

            gridElement.appendChild(cellElement);
        });
    });
}

function manageCellEvents(enable) {
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

    handleAttack(row, col, playerTwoGameboard);

    // Prevent repeated clicks on the same cell by removing the event listener
    cell.removeEventListener('click', cellClickHandler);
}

function handleAttack(row, col, gridElement) {
    const [x, y] = convertCoordinates(row, col);

    if (gridElement.id === 'playerTwoGameboard') {
        GAME.takeTurn([x, y]);

        updateCellUI(row, col, gridElement);
        updatePlayerOneScore();
        updatePlayerTwoShipsStats(row, col);

        manageCellEvents(false);

        togglePlayerTurnState(gridElement, true);
        setTimeout(() => {
            handleComputerAttack();

            setTimeout(() => {
                updatePlayerTwoScore();
                togglePlayerTurnState(gridElement, false);
            }, 100);
        }, 1000);
    }
}

function handleComputerAttack() {
    // Handle the computer's turn, which happens inside takeTurn()
    const lastComputerAttack =
        GAME.playerTwo.attackHistory[GAME.playerTwo.attackHistory.length - 1];
    if (lastComputerAttack) {
        const [computerRow, computerCol] = convertToGridCoordinates(lastComputerAttack.coordinates);
        updatePlayerOneShipsStats(computerRow, computerCol);
        // Update Player One's board UI for the computer's attack
        updateCellUI(computerRow, computerCol, playerOneGameboard);
    }
    manageCellEvents(true);
}

function updateCellUI(row, col, gridElement) {
    const cellSelector = `.cell[data-row="${row}"][data-col="${col}"]`;
    const cellElement = gridElement.querySelector(cellSelector);

    cellElement.classList.add('marked');

    const grid =
        gridElement.id === 'playerOneGameboard'
            ? GAME.playerOne.gameboard.grid
            : GAME.playerTwo.gameboard.grid;

    const cellContent = grid[row][col];

    if (cellContent instanceof Ship) {
        cellElement.classList.add('cell-hit');
    } else {
        cellElement.classList.add('cell-miss');
    }
}

// Helper function to update the score for any player
function updatePlayerScore(player, hitElementId, missElementId) {
    const hitStats = document.getElementById(hitElementId);
    const missStats = document.getElementById(missElementId);

    hitStats.innerText = player.hits;
    missStats.innerText = player.misses;
}

// Function to update Player One's score
function updatePlayerOneScore() {
    updatePlayerScore(GAME.playerOne, 'playerOneHits', 'playerOneMisses');
}

// Function to update Player Two's score
function updatePlayerTwoScore() {
    updatePlayerScore(GAME.playerTwo, 'playerTwoHits', 'playerTwoMisses');
}

// Function to update Player One's ship stats
function updatePlayerOneShipsStats(row, col) {
    updatePlayerShipsStats(GAME.playerOne, row, col, 'playerOneShips');
}

// Function to update Player Two's ship stats
function updatePlayerTwoShipsStats(row, col) {
    updatePlayerShipsStats(GAME.playerTwo, row, col, 'playerTwoShips');
}

// Helper function to update ship stats for any player
function updatePlayerShipsStats(player, row, col, shipElementId) {
    const [x, y] = convertCoordinates(row, col);
    const ship = player.gameboard.getShipAt([x, y]);
    const playerShips = document.getElementById(shipElementId);

    if (ship instanceof Ship && ship.hits >= 0) {
        const shipType = ship.title;
        const shipElements = playerShips.querySelectorAll('.ship');

        let shipElement = Array.from(shipElements).find(
            el => el.querySelector('.ship-title').textContent === shipType
        );

        if (shipElement) {
            const shipBlocks = shipElement.querySelectorAll('.ship-block');
            shipBlocks.forEach((block, index) => {
                if (index < ship.hits) {
                    block.classList.remove('ship-block-default');
                    block.classList.add('ship-block-hit');
                }
            });

            if (ship.isSunk()) {
                shipElement.querySelector('.ship-title').classList.add('ship-title-after-sunk');
            }
        }
    }
}

function togglePlayerTurnState(gridElement, isWaiting) {
    const cells = [...gridElement.childNodes];
    cells.forEach(cell => {
        cell.classList.toggle('waitTurn', isWaiting);
    });
}

function convertCoordinates(row, col) {
    const x = indexToLetter(col);
    const y = row + 1;
    return [x, y];
}

function indexToLetter(index) {
    return String.fromCharCode('A'.charCodeAt(0) + index);
}

function convertToGridCoordinates(coordinates) {
    const [x, y] = coordinates;
    const col = letterToIndex(x);
    const row = y - 1;
    return [row, col];
}

function letterToIndex(letter) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
}
