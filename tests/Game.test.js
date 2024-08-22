import { Ship } from '../src/modules/classes/Ship.js';
import Game from '../src/modules/classes/Game.js';
import { logGrid } from '../src/utility/logHelper.js';

// This test suite tests game flow
describe('Game flow logic', () => {
    let game;
    let playerOne;
    let playerTwo;
    let newGame;

    beforeAll(() => {
        game = new Game();
        game.initializeGame();

        // Players
        playerOne = game.playerOne;
        playerTwo = game.playerTwo;

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

        // New empty game
        newGame = new Game();
        newGame.initializeGame();
    });

    afterAll(() => {
        if (!game.startGame) {
            console.log('Game has been reset');
        } else {
            console.log('Player One');
            logGrid(playerOne.gameboard);
            console.log('Player Two');
            logGrid(playerTwo.gameboard);
        }
    });

    test('should initialize players', () => {
        expect(playerOne).toBeDefined();
        expect(playerTwo).toBeDefined();
    });

    test('should place ships for players', () => {
        const playerOneShip = game.playerOne.gameboard.getShipAt(['A', 1]);
        const playerTwoShip = game.playerTwo.gameboard.getShipAt(['J', 1]);

        expect(playerOneShip).toBeInstanceOf(Ship);
        expect(playerTwoShip).toBeInstanceOf(Ship);
    });

    test('should handle attacks and update game state', () => {
        // First turn is from Human
        let attackResult = game.takeTurn(['J', 1]);

        expect(attackResult).toBe(true);
        expect(game.playerTwo.gameboard.getShipAt(['J', 1]).isSunk()).toBe(false);

        // After human attack, computer's turn should happen automatically
        expect(game.currentTurn).toBe(game.playerOne); // Should switch back to player's turn
    });

    test('should switch turns after each attack', () => {
        // Human's turn
        game.takeTurn(['J', 2]); // Human attacks
        expect(game.currentTurn).toBe(game.playerOne); // After computer's automatic turn, it's human's turn again

        // Human's next turn
        game.takeTurn(['J', 3]); // Human attacks
        expect(game.currentTurn).toBe(game.playerOne); // After computer's automatic turn, it's human's turn again
    });

    test('should throw an error if attacking after game is over', () => {
        // Sink all playerTwo ships to end the game
        game.takeTurn(['J', 1]);
        game.takeTurn(['J', 2]);
        game.takeTurn(['J', 3]);
        game.takeTurn(['J', 4]);
        game.takeTurn(['J', 5]);
        game.takeTurn(['I', 2]);
        game.takeTurn(['I', 3]);
        game.takeTurn(['I', 4]);
        game.takeTurn(['I', 5]);
        game.takeTurn(['H', 3]);
        game.takeTurn(['H', 4]);
        game.takeTurn(['H', 5]);
        game.takeTurn(['G', 4]);
        game.takeTurn(['G', 5]);
        game.takeTurn(['G', 6]);
        game.takeTurn(['F', 5]);
        game.takeTurn(['F', 6]); // This should sink the last ship of playerTwo

        expect(game.isGameOver).toBe(true);
        expect(() => game.takeTurn(['A', 1])).toThrow('Game is over'); // Should throw an error since the game is over

        // For visual board check
        console.log('Player One');
        logGrid(playerOne.gameboard);
        console.log('Player Two');
        logGrid(playerTwo.gameboard);
    });

    test('should declare winner after game has ended ', () => {
        const result = game.declareWinner(game.currentTurn);

        expect(result).toBe('Player Two');
    });

    test('should init new game after reset game', () => {
        // Previous game after reset
        game.resetGame();
        expect(game.isGameOver).toBe(false);

        // New game after reset
        newGame.startGame();
        expect(newGame.hasGameStarted).toBe(true);
    });
});
