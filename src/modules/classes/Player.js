import { Gameboard } from './Gameboard';

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
     * @returns {boolean} - Returns true if attack was a successful, otherwise false.
     */
    attack(opponent, coordinates = []) {
        if(!this.validateAttackCoordinates(coordinates)){
            return false
        }

        const result = opponent.gameboard.receiveAttack(coordinates);

        this.attackHistory.push({ coordinates, result });

        if (result) {
            this.hits += 1;
        } else {
            this.misses += 1;
        }

        return result;
    }

    // Validate if the attack has already been made on coordinates
    validateAttackCoordinates(coordinates) {
        // Check if attack has already been made
        let attackExists = this.attackHistory.some(item => {
            console.log('Checking coordinates: ', item.coordinates);
            return this.arraysEqual(coordinates, item.coordinates);
        });

        // Return false if the attack has already been made, true otherwise
        return !attackExists;
    }

    // Helper function to compare two arrays
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Makes computer-controlled attack on an opponent.
     *
     * @param {Player} opponent - The opponent player.
     * @returns {Array} - The coordinates of the attack [letter, number].
     */
    computerAttack(opponent) {
        let coordinates;
        let validAttack = false;

        // Keep trying random coordinates until a valid attack is made.
        do {
            coordinates = this.getRandomCoordinates();
            validAttack = this.attack(opponent, coordinates);
            console.log(validAttack)
        } while (!validAttack);

        return coordinates;
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
