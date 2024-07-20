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

        patrolBoat = Ship.create(Ship.Types.PATROL_BOAT);

        gameboard.placeShip(carrier, 'A', 1, 'vertical');
        gameboard.placeShip(battleship, 'B', 2, 'vertical');
        gameboard.placeShip(destroyer, 'C', 3, 'vertical');
        gameboard.placeShip(submarine, 'D', 4, 'vertical');
        gameboard.placeShip(patrolBoat, 'E', 5, 'vertical');

        attackHit = gameboard.receiveAttack(['B', 2]);
        attackMiss = gameboard.receiveAttack(['B', 1]);
    });

    afterAll(() => {
        return logGrid(gameboard.grid), console.log(gameboard.missedAttacks);
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
});
