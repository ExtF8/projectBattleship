import { Gameboard } from './Gameboard';

export class Player {
    constructor(id, name, isComputer) {
        (this.id = id),
            (this.name = name),
            (this.isComputer = isComputer),
            (this.gameboard = new Gameboard(id));
    }

    attack(opponent, coordinates = []) {
        const attack = opponent.gameboard.receiveAttack(coordinates);

        return attack;
    }

    computerAttack(opponent) {
        let coordinates;
        let successfulAttack;

        do {
            coordinates = this.getRandomCoordinates();
            successfulAttack = this.attack(opponent, coordinates);
        } while (successfulAttack === undefined);

        return coordinates;
    }

    getRandomCoordinates() {
        const letters = 'ABCDEFGHIJ'.split('');
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const number = Math.floor(Math.random() * 10) + 1;
        return [letter, number];
    }
}
