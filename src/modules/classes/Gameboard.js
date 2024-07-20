import { Ship } from './Ship';
export class Gameboard {
    constructor(id, size = 10) {
        this.id = id;
        this.grid = this.createEmptyGrid(size);
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
        const x = this.letterToIndex(startLetter);
        const y = startNumber - 1;

        for (let i = 0; i < ship.length; i++) {
            if (direction === 'horizontal') {
                this.grid[y][x + i] = ship;
            } else if (direction === 'vertical') {
                this.grid[y + i][x] = ship;
            }
        }
    }

    getShipAt(letter, number) {
        const x = this.letterToIndex(letter);
        const y = number - 1;

        return this.grid[y][x];
    }
}
