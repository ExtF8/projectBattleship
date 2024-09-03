import { Ship } from './Ship.js';
import { convertCoordinates, indexToLetter } from '../../utility/utils.js';

/**
 * Represents a Gameboard.
 *
 * @class
 */
export class Gameboard {
    /**
     * Creates an instance of Gameboard.
     *
     * @param {number} id - The id of the Gameboard.
     * @param {number} size [size=10] - The size of the board (default is 10).
     */
    constructor(id, size = 10) {
        this.id = id;
        this.size = size;
        this.grid = this.createEmptyGrid(size);
        this.ships = [];
        this.missedAttacks = [];
        this.successfulAttacks = [];
    }

    /**
     * Creates grid of specified size.
     *
     * @param {number} size - The size of the grid.
     * @returns {Array<Array<null>>} - A two-dimensional array representing the grid.
     */
    createEmptyGrid(size) {
        const grid = Array.from({ length: size }, () => Array(size).fill(null));
        return grid;
    }

    // Method to clear ships from the grid
    clearShips() {
        this.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell instanceof Ship) {
                    this.grid[rowIndex][colIndex] = null; // Clear the cell
                }
            });
        });

        // Optionally clear the ships array
        this.ships = [];
    }

    /**
     * Places the ship on the grid at the specified coordinates and direction.
     *
     * @param {Object} ship - The ship to place.
     * @param {Array} startCoordinates - The starting coordinates [letter, number].
     * @param {string} direction - The direction to place the ship (horizontal or vertical).
     * @throws {Error} - If placement is invalid.
     */
    placeShip(ship, startCoordinates, direction) {
        // const [startRow, startCol] = startCoordinates;
        const [x, y] = convertCoordinates(startCoordinates);

        // Validate the placement
        if (!this.validatePlacement(ship, x, y, direction)) {
            throw new Error('Invalid placement');
        }

        // Place the ship
        // for grid array y coordinate is first
        // to make letters as cols and numbers as rows
        for (let i = 0; i < ship.length; i++) {
            if (direction === 'horizontal') {
                this.grid[y][x + i] = ship;
            } else if (direction === 'vertical') {
                this.grid[y + i][x] = ship;
            }
        }
        this.ships.push(ship);
    }

    /**
     * Places ships randomly on the board.
     *
     * @param {Object} ships - The ships to place.
     */
    placeShipsRandomly(ships) {
        const size = this.grid.length;

        Object.values(ships).forEach(ship => {
            let placed = false;

            let attempts = 0;
            const maxAttempts = 100;
            while (!placed && attempts < maxAttempts) {
                attempts++;
                // Randomly choose direction (horizontal or vertical)
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

                // Randomly choose starting coordinates
                const startX = Math.floor(Math.random() * size);
                const startY = Math.floor(Math.random() * size);
                const startCoordinates = [indexToLetter(startX), startY + 1];
                let positions = [];

                // Calculate all positions based on the direction
                for (let i = 0; i < ship.length; i++) {
                    if (direction === 'horizontal') {
                        positions.push([indexToLetter(startX + i), startY + 1]);
                    } else {
                        positions.push([indexToLetter(startX), startY + 1 + i]);
                    }
                }

                // Validate and place ship
                if (
                    this.validatePlacement(ship, startX, startY, direction) &&
                    this.checkSurrounding(startX, startY, ship.length, direction)
                ) {
                    this.placeShip(ship, startCoordinates, direction);
                    ship.positions = positions;
                    placed = true;
                }
            }
            if (!placed) {
                throw new Error('Failed to place ship after many attempts');
            }
        });
    }

    /**
     * Validates if the ship can be placed at the specified coordinates and direction
     *
     * @param {Object} ship - The ship to place.
     * @param {number} x - The starting x-coordinate.
     * @param {number} y - The starting y-coordinate.
     * @param {string} direction - The direction of the ship (horizontal or vertical).
     * @returns {boolean} - True if placement is valid, otherwise false.
     */
    validatePlacement(ship, x, y, direction) {
        if (direction === 'horizontal') {
            // Ensure the ship fits horizontally within bounds
            if (x + ship.length > this.size || y >= this.size) return false;
            // Check each cell the ship would occupy for overlap
            for (let i = 0; i < ship.length; i++) {
                if (
                    x + i >= this.size ||
                    this.grid[y] === undefined ||
                    this.grid[y][x + i] !== null
                ) {
                    return false;
                }
            }
        } else if (direction === 'vertical') {
            // Ensure the ship fits vertically within bounds
            if (y + ship.length > this.size || x >= this.size) return false;
            // Check each cell the ship would occupy for overlap
            for (let i = 0; i < ship.length; i++) {
                if (
                    y + i >= this.size ||
                    this.grid[y + i] === undefined ||
                    this.grid[y + i][x] !== null
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Helper function to check if the cells surrounding a potential ship placement are empty.
     *
     * @param {number} x - The starting x-coordinate.
     * @param {number} y - The starting y-coordinate.
     * @param {number} length - The length of the ship.
     * @param {string} direction - The direction of the ship (horizontal or vertical).
     * @returns {Boolean} Returns true if surrounding cells are empty, otherwise false.
     */
    checkSurrounding(x, y, length, direction) {
        // Ofsets surrounding cells
        const deltas = [-1, 0, 1];
        for (let i = 0; i < length; i++) {
            // Loop through x-offsets and y-offsets
            for (let dx of deltas) {
                for (let dy of deltas) {
                    if (dx === 0 && dy === 0) continue;
                    // Neighbor x coordinate
                    const nx = x + (direction === 'horizontal' ? i : 0) + dx;
                    // Neighbor y coordinate
                    const ny = y + (direction === 'vertical' ? i : 0) + dy;

                    // Check if neighbor cell is within bounds and not empty
                    if (
                        nx >= 0 &&
                        nx < this.size &&
                        ny >= 0 &&
                        ny < this.size &&
                        this.grid[ny][nx] !== null
                    ) {
                        // Invalid placement due to proximity to another ship
                        return false;
                    }
                }
            }
        }
        // Valid placement with surrounding cells empty
        return true;
    }

    /**
     * Retrieves the ship at the specified coordinates.
     *
     * @param {Array} coordinates - The coordinates of the to retrieve ship from [letter, number].
     * @returns {Object||null} - The ship at coordinates, or null if none exists.
     */
    getShipAt(coordinates = []) {
        console.log(coordinates)
        const [x, y] = convertCoordinates(coordinates);
        let shipAt = this.grid[y][x];
        return shipAt;
    }

    /**
     * Records an attack at the specified coordinates.
     *
     * @param {Array} coordinates - The coordinates of the attack [letter, number].
     * @returns {boolean} - True if the attack hit a ship, false otherwise.
     */
    receiveAttack(coordinates = []) {
        console.log(coordinates)
        let hit = false;
        let target = this.getShipAt(coordinates);
        const [letter, number] = coordinates;

        if (target === null) {
            this.missedAttacks.push([letter, number]);
        } else if (target instanceof Ship) {
            target.hit();
            hit = true;
            this.successfulAttacks.push([letter, number]);
        }

        return hit;
    }

    /**
     * Checks if all the ships are sunk.
     *
     * @returns {boolean} - True if all ships are sunk, false otherwise.
     */
    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}
