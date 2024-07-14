import { Ship } from '../src/modules/classes/Ship';

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
