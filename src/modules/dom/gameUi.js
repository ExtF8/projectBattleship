import { Ship } from '../classes/Ship.js';
import { convertCoordinatesFromIndices } from '../../utility/utils.js';
import { GAME, manageCellEvents } from '../../index.js';

const gameStateButton = document.getElementById('gameStateToggle');
const playerOneGameboard = document.getElementById('playerOneGameboard');
const playerTwoGameboard = document.getElementById('playerTwoGameboard');

// UI
// Function to update the game button label based on game state
function updateButtonLabel() {
    if (GAME.hasGameStarted || GAME.isGameOver) {
        gameStateButton.textContent = 'End Game';
    } else {
        gameStateButton.textContent = 'Start New Game';
    }
}

//UI
function updateRandomButtonState() {
    const button = document.getElementById('randomPlacement');

    if (GAME.hasGameStarted) {
        button.classList.add('disabled');
        button;
    } else {
        button.classList.remove('disabled');
    }
}

// UI
function renderGameboard(grid, gridElement) {
    gridElement.innerHTML = ''; // Clear any existing content

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // For column labels
    const gridSize = grid.length;

    // Create the top row with letters
    for (let i = 0; i <= gridSize; i++) {
        const labelElement = document.createElement('div');
        labelElement.classList.add('label');
        if (i > 0) {
            labelElement.textContent = letters[i - 1];
        }
        gridElement.appendChild(labelElement);
    }

    // Create the grid cells with row numbers on the left
    grid.forEach((row, rowIndex) => {
        // Add the number label for the row
        const numberLabel = document.createElement('div');
        numberLabel.classList.add('label');
        numberLabel.textContent = rowIndex + 1;
        gridElement.appendChild(numberLabel);

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

            // Hide playerTwo ships on gameboard
            if (gridElement.id === 'playerTwoGameboard') {
                cellElement.classList.add('cell-PlayerTwo');
                cellElement.classList.remove('ship-cell');
            }

            gridElement.appendChild(cellElement);
        });
    });
}

// UI
function displayPlacedRandomShips() {
    GAME.playerOne.gameboard.clearShips();
    GAME.playerTwo.gameboard.clearShips();
    GAME.shipManager.clearPositions();

    GAME.playerOne.gameboard.placeShipsRandomly(GAME.playerOneShips);
    GAME.playerTwo.gameboard.placeShipsRandomly(GAME.playerTwoShips);

    renderGameboard(GAME.playerOne.gameboard.grid, playerOneGameboard);
    renderGameboard(GAME.playerTwo.gameboard.grid, playerTwoGameboard);
}

// UI
function updateCellUI(col, row, gridElement) {
    const cellSelector = `.cell[data-row="${row}"][data-col="${col}"]`;
    const cellElement = gridElement.querySelector(cellSelector);

    // Mark the cell as clicked
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

// UI
// Helper function to update the score for any player
function updatePlayerScore(player, hitElementId, missElementId) {
    const hitStats = document.getElementById(hitElementId);
    const missStats = document.getElementById(missElementId);

    hitStats.innerText = player.hits;
    missStats.innerText = player.misses;
}

// UI
// Function to update Player One's score
function updatePlayerOneScore() {
    updatePlayerScore(GAME.playerOne, 'playerOneHits', 'playerOneMisses');
}

// UI
// Function to update Player Two's score
function updatePlayerTwoScore() {
    updatePlayerScore(GAME.playerTwo, 'playerTwoHits', 'playerTwoMisses');
}

// UI
// Function to update Player One's ship stats
function updatePlayerOneShipsStats(col, row) {
    updatePlayerShipsStats(GAME.playerOne, col, row, 'playerOneShips');
}

// UI
// Function to update Player Two's ship stats
function updatePlayerTwoShipsStats(col, row) {
    updatePlayerShipsStats(GAME.playerTwo, col, row, 'playerTwoShips');
}

// UI
// Helper function to update ship stats for any player
function updatePlayerShipsStats(player, col, row, shipElementId) {
    const [x, y] = convertCoordinatesFromIndices([col, row]);

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

// UI
// Function to reset gameboard visuals
function resetGameboardVisuals(gridElement, shipElementId) {
    const playerShips = document.getElementById(shipElementId);
    const cells = gridElement.querySelectorAll('.cell');
    const shipElements = playerShips.querySelectorAll('.ship');

    cells.forEach(cell => {
        cell.classList.remove('marked', 'cell-hit', 'cell-miss', 'waitTurn');
    });

    shipElements.forEach(shipElement => {
        const shipBlocks = shipElement.querySelectorAll('.ship-block');
        const shipTitle = shipElement.querySelector('.ship-title');

        shipBlocks.forEach(block => {
            block.classList.remove('ship-block-hit');
            block.classList.add('ship-block-default');
        });

        shipTitle.classList.remove('ship-title-after-sunk');
    });

    resetHitsAndMisses();
    resetWinner();
}

// UI
function resetHitsAndMisses() {
    updatePlayerOneScore();
    updatePlayerTwoScore();
}

// UI
function updateWinner() {
    displayWinner();
    updateButtonLabel();

    manageCellEvents(false);
}

// UI
function displayWinner() {
    const winner = document.getElementById('winner');
    if (GAME.hasWinner) {
        winner.innerText = `${GAME.winner} Wins`;
    }
}

// UI
function resetWinner() {
    const winner = document.getElementById('winner');

    if (!GAME.hasWinner) {
        winner.textContent = '';
    }
}

export {
    updateButtonLabel,
    updateRandomButtonState,
    resetGameboardVisuals,
    resetHitsAndMisses,
    displayPlacedRandomShips,
    renderGameboard,
    updateWinner,
    displayWinner,
    resetWinner,
    updateCellUI,
    updatePlayerScore,
    updatePlayerOneScore,
    updatePlayerTwoScore,
    updatePlayerOneShipsStats,
    updatePlayerTwoShipsStats,
    updatePlayerShipsStats,
};
