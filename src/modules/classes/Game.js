import { Player } from './Player.js';
import { Ship, ShipManager } from './Ship.js';

/**
 * Represents a game of Battleship.
 *
 * @class
 */
export default class Game {
    /**
     * Creates an instance of Game.
     *
     */
    constructor() {
        this.hasGameStarted = false;
        this.isGameOver = false;
        this.playerOne = null;
        this.playerTwo = null;
        this.currentTurn = null;
        this.playerOneShips = [];
        this.playerTwoShips = [];
        this.hasWinner = false;
        this.winner = '';
        this.shipManager = new ShipManager();
        Ship.defaultShipManager = this.shipManager;
    }

    /**
     * Initializes the game by creating players, ships, and setting the starting turn.
     */
    initializeGame() {
        // this.resetGame();
        this.hasGameStarted = false;

        this.playerOne = new Player(1, 'Human', false);
        this.playerTwo = new Player(2, 'Computer', true);
        this.initShips();
        this.currentTurn = this.playerOne;
    }

    startGame() {
        this.hasGameStarted = true;
    }

    endGame() {
        this.hasGameStarted = false;
        // this.resetGame();
    }

    /**
     * Initializes ships for both players.
     */
    initShips() {
        this.playerOneShips = this.createShips();
        this.playerTwoShips = this.createShips();
    }

    /**
     * Creates ship instances for each type.
     *
     * @returns {Object} An object where keys are ship types and values are ship instances.
     */
    createShips() {
        return {
            CARRIER: Ship.create(Ship.Types.CARRIER),
            BATTLESHIP: Ship.create(Ship.Types.BATTLESHIP),
            DESTROYER: Ship.create(Ship.Types.DESTROYER),
            SUBMARINE: Ship.create(Ship.Types.SUBMARINE),
            PATROL_BOAT: Ship.create(Ship.Types.PATROL_BOAT),
        };
    }

    /**
     * Places a ship for the specified player at the given coordinates and direction.
     *
     * @param {Player} player - The player for whom the ship is being placed.
     * @param {string} shipType - The type of the ship (e.g., 'CARRIER').
     * @param {Array} startCoordinates - The starting coordinates of the ship (e.g., ['A', 1]).
     * @param {string} direction - The direction to place the ship ('horizontal' or 'vertical').
     * @throws {Error} Throws an error if the ship type is not found.
     */
    placeShipsForPlayer(player, shipType, startCoordinates, direction) {
        const ship = this.getShipTypesFor(player, shipType);

        if (ship) {
            player.gameboard.placeShip(ship, startCoordinates, direction);
        } else {
            throw new Error('Ship type not found');
        }
    }

    /**
     * Retrieves the ship of the specified type for a given player.
     *
     * @param {Player} player - The player whose ship type is being retrieved.
     * @param {string} shipType - The type of the ship (e.g., 'CARRIER').
     * @returns {Ship|null} The ship instance if found; otherwise, null.
     */
    getShipTypesFor(player, shipType) {
        if (player === this.playerOne) {
            return this.playerOneShips[shipType];
        } else if (player === this.playerTwo) {
            return this.playerTwoShips[shipType];
        }

        return null;
    }

    /**
     * Processes an attack at the specified coordinates and updates the game state.
     *
     * @param {Array} coordinates - The coordinates where the attack is to be made (e.g., ['A', 1]).
     * @returns {boolean} True if the attack was successful; otherwise, false.
     * @throws {Error} Throws an error if the game is already over.
     */
    takeTurn(coordinates) {
        if (this.isGameOver) {
            return;
        }

        const attackingPlayer = this.currentTurn;
        const defendingPlayer = this.getOpponent();

        let attackResult;

        // Check if it's player one's turn (human)
        if (attackingPlayer === this.playerOne) {
            attackResult = attackingPlayer.attack(defendingPlayer, coordinates);
            // Check for win condition after player's attack
            if (attackResult) {
                this.checkForWin(defendingPlayer);
            }

            // Switch to computer's turn if the game is not over
            if (!this.isGameOver) {
                this.switchTurn();
                this.takeComputerTurn(); // Trigger computer's turn immediately
            }
        } else {
            // It's player two's turn (computer)
            attackResult = this.takeComputerTurn();
        }

        return attackResult;
    }

    /**
     * Handles the computer's turn.
     *
     */
    takeComputerTurn() {
        const attackingPlayer = this.playerTwo;
        const defendingPlayer = this.playerOne;

        const attackResult = attackingPlayer.computerAttack(defendingPlayer);

        // Check for win condition after computer's attack
        if (attackResult) {
            this.checkForWin(defendingPlayer);
        }

        // Switch back to player's turn if the game is not over
        if (!this.isGameOver) {
            this.switchTurn();
        }

        return attackResult;
    }

    /**
     * Gets the player who is not currently taking their turn.
     *
     * @returns {Player} The opponent player.
     */
    getOpponent() {
        return this.currentTurn === this.playerOne ? this.playerTwo : this.playerOne;
    }

    /**
     * Checks if the defending player has lost all ships and declares a winner if so.
     *
     * @param {Player} defendingPlayer - The player being checked for a loss.
     */
    checkForWin(defendingPlayer) {
        if (defendingPlayer.gameboard.allShipsSunk()) {
            this.isGameOver = true;

            this.declareWinner(defendingPlayer);
            this.endGame()
        }
    }

    /**
     * Declares the winner of the game.
     *
     * @param {Player} defendingPlayer - The player who lost the game.
     * @returns {string} The name of the winning player ('Player One' or 'Player Two').
     */
    declareWinner(defendingPlayer) {
        this.hasWinner = true;
        this.winner = defendingPlayer === this.playerOne ? 'Player Two' : 'Player One';
        // console.log(`${winner} wins!`);
        return this.winner;
    }

    /**
     * Switches the current turn to the other player.
     */
    switchTurn() {
        this.currentTurn = this.currentTurn === this.playerOne ? this.playerTwo : this.playerOne;
    }

    /**
     * Resets game to its initial state.
     */
    resetGame() {
        this.hasGameStarted = false;
        this.isGameOver = false;
        if (this.playerOne) this.playerOne.resetScore();
        if (this.playerTwo) this.playerTwo.resetScore();
        this.currentTurn = null;
        this.winner = '';
        this.shipManager.clearShips();
        this.playerOne = null;
        this.playerTwo = null;
    }
}
