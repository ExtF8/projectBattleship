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
        let ship = opponent.gameboard.getShipAt(coordinates[0], coordinates[1]);

        return ship.hits, attack;
    }
}
