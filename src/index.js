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

            if (gridElement.id === 'playerTwoGameboard') {
                cellElement.classList.add('cell-PlayerTwo');
            }

            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;

            if (cell === null) {
                cellElement.classList.add('empty-cell');
            } else if (cell instanceof Ship) {
                cellElement.classList.add('ship-cell');
            }

            if (gridElement.id === 'playerTwoGameboard') {
                cellElement.addEventListener('click', event =>
                    cellClickHandler(event, gridElement)
                );
            }

            gridElement.appendChild(cellElement);
        });
    });
}

function manageCellEvents(add) {
    const cells = playerTwoGameboard.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (add) {
            cell.addEventListener('click', event => cellClickHandler(event, playerTwoGameboard));
        } else {
            cell.removeEventListener('click', event => cellClickHandler(event, playerTwoGameboard));
        }
    });
}

function cellClickHandler(event, gridElement) {
    const cell = event.currentTarget;
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    handleAttack(row, col, gridElement);

    cell.removeEventListener('click', cellClickHandler); // Prevent repeated clicks on the same cell
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

function handleAttack(row, col, gridElement) {
    const [x, y] = convertCoordinates(row, col);

    if (gridElement.id === 'playerTwoGameboard') {
        GAME.takeTurn([x, y]);

        updateCellUI(row, col, gridElement);

        // Now handle the computer's turn, which happens inside takeTurn()
        const lastComputerAttack =
            GAME.playerTwo.attackHistory[GAME.playerTwo.attackHistory.length - 1];
        if (lastComputerAttack) {
            const [computerRow, computerCol] = convertToGridCoordinates(
                lastComputerAttack.coordinates
            );
            // Update Player One's board UI for the computer's attack
            updateCellUI(computerRow, computerCol, playerOneGameboard);
        }
    }
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
