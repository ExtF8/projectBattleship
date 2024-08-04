import { Ship } from '../src/modules/classes/Ship';
import { Game } from '../src/modules/game/game';
import { logGrid } from '../src/utility/logHelper';

// TODO: write tests for game class
// this is a test
describe('Game logic', () => {
    let game;

    beforeAll(() => {
        game = new Game();
        game.initializeGame();

        // PlayerOne ships
        game.placeShipsForPlayer(game.playerOne, 'BATTLESHIP', ['B', 2], 'vertical');
        game.placeShipsForPlayer(game.playerOne, 'DESTROYER', ['C', 3], 'vertical');
        game.placeShipsForPlayer(game.playerOne, 'SUBMARINE', ['D', 4], 'vertical');
        game.placeShipsForPlayer(game.playerOne, 'PATROL_BOAT', ['E', 5], 'vertical');

        // PlayerTwo ships
        game.placeShipsForPlayer(game.playerTwo, 'BATTLESHIP', ['I', 2], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'DESTROYER', ['H', 3], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'SUBMARINE', ['G', 4], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'PATROL_BOAT', ['F', 5], 'vertical');
    });

    afterAll(() => {
        logGrid(game.playerOne.gameboard.grid, game.playerOne.gameboard);
        logGrid(game.playerTwo.gameboard.grid, game.playerTwo.gameboard);
    });

    test('should initialize players', () => {
        expect(game.playerOne).toBeDefined();
        expect(game.playerTwo).toBeDefined();
    });

    test('should place ships for players', () => {
        game.placeShipsForPlayer(game.playerOne, 'CARRIER', ['A', 1], 'vertical');
        game.placeShipsForPlayer(game.playerTwo, 'CARRIER', ['J', 1], 'vertical');

        expect(game.playerOne.gameboard.getShipAt(['A', 1])).toBeInstanceOf(Ship);
        expect(game.playerTwo.gameboard.getShipAt(['J', 1])).toBeInstanceOf(Ship);
    });

    test('should handle attacks and update game state', () => {
        let attackResult = game.takeTurn(['I', 2]);

        expect(attackResult).toBe(true);
        expect(game.playerTwo.gameboard.getShipAt(['I', 2]).isSunk()).toBe(false);
    });
});
