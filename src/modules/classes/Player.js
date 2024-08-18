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
     * Makes computer-controlled attack on an opponent.
     *
     * @param {Player} opponent - The opponent player.
     * @returns {Boolean} - Returns true if attack was valid, else false.
     */
    computerAttack(opponent) {
        let coordinates;
        let validAttack = false;

        // If there are adjacent cells to attack, prioritize those.
        if (this.adjacentCells.length > 0) {
            coordinates = this.adjacentCells.shift(); // Get the next adjacent cell
            validAttack = this.attack(opponent, coordinates);
        } else {
            // If no valid attack was made or no adjacent cells to attack, choose random coordinates.
            do {
                coordinates = this.getRandomCoordinates();
                validAttack = this.attack(opponent, coordinates);
            } while (!validAttack);
        }

        // If the attack was a hit, track the adjacent cells for future attacks.
        if (validAttack && this.attackHistory[this.attackHistory.length - 1].result) {
            const previousHit = this.lastHit;
            this.lastHit = coordinates;
            this.updateDirection(previousHit, coordinates);
            this.adjacentCells = this.getAdjacentCells(coordinates).filter(
                cell => this.isUniqueAttack(cell) && this.isValidDirection(cell)
            );
        }

        return validAttack;
    }

    updateDirection(previousHit, currentHit) {
        if (previousHit && currentHit) {
            const direction = this.getDirection(previousHit, currentHit);
            if (direction) {
                this.lastDirection = direction;
            }
        }
    }

    getDirection([prevLetter, prevNumber], [currLetter, currNumber]) {
        if (prevLetter === currLetter) {
            return prevNumber < currNumber ? 'down' : 'up';
        } else if (prevNumber === currNumber) {
            return prevLetter < currLetter ? 'right' : 'left';
        }
        return null;
    }

    isValidDirection([letter, number]) {
        if (!this.lastDirection) return true;

        const [prevLetter, prevNumber] = this.lastHit;
        const direction = this.getDirection([prevLetter, prevNumber], [letter, number]);

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
}
