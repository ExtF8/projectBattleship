import { Gameboard } from '../src/modules/classes/Gameboard';
import { Ship } from '../src/modules/classes/Ship';

describe.only('Gameboard', () => {
    test('should place a ship at specific coordinates', () => {
        // Setup
        const gameboard = new Gameboard(1);
        const carrier = Ship.create(Ship.Types.CARRIER);
        // Action
        gameboard.placeShip(carrier, 'A', 1, 'horizontal');

        // Assertion
        expect(gameboard.getShipAt('A', 1)).toBe(carrier);
    });
});
