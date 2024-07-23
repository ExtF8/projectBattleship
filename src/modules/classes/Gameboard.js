import { Ship, ShipManager } from './Ship';
export class Gameboard {
    constructor(id, size = 10) {
        this.id = id;
        this.grid = this.createEmptyGrid(size);
        this.ships = [];
        this.missedAttacks = [];
    }

    createEmptyGrid(size) {
        const grid = Array.from({ length: size }, () => Array(size).fill(null));
        return grid;
    }

    letterToIndex(letter) {
        return letter.charCodeAt() - 'A'.charCodeAt(0);
    }

    placeShip(ship, startLetter, startNumber, direction) {
        const [x, y] = this.#convertCoordinates(startLetter, startNumber);

        // Validate the placement
        if (!this.validatePlacement(ship, x, y, direction)) {
            throw new Error('Invalid placement');
        }

        // Place the ship
        for (let i = 0; i < ship.length; i++) {
            if (direction === 'horizontal') {
                this.grid[y][x + i] = ship;
            } else if (direction === 'vertical') {
                this.grid[y + i][x] = ship;
            }
        }
        this.ships.push(ship);
    }

    validatePlacement(ship, x, y, direction) {
        if (direction === 'horizontal') {
            // Ensure the ship fits horizontally within bounds
            if (x + ship.length > this.size || y >= this.size) return false;
            // Check each cell the ship would occupy
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
            // Check each cell the ship would occupy
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

    getShipAt(letter, number) {
        const [x, y] = this.#convertCoordinates(letter, number);

        return this.grid[y][x];
    }

    receiveAttack(coordinates = []) {
        const [letter, number] = coordinates;
        const [x, y] = this.#convertCoordinates(letter, number);
        let hit = false;
        let target = this.getShipAt(letter, number);

        if (target === null) {
            this.missedAttacks.push([letter, number]);
            hit = false;
            this.grid[y][x] = 'miss';
        } else if (target instanceof Ship) {
            target.hit();
            hit = true;
            this.grid[y][x] = 'hit';
        }

        return hit;
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk);
    }

    /**
     * Converts grid coordinates form letter and number to x and y indices.
     *
     * @private
     * @param {string} letter - The letter representing the column, e.g., (A-J).
     * @param {number} number - The number representing the row, e.g., (1-10).
     * @returns {number[]} - An array containing the x and y indices.
     */
    #convertCoordinates(letter, number) {
        const x = this.letterToIndex(letter);
        const y = number - 1;
        console.log(typeof x, y);
        return [x, y];
    }
}
