import { Gameboard } from './Gameboard.js';

/**
 * Represents Player
 *
 * @class
 */
export class Player {
    /**
     * Creates an instance of Player.
     *
     * @param {number} id - Id of the player.
     * @param {string} name - Name of the player.
     * @param {boolean} isComputer - Indicates if player is a computer.
     */
    constructor(id, name, isComputer) {
        this.id = id;
        this.name = name;
        this.isComputer = isComputer;
        this.gameboard = new Gameboard(id);
        this.attackHistory = [];
        this.hits = 0;
        this.misses = 0;
        this.lastHit = null; // Track the last successful hit
        this.lastDirection = null; // Track the direction of the last hit
        this.adjacentCells = []; // Track potential adjacent cells to attack
        this.sunkShips = [];
        this.shipHits = []; // Track successful hits on a ship to get surrounding cells after it has been sunk
        this.noGoZones = new Set(); // Track no-go zones around sunk ships
    }

    /**
     * Attacks an opponent at the specified coordinates.
     *
     * @param {Player} opponent - The opponent player.
     * @param {Array} coordinates - The coordinates of attack [letter, number].
     * @returns {boolean} - Returns true if attack was successful (hit or miss), otherwise false.
     */
    attack(opponent, coordinates = []) {
        if (!this.isUniqueAttack(coordinates)) {
            return false;
        }

        const result = opponent.gameboard.receiveAttack(coordinates);

        this.attackHistory.push({ coordinates, result });

        if (result) {
            this.hits += 1;
        } else {
            this.misses += 1;
        }

        return true;
    }

    /**
     * Validate if the attack has already been made on coordinates.
     *
     * @param {Array} coordinates - The coordinates to check.
     * @returns {Boolean} - Returns true if coordinates are unique, otherwise false.
     */
    isUniqueAttack(coordinates) {
        // Check if attack has already been made
        let attackExists = this.attackHistory.some(item => {
            return this.arraysEqual(coordinates, item.coordinates);
        });

        // Return true if no previous attack was found
        return !attackExists;
    }

    /**
     * Helper function to compare two arrays.
     *
     * @param {Array} arr1 - First array, incoming coordinates.
     * @param {Array} arr2 - Second array, existing coordinates.
     * @returns {Boolean} - Returns true if arrays are equal, otherwise false.
     */
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        return arr1.every((value, index) => value === arr2[index]);
    }

    /**
     * Makes a computer-controlled attack on an opponent.
     *
     * @param {Player} opponent - The opponent player.
     * @returns {Boolean} - Returns true if the attack was valid, otherwise false.
     */
    computerAttack(opponent) {
        let coordinates;
        let validAttack = false;
        let attemptedDirections = new Set();

        // If there are adjacent cells to attack, prioritize those.
        if (this.adjacentCells.length > 0) {
            while (this.adjacentCells.length > 0) {
                coordinates = this.adjacentCells.shift();
                if (!this.isInNoGoZone(coordinates)) {
                    validAttack = this.attack(opponent, coordinates);
                }

                if (validAttack) {
                    if (this.attackHistory[this.attackHistory.length - 1].result) {
                        if (
                            this.lastHit &&
                            !this.shipHits.some(hit => this.arraysEqual(hit, this.lastHit))
                        ) {
                            this.shipHits.push(this.lastHit);
                        }

                        this.updateDirection(this.lastHit, coordinates);
                        this.lastHit = coordinates;
                        break;
                    } else {
                        if (this.lastHit) {
                            const direction = this.getDirection(this.lastHit, coordinates);
                            attemptedDirections.add(direction);
                        }
                    }
                }
            }
        }

        if (!validAttack) {
            do {
                coordinates = this.getRandomCoordinates();
                if (!this.isInNoGoZone(coordinates)) {
                    validAttack = this.attack(opponent, coordinates);
                }
            } while (!validAttack);
        }

        if (validAttack && this.attackHistory[this.attackHistory.length - 1].result) {
            const ship = opponent.gameboard.getShipAt(coordinates);
            if (ship.isSunk()) {
                this.handleSunkShip([...this.shipHits, this.lastHit]);
                this.shipHits = [];
                this.lastHit = null;
            } else {
                const previousHit = this.lastHit;
                this.lastHit = coordinates;

                if (!this.shipHits.some(hit => this.arraysEqual(hit, this.lastHit))) {
                    this.shipHits.push(this.lastHit);
                }

                this.updateDirection(previousHit, coordinates);

                this.adjacentCells = [
                    ...this.adjacentCells,
                    ...this.getAdjacentCells(coordinates).filter(
                        cell =>
                            this.isUniqueAttack(cell) &&
                            !attemptedDirections.has(this.getDirection(coordinates, cell)) &&
                            !this.isInNoGoZone(cell)
                    ),
                ];
            }
        } else if (!validAttack && this.adjacentCells.length === 0) {
            this.lastDirection = null;
            this.adjacentCells = [];
        }

        // console.log('last hit: ', this.lastHit);
        // console.log('shipHits: ', this.shipHits); // Now this should be an argument in getSurroundingCells of sunk ship
        // console.log('no go zones: ', this.noGoZones);

        // console.log('lastDirection: ', this.lastDirection);
        // console.log('adjacentCells: ', this.adjacentCells);
        // console.log('sunkShips: ', this.sunkShips);

        return validAttack;
    }

    getDirection(previousHit, currentHit) {
        if (!previousHit || !currentHit) {
            console.error(
                'Invalid coordinates for direction calculation:',
                previousHit,
                currentHit
            );
            return null;
        }

        const [prevLetter, prevNumber] = previousHit;
        const [currLetter, currNumber] = currentHit;

        if (prevLetter === currLetter) {
            return prevNumber < currNumber ? 'down' : 'up';
        } else if (prevNumber === currNumber) {
            return prevLetter < currLetter ? 'right' : 'left';
        }
        return null;
    }

    updateDirection(previousHit, currentHit) {
        if (previousHit && currentHit) {
            const direction = this.getDirection(previousHit, currentHit);
            if (direction && direction !== this.lastDirection) {
                // console.log(
                //     `Updating direction from ${previousHit} to ${currentHit}: ${direction}`
                // );
                this.lastDirection = direction;
            } else if (!direction) {
                // console.log(
                //     `Invalid direction from ${previousHit} to ${currentHit}. Resetting direction.`
                // );
                this.lastDirection = null;
            }
        }
    }

    isValidDirection([letter, number]) {
        if (!this.lastDirection) {
            // console.log(`No direction set, allowing move to ${letter}, ${number}`);
            return true;
        }

        const [prevLetter, prevNumber] = this.lastHit;
        const direction = this.getDirection([prevLetter, prevNumber], [letter, number]);
        // console.log(
        //     `Checking direction for ${letter}, ${number}: expected ${this.lastDirection}, got ${direction}`
        // );
        return direction === this.lastDirection;
    }

    getRandomCoordinates() {
        const letters = 'ABCDEFGHIJ'.split('');
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const number = Math.floor(Math.random() * 10) + 1;
        return [letter, number];
    }

    getAdjacentCells([letter, number]) {
        const letters = 'ABCDEFGHIJ'.split('');
        const letterIndex = letters.indexOf(letter);
        const possibleCells = [];

        if (letterIndex > 0) possibleCells.push([letters[letterIndex - 1], number]); // Left
        if (letterIndex < 9) possibleCells.push([letters[letterIndex + 1], number]); // Right
        if (number > 1) possibleCells.push([letter, number - 1]); // Above
        if (number < 10) possibleCells.push([letter, number + 1]); // Below

        return possibleCells;
    }

    /**
     * Check if the coordinates are in the no-go zone.
     *
     * @param {Array} coordinates - The coordinates to check.
     * @returns {Boolean} - Returns true if coordinates are in the no-go zone, otherwise false.
     */
    isInNoGoZone(coordinates) {
        // console.log('no go zone: ', coordinates)
        return this.noGoZones.has(JSON.stringify(coordinates));
    }

    /**
     * Handle the event when a ship is sunk by marking the surrounding cells as no-go zones.
     *
     * @param {Array} shipCoordinates - The coordinates of the sunk ship.
     */
    handleSunkShip(shipCoordinates) {
        this.sunkShips.push([...shipCoordinates]);

        // Mark surrounding cells as no-go zones
        const surroundingCells = this.getSurroundingCells(shipCoordinates);
        surroundingCells.forEach(cell => this.noGoZones.add(JSON.stringify(cell)));

        this.lastHit = null;
        this.lastDirection = null;
    }

    /**
     * Get the surrounding cells of the sunk ship.
     *
     * @param {Array} shipCoordinates - The coordinates of the sunk ship.
     * @returns {Array} - Returns an array of surrounding coordinates.
     */
    getSurroundingCells(shipCoordinates) {
        const surroundingCells = new Set();
        const letters = 'ABCDEFGHIJ'.split('');

        if (!Array.isArray(shipCoordinates[0])) {
            shipCoordinates = [shipCoordinates];
        }

        for (let coord of shipCoordinates) {
            const [letter, number] = coord;
            const letterIndex = letters.indexOf(letter);

            const possibleCells = [
                letterIndex > 0 ? [letters[letterIndex - 1], number] : null,
                letterIndex < 9 ? [letters[letterIndex + 1], number] : null,
                number > 1 ? [letter, number - 1] : null,
                number < 10 ? [letter, number + 1] : null,
                letterIndex > 0 && number > 1 ? [letters[letterIndex - 1], number - 1] : null,
                letterIndex > 0 && number < 10 ? [letters[letterIndex - 1], number + 1] : null,
                letterIndex < 9 && number > 1 ? [letters[letterIndex + 1], number - 1] : null,
                letterIndex < 9 && number < 10 ? [letters[letterIndex + 1], number + 1] : null,
            ];

            possibleCells.forEach(cell => {
                if (cell && !shipCoordinates.some(shipCoord => this.arraysEqual(shipCoord, cell))) {
                    surroundingCells.add(JSON.stringify(cell));
                }
            });
        }

        // console.log('get surrounding Cells: ', surroundingCells);
        return Array.from(surroundingCells).map(cell => JSON.parse(cell));
    }

    /**
     * Resets players hits and misses to zero.
     *
     */
    resetScore() {
        this.hits = 0;
        this.misses = 0;
    }
}
