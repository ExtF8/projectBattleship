import { logGrid } from '../../utility/logHelper';
import { Player } from '../classes/Player';
import { Ship, ShipManager } from '../classes/Ship';

// TODO: refactor as a class
export class Game {
    constructor() {
        this.playerOne = null;
        this.playerTwo = null;
        this.currentTurn = null;
        this.shipManager = new ShipManager();
        Ship.defaultShipManager = this.shipManager;
    }

    initializeGame() {
        this.playerOne = new Player(1, 'Human', false);
        this.playerTwo = new Player(2, 'Computer', true);
        this.initShips();
        this.placeShips();
        this.currentTurn = this.playerOne;

        // logGrid(this.playerOne.gameboard.grid, this.playerOne.gameboard);
        // logGrid(this.playerTwo.gameboard.grid, this.playerTwo.gameboard);
    }

    // Init ships
    initShips() {
        this.playerOneShips = {
            CARRIER: Ship.create(Ship.Types.CARRIER),
            BATTLESHIP: Ship.create(Ship.Types.BATTLESHIP),
            DESTROYER: Ship.create(Ship.Types.DESTROYER),
            SUBMARINE: Ship.create(Ship.Types.SUBMARINE),
            PATROL_BOAT: Ship.create(Ship.Types.PATROL_BOAT),
        };

        this.playerTwoShips = {
            CARRIER: Ship.create(Ship.Types.CARRIER),
            BATTLESHIP: Ship.create(Ship.Types.BATTLESHIP),
            DESTROYER: Ship.create(Ship.Types.DESTROYER),
            SUBMARINE: Ship.create(Ship.Types.SUBMARINE),
            PATROL_BOAT: Ship.create(Ship.Types.PATROL_BOAT),
        };
    }

    // Place ships
    placeShips() {
        // Player One Ships
        this.playerOne.gameboard.placeShip(
            this.playerOneShips.CARRIER,
            'A',
            1,
            'vertical'
        );
        this.playerOne.gameboard.placeShip(
            this.playerOneShips.BATTLESHIP,
            'B',
            2,
            'vertical'
        );
        this.playerOne.gameboard.placeShip(
            this.playerOneShips.DESTROYER,
            'C',
            3,
            'vertical'
        );
        this.playerOne.gameboard.placeShip(
            this.playerOneShips.SUBMARINE,
            'D',
            4,
            'vertical'
        );
        this.playerOne.gameboard.placeShip(
            this.playerOneShips.PATROL_BOAT,
            'E',
            5,
            'vertical'
        );

        // Player Two Ships
        this.playerTwo.gameboard.placeShip(
            this.playerTwoShips.CARRIER,
            'J',
            1,
            'vertical'
        );
        this.playerTwo.gameboard.placeShip(
            this.playerTwoShips.BATTLESHIP,
            'I',
            2,
            'vertical'
        );
        this.playerTwo.gameboard.placeShip(
            this.playerTwoShips.DESTROYER,
            'H',
            3,
            'vertical'
        );
        this.playerTwo.gameboard.placeShip(
            this.playerTwoShips.SUBMARINE,
            'G',
            4,
            'vertical'
        );
        this.playerTwo.gameboard.placeShip(
            this.playerTwoShips.PATROL_BOAT,
            'F',
            5,
            'vertical'
        );

    }
}


// Place attacks
// log results

// Determine winner
