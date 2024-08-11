import { Ship } from '../src/modules/classes/Ship';
import { Game } from '../src/modules/classes/Game';
import { logGrid } from '../src/utility/logHelper';

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
            logGrid(game.playerOne.gameboard);
            console.log('Player Two');
            logGrid(game.playerTwo.gameboard);
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
    });

    test('should switch turns after each attacks', () => {
        // Computer turn
        game.takeTurn(['A', 1]);
        // Next turn from Human
        expect(game.currentTurn).toBe(game.playerOne);

        // Human turn
        game.takeTurn(['J', 2]);
        // Next turn from Computer
        expect(game.currentTurn).toBe(game.playerTwo);
    });

    test('should throw an error if attacking after game is over', () => {
        // Sink all playerTwo ships to end the game

        // // Computer turn
        game.takeTurn(['A', 2]);
        // // Human turn
        game.takeTurn(['J', 3]);

        game.takeTurn(['A', 3]);
        game.takeTurn(['J', 4]);

        game.takeTurn(['A', 4]);
        game.takeTurn(['J', 5]);

        game.takeTurn(['A', 5]);
        game.takeTurn(['I', 2]);

        game.takeTurn(['B', 2]);
        game.takeTurn(['I', 3]);

        game.takeTurn(['B', 3]);
        game.takeTurn(['I', 4]);

        game.takeTurn(['B', 4]);
        game.takeTurn(['I', 5]);

        game.takeTurn(['B', 5]);
        game.takeTurn(['H', 3]);

        game.takeTurn(['C', 3]);
        game.takeTurn(['H', 4]);

        game.takeTurn(['C', 4]);
        game.takeTurn(['H', 5]);

        game.takeTurn(['C', 5]);
        game.takeTurn(['G', 4]);

        game.takeTurn(['D', 4]);
        game.takeTurn(['G', 5]);

        game.takeTurn(['D', 5]);
        game.takeTurn(['G', 6]);

        game.takeTurn(['D', 6]);
        game.takeTurn(['F', 5]);

        game.takeTurn(['E', 5]);
        game.takeTurn(['F', 4]);

        game.takeTurn(['E', 6]); // This should sink the last ship of playerOne

        expect(game.isGameOver).toBe(true);
        expect(() => game.takeTurn(['F', 5])).toThrow('Game is over');

        // For visual board check
        console.log('Player One');
        logGrid(game.playerOne.gameboard);
        console.log('Player Two');
        logGrid(game.playerTwo.gameboard);
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
        expect(newGame.startGame).toBe(true);
    });
});
