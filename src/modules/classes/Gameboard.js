import { Ship } from './Ship';

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

    /**
     * Converts a letter to its corresponding index.
     *
     * @param {string} letter - A letter to convert
     * @returns {number} - The index of the letter
     */
    letterToIndex(letter) {
        return letter.charCodeAt() - 'A'.charCodeAt(0);
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
        const [x, y] = this.convertCoordinates(startCoordinates);

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
     * Validates if the ship can be placed at the specified coordinates and direction
     *
     * @param {Object} ship - The ship to place.
     * @param {number} x - The starting x-coordinate.
     * @param {number} y - The starting y-coordinate.
     * @param {string} direction - The direction to place the ship (horizontal or vertical).
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
     * Retrieves the ship at the specified coordinates.
     *
     * @param {Array} coordinates - The coordinates of the to retrieve ship from [letter, number].
     * @returns {Object||null} - The ship at coordinates, or null if none exists.
     */
    getShipAt(coordinates = []) {
        const [x, y] = this.convertCoordinates(coordinates);
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

    /**
     * Converts grid coordinates form letter and number to x and y indices.
     *
     * @param {string} letter - The letter representing the column, e.g., (A-J).
     * @param {number} number - The number representing the row, e.g., (1-10).
     * @returns {number[]} - An array containing the x and y indices.
     */
    convertCoordinates(coordinates = []) {
        const [letter, number] = coordinates;
        const x = this.letterToIndex(letter);
        const y = number - 1;

        return [x, y];
    }

    placeShipsRandomly(ships) {
        // Get board size
        const size = this.grid.length;
    
        Object.values(ships).forEach(ship => {
            let placed = false;
    
            while (!placed) {
                // Randomly choose direction (horizontal or vertical)
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                
                // Randomly choose starting coordinates
                const startX = Math.floor(Math.random() * size);
                const startY = Math.floor(Math.random() * size);
                const startCoordinates = [this.indexToLetter(startX), startY + 1];
    
                // Validate and place ship
                try {
                    this.placeShip(ship, startCoordinates, direction);
                    placed = true; // Exit loop if placement is successful
                } catch (error) {
                    // If placement is invalid, try again with different coordinates
                    continue;
                }
            }
        });
    }

    indexToLetter(index) {
        return String.fromCharCode(index + 'A'.charCodeAt(0));
    }

}
