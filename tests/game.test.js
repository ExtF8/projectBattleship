import { Ship } from '../src/modules/classes/Ship';
import { Game } from '../src/modules/game/game';
import { logGrid } from '../src/utility/logHelper';

// TODO: write tests for game class
// this is a test
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
        logGrid(game.playerOne.gameboard);
        logGrid(game.playerTwo.gameboard);
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
});
