import { Player } from '../src/modules/classes/Player';
import { Ship } from '../src/modules/classes/Ship';
import { initializeGame } from '../src/modules/game/game';

// TODO: write tests for game class
describe('Game logic', () => {
    let playerOne;
    let playerTwo;
    beforeAll(() => {
        const players = initializeGame();

        playerOne = players.playerOne;
        playerTwo = players.playerTwo;
    });

    test('should initialize players and place ships correctly', () => {
        expect(playerOne.gameboard.getShipAt('A', 1)).toBeInstanceOf(Ship);
        expect(playerTwo.gameboard.getShipAt('J', 1)).toBeInstanceOf(Ship);
    });
});
