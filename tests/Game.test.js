import { Ship } from '../src/modules/classes/Ship';
import { Game } from '../src/modules/game/game';
import { logGrid } from '../src/utility/logHelper';

describe('Game logic', () => {
    let game;

    beforeEach(() => {
        game = new Game();
        game.initializeGame();

        // PlayerOne ships
        game.placeShipsForPlayer(game.playerOne, 'CARRIER', ['A', 1], 'vertical');
        game.placeShipsForPlayer(game.playerOne, 'BATTLESHIP', ['B', 2], 'vertical');
        game.placeShipsForPlayer(game.playerOne, 'DESTROYER', ['C', 3], 'vertical');
        game.placeShipsForPlayer(game.playerOne, 'SUBMARINE', ['D', 4], 'vertical');
        game.placeShipsForPlayer(game.playerOne, 'PATROL_BOAT', ['E', 5], 'vertical');

        // PlayerTwo ships
        game.placeShipsForPlayer(game.playerTwo, 'CARRIER', ['J', 1], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'BATTLESHIP', ['I', 2], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'DESTROYER', ['H', 3], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'SUBMARINE', ['G', 4], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'PATROL_BOAT', ['F', 5], 'vertical');
    });

    afterAll(() => {
        return (
            console.log('Player One'),
            logGrid(game.playerOne.gameboard),
            console.log('Player Two'),
            logGrid(game.playerTwo.gameboard)
        );
    });

    test('should initialize players', () => {
        expect(game.playerOne).toBeDefined();
        expect(game.playerTwo).toBeDefined();
    });

    test('should place ships for players', () => {
        const playerOneShip = game.playerOne.gameboard.getShipAt(['A', 1]);
        const playerTwoShip = game.playerTwo.gameboard.getShipAt(['J', 1]);

        expect(playerOneShip).toBeInstanceOf(Ship);
        expect(playerTwoShip).toBeInstanceOf(Ship);
    });

    test('should handle attacks and update game state', () => {
        let attackResult = game.takeTurn(['I', 2]);

        expect(attackResult).toBe(true);
        expect(game.playerTwo.gameboard.getShipAt(['I', 2]).isSunk()).toBe(false);
    });

    test('should switch turns after each attacks', () => {
        // Human attack
        game.takeTurn(['J', 1]);
        expect(game.currentTurn).toBe(game.playerTwo);

        // Computer attack
        game.takeTurn(['A', 1]);
        expect(game.currentTurn).toBe(game.playerOne);
    });

    test('should throw an error if attacking after game is over', () => {
        // Sink all playerTwo ships to end the game

        // First take turn is from Player One
        game.takeTurn(['J', 1]);
        // Second take turn is from Computer
        game.takeTurn(['A', 10]);

        game.takeTurn(['J', 2]);
        game.takeTurn(['A', 9]);

        game.takeTurn(['J', 3]);
        game.takeTurn(['A', 8]);

        game.takeTurn(['J', 4]);
        game.takeTurn(['A', 7]);

        game.takeTurn(['J', 5]);
        game.takeTurn(['A', 6]);

        game.takeTurn(['I', 2]);
        game.takeTurn(['A', 10]);

        game.takeTurn(['I', 3]);
        game.takeTurn(['B', 9]);

        game.takeTurn(['I', 4]);
        game.takeTurn(['B', 8]);

        game.takeTurn(['I', 5]);
        game.takeTurn(['B', 7]);

        game.takeTurn(['H', 3]);
        game.takeTurn(['C', 8]);

        game.takeTurn(['H', 4]);
        game.takeTurn(['C', 7]);

        game.takeTurn(['H', 5]);
        game.takeTurn(['C', 6]);

        game.takeTurn(['G', 4]);
        game.takeTurn(['D', 8]);

        game.takeTurn(['G', 5]);
        game.takeTurn(['D', 7]);

        game.takeTurn(['G', 6]);
        game.takeTurn(['D', 6]);

        game.takeTurn(['F', 5]);
        game.takeTurn(['D', 7]);

        game.takeTurn(['F', 6]); // This should sink the last ship of playerTwo

        expect(() => game.takeTurn(['A', 1])).toThrow('Game is over');
        const result = game.declareWinner();
        expect(result).toBe('Player One');
    });
});
