import { Gameboard } from './Gameboard';

export class Player {
    constructor(id, name, isComputer, gameboardSize = 10) {
        (this.id = id),
            (this.name = name),
            (this.isComputer = isComputer),
            (this.gameboard = new Gameboard(id, gameboardSize));
    }

    attack(opponent, coordinates = []) {
        return opponent.gameboard.receiveAttack(coordinates);
    }
}
