import { Gameboard } from '../src/modules/classes/Gameboard';
import { Ship, ShipManager } from '../src/modules/classes/Ship';
import { logGrid } from '../src/utility/logHelper';

describe.only('Gameboard', () => {
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
        return logGrid(gameboard.grid);
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

    test('should mark a ship as hit ', () => {
        expect(gameboard.grid[1][1]).toBe('hit');
    });

    test('should mark board if hit was a miss', () => {
        expect(gameboard.grid[0][1]).toBe('miss');
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

        expect(gameboard.allShipsSunk()).toBe(true)
    });
});
