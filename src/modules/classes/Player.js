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
    }

    /**
     * Attacks an oponent at the specified coordinates.
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

        // Keep trying random coordinates until a valid attack is made.
        do {
            coordinates = this.getRandomCoordinates();
            validAttack = this.attack(opponent, coordinates);
        } while (!validAttack);

        return validAttack;
    }

    /**
     * Generates random coordinates.
     *
     * @returns {Array} - The random coordinates for the attack.
     */
    getRandomCoordinates() {
        const letters = 'ABCDEFGHIJ'.split('');
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const number = Math.floor(Math.random() * 10) + 1;
        return [letter, number];
    }
}
