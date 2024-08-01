import { Player } from '../src/modules/classes/Player';
import { Ship } from '../src/modules/classes/Ship';
import { initializeGame } from '../src/modules/game/game';

// TODO: write tests for game class
// this is a test
describe('Game logic', () => {
    let game;
    
    beforeAll(() => {
        game = new Game();
    });

    test('should initialize players and place ships correctly', () => {
        game = initializeGame();

        expect(game.playerOne).toBeDefined();
        expect(game.playerTwo).toBeDefined();
        
        expect(playerOne.gameboard.getShipAt('A', 1)).toBeInstanceOf(Ship);
        expect(playerTwo.gameboard.getShipAt('J', 1)).toBeInstanceOf(Ship);
    });
    test('should handle attacks and update game state', () => {
        let attackResult = game.playerOne.attack(game.playerTwo, ['J', 1]);
        expect(attackResult).toBe(true);
    });
});
