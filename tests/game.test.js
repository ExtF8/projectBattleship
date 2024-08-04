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
    });

    afterAll(() => {
        logGrid(game.playerOne.gameboard.grid, game.playerOne.gameboard);
        logGrid(game.playerTwo.gameboard.grid, game.playerTwo.gameboard);
    });

    test('should initialize players and place ships correctly', () => {
        expect(game.playerOne).toBeDefined();
        expect(game.playerTwo).toBeDefined();

        expect(game.playerOne.gameboard.getShipAt(['A', 1])).toBeInstanceOf(Ship);
        expect(game.playerTwo.gameboard.getShipAt(['J', 1])).toBeInstanceOf(Ship);
    });

    test('should handle attacks and update game state', () => {
        let attackResult = game.playerOne.attack(game.playerTwo, ['J', 1]);

        expect(attackResult).toBe(true);
        expect(game.playerTwo.gameboard.getShipAt(['J', 1]).isSunk()).toBe(false);
        // Same spot should not be attackable
        attackResult = game.playerOne.attack(game.playerTwo, ['J', 1]);
        // console.log(game.playerOne.attackHistory);
        expect(attackResult).toBe(false);
    });
});
