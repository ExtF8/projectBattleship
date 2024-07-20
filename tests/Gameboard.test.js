import { Gameboard } from '../src/modules/classes/Gameboard';
import { Ship } from '../src/modules/classes/Ship';

describe.only('Gameboard', () => {
    test('should place a ship at specific coordinates', () => {
        const gameboard = new Gameboard(1);

        const carrier = Ship.create(Ship.Types.CARRIER);
        const patrolBoat = Ship.create(Ship.Types.PATROL_BOAT);

        gameboard.placeShip(carrier, 'A', 1, 'horizontal');
        gameboard.placeShip(patrolBoat, 'B', 2, 'vertical');

        expect(gameboard.getShipAt('A', 1)).toBe(carrier);
        expect(gameboard.getShipAt('B', 2)).toBe(patrolBoat);
    });
});
