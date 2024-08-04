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
        // this.placeShips();
        this.currentTurn = this.playerOne;

        // logGrid(this.playerOne.gameboard.grid, this.playerOne.gameboard);
        // logGrid(this.playerTwo.gameboard.grid, this.playerTwo.gameboard);
    }

    // Init ships
    initShips() {
        this.playerOneShips = this.createShips();
        this.playerTwoShips = this.createShips();
    }
    
    // Create ships
    createShips() {
        return {
            CARRIER: Ship.create(Ship.Types.CARRIER),
            BATTLESHIP: Ship.create(Ship.Types.BATTLESHIP),
            DESTROYER: Ship.create(Ship.Types.DESTROYER),
            SUBMARINE: Ship.create(Ship.Types.SUBMARINE),
            PATROL_BOAT: Ship.create(Ship.Types.PATROL_BOAT),
        };
    }

    //  Place ships
    placeShipsForPlayer(player, shipType, startCoordinates, direction) {
        const ship = this.getShipTypesFor(player, shipType)

        if (ship) {
            player.gameboard.placeShip(ship, startCoordinates, direction)
        } else {
            throw new Error('Ship type not found')
        }
    }

    getShipTypesFor(player, shipType) {
        if (player === this.playerOne) {
            return this.playerOneShips[shipType];
        } else if (player === this.playerTwo) {
            return this.playerTwoShips[shipType];
        }

        return null
    }

}

// Place attacks
// log results

// Determine winner
