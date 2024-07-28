import { Player } from '../src/modules/classes/Player';
import { Ship, ShipManager } from '../src/modules/classes/Ship';
import { logGrid } from '../src/utility/logHelper';

describe('Player', () => {
    let player1;
    let computer;
    let shipManager;
    let carrier;
    let battleship;

    beforeAll(() => {
        shipManager = new ShipManager();
        Ship.defaultShipManager = shipManager;

        player1 = new Player(1, 'Player 1', false);
        computer = new Player(2, 'Computer', true);

        carrier = Ship.create(Ship.Types.CARRIER);
        battleship = Ship.create(Ship.Types.BATTLESHIP);

        player1.gameboard.placeShip(carrier, 'A', 1, 'horizontal');
        computer.gameboard.placeShip(battleship, 'B', 2, 'horizontal');
    });

    afterAll(() => {
        return (
            console.log('Computer: '),
            logGrid(computer.gameboard.grid, computer.gameboard),
            console.log('Player 1: '),
            logGrid(player1.gameboard.grid, player1.gameboard)
        );
    });

    test('should place ships correctly on gameboard', () => {
        expect(player1.gameboard.getShipAt('A', 1)).toBe(carrier);
        expect(computer.gameboard.getShipAt('B', 2)).toBe(battleship);
    });

    test(`should allow attack on oponent's gameboard`, () => {
        const hit = player1.attack(computer, ['B', 2]);

        expect(hit).toBe(true);
    });

    test('should record a miss', () => {
        const hit = player1.attack(computer, ['C', 1]);

        expect(hit).toBe(false);
    });

    test('computer player should attack on random coordinates', () => {
        const attackCoordinates = computer.computerAttack(player1);

        expect(Array.isArray(attackCoordinates)).toBe(true);
        expect(attackCoordinates.length).toBe(2);
    });

    test(`should record hit form computer`, () => {
        const hit = computer.attack(player1, ['C', 1]);

        expect(hit).toBe(true);
    });

    test('should record a miss from computer', () => {
        const hit = computer.attack(player1, ['B', 2]);

        expect(hit).toBe(false);
    });
});
