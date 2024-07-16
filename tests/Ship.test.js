import { Ship, ShipManager } from '../src/modules/classes/Ship';

describe('Ship class initialization', () => {
    test('Ship object created with id', () => {
        const carrier = Ship.create(Ship.Types.CARRIER);

        expect(carrier.id).toBe(1);
    });

    test(`Ship's Type Title is correctly set`, () => {
        const battleship = Ship.create(Ship.Types.BATTLESHIP);

        expect(battleship.title).toBe(battleship.title);
    });

    test(`Ship's length is correctly set`, () => {
        const destroyer = Ship.create(Ship.Types.DESTROYER);

        expect(destroyer.length).toBe(3);
    });

    test('Hits property is initialized to 0', () => {
        const submarine = Ship.create(Ship.Types.SUBMARINE);

        expect(submarine.hits).toBe(0);
    });
});

describe('Ship methods', () => {
    test('should increment hits when hit method is called', () => {
        const carrier = Ship.create(Ship.Types.CARRIER);

        carrier.hit();
        expect(carrier.hits).toBe(1);

        carrier.hit();
        expect(carrier.hits).toBe(2);
    });

    test('should return false if ship is not sunk', () => {
        const patrolBoat = Ship.create(Ship.Types.PATROL_BOAT);

        patrolBoat.hit();
        expect(patrolBoat.isSunk()).toBe(false);
    });

    test('should return true if ship is sunk', () => {
        const patrolBoat = Ship.create(Ship.Types.PATROL_BOAT);

        patrolBoat.hit();
        patrolBoat.hit();
        expect(patrolBoat.isSunk()).toBe(true);
    });
});

describe.only('Ship manager', () => {
    let shipManager;
    let carrier;
    let battleship;
    let patrolBoat;

    beforeEach(() => {
        shipManager = new ShipManager();
        carrier = Ship.create(Ship.Types.CARRIER);
        battleship = Ship.create(Ship.Types.BATTLESHIP);
        patrolBoat = Ship.create(Ship.Types.PATROL_BOAT);
    });

    test('should add a new ship', () => {
        shipManager.addShip(battleship);

        expect(shipManager.listShips()).toContain(battleship);
    });

    test('should remove a ship by its id', () => {
        shipManager.addShip(carrier);
        shipManager.addShip(battleship);
        const removed = shipManager.removeShip(carrier.id);

        expect(removed).toBe(true);
        expect(shipManager.listShips()).not.toContain(carrier);
    });

    test('should return false when removing a non-existent ship', () => {
        const removed = shipManager.removeShip(999);

        expect(removed).toBe(false);
    });

    test('should find ship by its id', () => {
        shipManager.addShip(carrier);
        shipManager.addShip(battleship);

        const foundShip = shipManager.findShipById(carrier.id);
        expect(foundShip).toBe(carrier);
    });

    test('should return null when given non-existing id', () => {
        shipManager.addShip(battleship);

        const foundShip = shipManager.findShipById(999);
        expect(foundShip).toBe(null);
    });

    test('should list all ships', () => {
        shipManager.addShip(battleship);
        shipManager.addShip(carrier);
        shipManager.addShip(patrolBoat);

        const listShips = shipManager.listShips();
        expect(listShips).toEqual([battleship, carrier, patrolBoat]);
    });

    test('should get all active ships', () => {
        shipManager.addShip(battleship);

        expect(shipManager.getActiveShips()).toContain(battleship);
    });

    test('should get all sunk ships', () => {
        shipManager.addShip(patrolBoat);

        patrolBoat.hit();
        patrolBoat.hit();

        expect(shipManager.getSunkShips()).toContain(patrolBoat);
    });

    test('should get total count of ships ', () => {
        shipManager.addShip(battleship)
        shipManager.addShip(patrolBoat)
        shipManager.addShip(carrier)

        expect(shipManager.getTotalShips()).toBe(3)
    });

    test('should get active ships count', () => {
        shipManager.addShip(battleship)
        battleship.hit()

        expect(shipManager.getActiveShipCount()).toBe(1)
    })

    test('should get sunk ship count', () => {
        shipManager.addShip(battleship)
        shipManager.addShip(patrolBoat)

        patrolBoat.hit()
        patrolBoat.hit()

        expect(shipManager.getSunkShipCount()).toBe(1)
    })
});
