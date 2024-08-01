import { logGrid } from '../../utility/logHelper';
import { Player } from '../classes/Player';
import { Ship, ShipManager } from '../classes/Ship';

// Init Players
let playerOne;
let playerTwo;
let shipManager;

// Ships
const PLAYER_ONE_SHIPS = {};

const PLAYER_TWO_SHIPS = {};

// Init ships
function initShips() {
    shipManager = new ShipManager();
    Ship.defaultShipManager = shipManager;

    PLAYER_ONE_SHIPS.CARRIER = Ship.create(Ship.Types.CARRIER);
    PLAYER_ONE_SHIPS.BATTLESHIP = Ship.create(Ship.Types.BATTLESHIP);
    PLAYER_ONE_SHIPS.DESTROYER = Ship.create(Ship.Types.DESTROYER);
    PLAYER_ONE_SHIPS.SUBMARINE = Ship.create(Ship.Types.SUBMARINE);
    PLAYER_ONE_SHIPS.PATROL_BOAT = Ship.create(Ship.Types.PATROL_BOAT);

    PLAYER_TWO_SHIPS.CARRIER = Ship.create(Ship.Types.CARRIER);
    PLAYER_TWO_SHIPS.BATTLESHIP = Ship.create(Ship.Types.BATTLESHIP);
    PLAYER_TWO_SHIPS.DESTROYER = Ship.create(Ship.Types.DESTROYER);
    PLAYER_TWO_SHIPS.SUBMARINE = Ship.create(Ship.Types.SUBMARINE);
    PLAYER_TWO_SHIPS.PATROL_BOAT = Ship.create(Ship.Types.PATROL_BOAT);
}

// Place ships on a gameboard
function placePlayerOneShips() {
    playerOne.gameboard.placeShip(PLAYER_ONE_SHIPS.CARRIER, 'A', 1, 'vertical');
    playerOne.gameboard.placeShip(
        PLAYER_ONE_SHIPS.BATTLESHIP,
        'B',
        2,
        'vertical'
    );
    playerOne.gameboard.placeShip(
        PLAYER_ONE_SHIPS.DESTROYER,
        'C',
        3,
        'vertical'
    );
    playerOne.gameboard.placeShip(
        PLAYER_ONE_SHIPS.SUBMARINE,
        'D',
        4,
        'vertical'
    );
    playerOne.gameboard.placeShip(
        PLAYER_ONE_SHIPS.PATROL_BOAT,
        'E',
        5,
        'vertical'
    );

    logGrid(playerOne.gameboard.grid, playerOne.gameboard);
    // return playerOne.gameboard;
}

function placePlayerTwoShips() {
    playerTwo.gameboard.placeShip(PLAYER_TWO_SHIPS.CARRIER, 'J', 1, 'vertical');
    playerTwo.gameboard.placeShip(
        PLAYER_TWO_SHIPS.BATTLESHIP,
        'I',
        2,
        'vertical'
    );
    playerTwo.gameboard.placeShip(
        PLAYER_TWO_SHIPS.DESTROYER,
        'H',
        3,
        'vertical'
    );
    playerTwo.gameboard.placeShip(
        PLAYER_TWO_SHIPS.SUBMARINE,
        'G',
        4,
        'vertical'
    );
    playerTwo.gameboard.placeShip(
        PLAYER_TWO_SHIPS.PATROL_BOAT,
        'F',
        5,
        'vertical'
    );

    logGrid(playerTwo.gameboard.grid, playerTwo.gameboard);
}

// Start game
export function initializeGame() {
    playerOne = new Player(1, 'Human', false);
    playerTwo = new Player(2, 'Computer', true);
    initShips();
    placePlayerOneShips();
    placePlayerTwoShips();

    return { playerOne, playerTwo };
}

// Place attacks
// log results

// Determine winner
