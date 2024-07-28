import { Gameboard } from '../src/modules/classes/Gameboard';
import { Ship, ShipManager } from '../src/modules/classes/Ship';
import { logGrid } from '../src/utility/logHelper';

describe('Gameboard', () => {
    let shipManager;
    let gameboard;
    let carrier;
    let battleship;
    let destroyer;
    let submarine;
    let patrolBoat;
    let attackHit;
    let attackMiss;

    beforeAll(() => {
        shipManager = new ShipManager();
        gameboard = new Gameboard(1);
        Ship.defaultShipManager = shipManager;

        // place
        carrier = Ship.create(Ship.Types.CARRIER);
        // receive attack
        battleship = Ship.create(Ship.Types.BATTLESHIP);

        destroyer = Ship.create(Ship.Types.DESTROYER);

        submarine = Ship.create(Ship.Types.SUBMARINE);

        // sunk
        patrolBoat = Ship.create(Ship.Types.PATROL_BOAT);

        gameboard.placeShip(carrier, 'A', 1, 'vertical');
        gameboard.placeShip(battleship, 'B', 2, 'vertical');
        gameboard.placeShip(destroyer, 'C', 3, 'vertical');
        gameboard.placeShip(submarine, 'D', 4, 'vertical');
        gameboard.placeShip(patrolBoat, 'E', 5, 'vertical');

        // Attacks
        attackHit = gameboard.receiveAttack(['B', 2]);
        attackMiss = gameboard.receiveAttack(['B', 1]);

        // PatrolBoat
        gameboard.receiveAttack(['E', 5]);
        gameboard.receiveAttack(['E', 6]);
    });

    afterAll(() => {
        return logGrid(gameboard.grid, gameboard);
    });

    test('should place ships at specific coordinates', () => {
        expect(gameboard.getShipAt('A', 1).id).toBe(carrier.id);
    });

    test('should receive attack on specified coordinates', () => {
        expect(attackHit).toBe(true);
    });

    test('should return false if attack was a miss', () => {
        expect(attackMiss).toBe(false);
    });

    test('should record missed attacks', () => {
        expect(gameboard.missedAttacks).toEqual([['B', 1]]);
    });

    test('should record successful attacks', () => {
        expect(gameboard.successfulAttacks).toEqual([['B', 2], ['E', 5], ['E', 6]]);
    });

    test('should report if the ship is sunk', () => {
        expect(patrolBoat.isSunk()).toBe(true);
    });

    test('should report if all the ships are sunk', () => {
        // Sink all remaining ships for testing
        // Carrier
        gameboard.receiveAttack(['A', 1]);
        gameboard.receiveAttack(['A', 2]);
        gameboard.receiveAttack(['A', 3]);
        gameboard.receiveAttack(['A', 4]);
        gameboard.receiveAttack(['A', 5]);

        // Battleship
        gameboard.receiveAttack(['B', 3]);
        gameboard.receiveAttack(['B', 4]);
        gameboard.receiveAttack(['B', 5]);

        // Destroyer
        gameboard.receiveAttack(['C', 3]);
        gameboard.receiveAttack(['C', 4]);
        gameboard.receiveAttack(['C', 5]);

        // Submarine
        gameboard.receiveAttack(['D', 4]);
        gameboard.receiveAttack(['D', 5]);
        gameboard.receiveAttack(['D', 6]);

        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test('should not alow ships to be placed outside the grid', () => {
        const outOfBoundsShipVertical = Ship.create(Ship.Types.CARRIER);
        const outOfBoundsShipHorizontal = Ship.create(Ship.Types.BATTLESHIP);

        expect(() =>
            gameboard.placeShip(outOfBoundsShipVertical, 'J', 10, 'vertical')
        ).toThrow('Invalid placement');
        expect(() =>
            gameboard.placeShip(outOfBoundsShipHorizontal, 'J', 1, 'horizontal')
        ).toThrow('Invalid placement');
    });

    test('should not allow shipt to be placed overlapping another ship', () => {
        const overlappingShip = Ship.create(Ship.Types.SUBMARINE);

        expect(() =>
            gameboard.placeShip(overlappingShip, 'C', 3, 'horizontal')
        ).toThrow('Invalid placement');
    });
});
