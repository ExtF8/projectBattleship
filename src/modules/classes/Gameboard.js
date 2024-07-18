export class Gameboard {
    constructor(id, size = 10) {
        this.id = id;
        this.grid = this.createEmptyGrid(size);
        this.ships = [];
        this.missedAttacks = [];
    }

    placeShip(ship, startCoordinates, direction) {}

    createEmptyGrid(size) {
        const grid = [];
        for (let i = 0; i < size; i++) {
            grid.push(new Array(size).fill(null));
        }

        return grid;
    }
}

const board = new Gameboard(1);
console.log(board)