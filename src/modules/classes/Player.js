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
        (this.id = id),
            (this.name = name),
            (this.isComputer = isComputer),
            (this.gameboard = new Gameboard(id));
    }

    /**
     * Attacks an oponent at the specified coordinates.
     *
     * @param {Player} opponent - The opponent player.
     * @param {Array} coordinates - The coordinates of attack [letter, number].
     * @returns {boolean} - Returns true if attack was a successful, otherwise false.
     */
    attack(opponent, coordinates = []) {
        const attack = opponent.gameboard.receiveAttack(coordinates);

        return attack;
    }

    /**
     * Makes computer-controlled attack on an opponent.
     *
     * @param {Player} opponent - The opponent player.
     * @returns {Array} - The coordinates of the attack [letter, number].
     */
    computerAttack(opponent) {
        let coordinates;
        let successfulAttack;

        // Keep trying random coordinates until a valid attack is made.
        do {
            coordinates = this.getRandomCoordinates();
            successfulAttack = this.attack(opponent, coordinates);
        } while (successfulAttack === undefined);

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
