import { Player } from '../src/modules/classes/Player';
import { Ship, ShipManager } from '../src/modules/classes/Ship';
import { logGrid } from '../src/utility/logHelper';

describe('Player', () => {
    let player1;
    let computer;
    let shipManager;
    let carrier;
    let battleship;

    beforeEach(() => {
        shipManager = new ShipManager();
        Ship.defaultShipManager = shipManager;

        player1 = new Player(1, 'Player 1', false);
        computer = new Player(2, 'Computer', true);

        carrier = Ship.create(Ship.Types.CARRIER);
        battleship = Ship.create(Ship.Types.BATTLESHIP);

        player1.gameboard.placeShip(carrier, ['A', 1], 'horizontal');
        computer.gameboard.placeShip(battleship, ['B', 2], 'horizontal');
    });

    afterAll(() => {
        return (
            console.log('Player 1: '),
            logGrid(player1.gameboard),
            console.log('Computer: '),
            logGrid(computer.gameboard)
        );
    });

    test('should place ships correctly on gameboard', () => {
        expect(player1.gameboard.getShipAt(['A', 1])).toBe(carrier);
        expect(computer.gameboard.getShipAt(['B', 2])).toBe(battleship);
    });

    test(`should allow attack on oponent's gameboard`, () => {
        const attackResult = player1.attack(computer, ['B', 2]);

        expect(attackResult).toBe(true);
    });

    test('should record a miss', () => {
        const initialMisses = player1.misses;
        const attackResult = player1.attack(computer, ['C', 1]);

        expect(attackResult).toBe(true);
        expect(player1.misses).toBe(initialMisses + 1);
    });

    test('should return false if same coordinates are attacked twice using the attack method', () => {
        // First attack should be valid
        let attackResult = player1.attack(computer, ['C', 2]);
        expect(attackResult).toBe(true);

        // Second attack should be false
        attackResult = player1.attack(computer, ['C', 2]);
        expect(attackResult).toBe(false);
    });

    test('computer player should perform an attack and update attack history', () => {
        const attack = computer.computerAttack(player1);

        expect(attack).toBe(true);
        expect(computer.attackHistory.length).toBe(1);
    });

    test('should record hit form computer', () => {
        let initialHits = computer.hits;
        const attackResult = computer.attack(player1, ['C', 1]);

        expect(attackResult).toBe(true);
        expect(computer.hits).toBe(initialHits + 1);
    });

    test('should record a miss from computer', () => {
        let initialMisses = computer.misses;
        const attackResult = computer.attack(player1, ['B', 2]);

        expect(attackResult).toBe(true);
        expect(computer.misses).toBe(initialMisses + 1);
    });

    test('should log attack hits and misses', () => {
        player1.attack(computer, ['D', 2]);
        player1.attack(computer, ['F', 1]);
        player1.attack(computer, ['E', 1]);
        player1.attack(computer, ['J', 1]);

        const successfulHit = player1.hits;
        const missedHit = player1.misses;

        expect(successfulHit).toBe(1);
        expect(missedHit).toBe(3);
    });

    test('should log attack history', () => {
        player1.attack(computer, ['D', 2]);
        player1.attack(computer, ['F', 1]);
        player1.attack(computer, ['E', 1]);
        player1.attack(computer, ['J', 1]);

        const attackHistory = player1.attackHistory;

        expect(attackHistory).toEqual([
            { coordinates: ['D', 2], result: true },
            { coordinates: ['F', 1], result: false },
            { coordinates: ['E', 1], result: false },
            { coordinates: ['J', 1], result: false },
        ]);
    });

    test('computer player should perform a smart attack based on updated logic', () => {
        const initialAttackHistory = computer.attackHistory.slice();

        const attack = computer.computerAttack(player1);

        expect(attack).toBe(true);
        expect(computer.attackHistory.length).toBe(initialAttackHistory.length + 1);

        // Verify the new attack was based on some strategy (e.g., targeting adjacent cells)
        const lastAttack = computer.attackHistory[initialAttackHistory.length - 1];

        // After hitting a ship, the next attack is adjacent
        if (computer.attackHistory.length > 1) {
            const previousAttack = computer.attackHistory[initialAttackHistory.length - 2];
            if (previousAttack.result) {
                expect(isAdjacent(previousAttack.coordinates, lastAttack.coordinates)).toBe(true);
            }
        }
    });

    test('computer should change attack strategy after consecutive hits', () => {
        // Simulate a scenario where the computer hits a ship multiple times
        computer.attackHistory.push(
            { coordinates: ['B', 2], result: true },
            { coordinates: ['B', 3], result: true },
            { coordinates: ['B', 4], result: true } // assuming part of the same ship
        );

        const attack = computer.computerAttack(player1);

        expect(attack).toBe(true);

        // Check if the attack is still targeting in the same direction or switching based on some condition
        const lastAttack = computer.attackHistory[computer.attackHistory.length - 1];
        const previousAttack = computer.attackHistory[computer.attackHistory.length - 2];

        // Example strategy: If three consecutive hits, don't change direction or target adjacent cells
        if (previousAttack && previousAttack.result) {
            expect(isAdjacent(previousAttack.coordinates, lastAttack.coordinates)).toBe(false);
        }
    });

    // Helper function to check if two coordinates are adjacent
    function isAdjacent(coordinate1, coordinate2) {
        const [row1, col1] = coordinate1;
        const [row2, col2] = coordinate2;

        const rowDifference = Math.abs(row1.charCodeAt(0) - row2.charCodeAt(0));
        const colDifference = Math.abs(col1 - col2);

        return (
            (rowDifference === 1 && colDifference === 0) ||
            (rowDifference === 0 && colDifference === 1)
        );
    }
});
