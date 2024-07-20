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

    beforeEach(() => {
        shipManager = new ShipManager();
        gameboard = new Gameboard(1);
        Ship.defaultShipManager = shipManager;
        carrier = Ship.create(Ship.Types.CARRIER);
        battleship = Ship.create(Ship.Types.BATTLESHIP);
        destroyer = Ship.create(Ship.Types.DESTROYER);
        submarine = Ship.create(Ship.Types.SUBMARINE);
        patrolBoat = Ship.create(Ship.Types.PATROL_BOAT);
    });

    afterEach(() => {
        logGrid(gameboard.grid);
    });

    test('should place ships at specific coordinates', () => {
        gameboard.placeShip(carrier, 'A', 1, 'vertical');
        gameboard.placeShip(battleship, 'B', 2, 'vertical');
        gameboard.placeShip(destroyer, 'C', 3, 'vertical');
        gameboard.placeShip(submarine, 'D', 4, 'vertical');
        gameboard.placeShip(patrolBoat, 'E', 5, 'vertical');

        expect(gameboard.getShipAt('A', 1).id).toBe(carrier.id);
        expect(gameboard.getShipAt('B', 2).id).toBe(battleship.id);
        expect(gameboard.getShipAt('C', 3).id).toBe(destroyer.id);
        expect(gameboard.getShipAt('D', 4).id).toBe(submarine.id);
        expect(gameboard.getShipAt('E', 5).id).toBe(patrolBoat.id);
    });
});
// test('should receive attack on specified coordinates', () => {});
