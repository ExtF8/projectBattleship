/**
 *
 * Enum for ship types
 * @readonly
 * @enum {string}
 */
const ShipTypes = {
    CARRIER: 'CARRIER',
    BATTLESHIP: 'BATTLESHIP',
    DESTROYER: 'DESTROYER',
    SUBMARINE: 'SUBMARINE',
    PATROL_BOAT: 'PATROL_BOAT',
};

/**
 *
 * Data for each ship type, including id, title, and length.
 * @typedef {Object} ShipInfo
 * @property {number} id - The ID of the ship.
 * @property {string} title - The title of the ship class.
 * @property {number} length - The length of the ship.
 */

/**
 *
 * Object containing data for each ship type.
 * @type {Object<string, ShipInfo>}
 */
const ShipData = {
    [ShipTypes.CARRIER]: { id: 1, title: 'Carrier', length: 5 },
    [ShipTypes.BATTLESHIP]: { id: 2, title: 'Battleship', length: 4 },
    [ShipTypes.DESTROYER]: { id: 3, title: 'Destroyer', length: 3 },
    [ShipTypes.SUBMARINE]: { id: 4, title: 'Submarine', length: 3 },
    [ShipTypes.PATROL_BOAT]: { id: 5, title: 'Patrol Boat', length: 2 },
};

/**
 * Represents a Ship.
 *
 * @class
 */
export class Ship {
    /**
     *
     * @type {Object<string, string>}
     * @static
     */
    static Types = ShipTypes;

    /**
     *
     * @type {Object<string, ShipInfo>}
     * @static
     */
    static Data = ShipData;

    /**
     * Default ShipManager instance.
     *
     * @type {ShipManager||null}
     */
    static defaultShipManager = null;

    /**
     * Creates an instance of Ship.
     *
     * @param {number} id - The ID of the ship.
     * @param {string} title - The class title of the ship.
     * @param {number} length - The length of the ship.
     */
    constructor(id, title, length) {
        this.id = id;
        this.title = title;
        this.length = length;
        this.hits = 0;
    }

    /**
     * Static factory method to create a ship of a given type.
     *
     * @param {string} shipType - The type of ship to create (must be a key in Ship.Types).
     * @param {ShipManager} [shipManager=Ship.defaultShipManager] - The ShipManager instance to add the created ship to.
     * @returns {Ship} - A new Ship instance.
     * @throws {Error} - If the ship type is invalid.
     * @example
     * // Initialize the ShipManager before calling create method
     * const shipManager = new ShipManager();
     * Ship.defaultShipManager = shipManager;
     */
    static create(shipType, shipManager = Ship.defaultShipManager) {
        const shipInfo = Ship.Data[shipType];

        if (!shipInfo) {
            throw new Error(`Invalid ship type: ${shipType}`);
        }

        const newShip = new Ship(shipInfo.id, shipInfo.title, shipInfo.length);

        if (shipManager) {
            shipManager.addShip(newShip);
        }

        return newShip;
    }

    /**
     * Counter method for tracking how many times the Ship has been hit.
     *
     */
    hit() {
        this.hits += 1;
    }

    /**
     * Calculates whether a ship is considered sunk based on its length and the number of hits it has received.
     *
     * @returns { boolean } - Returns true if the Ship is sunk, otherwise false.
     */
    isSunk() {
        let isSunk = false;
        if (this.hits === this.length) {
            isSunk = true;
        }
        return isSunk;
    }
}

/**
 * Represents Ship Manager.
 *
 * @class
 */
export class ShipManager {
    /**
     * Creates instance of ShipManager.
     *
     */
    constructor() {
        this.ships = [];
    }

    /**
     * Adds a new ship to the manager.
     *
     * @param {Ship} ship - Ship to be added.
     */
    addShip(ship) {
        this.ships.push(ship);
    }

    /**
     * Removes a ship from the manager by ID.
     *
     * @param {number} id - The ID of the ship to be removed.
     * @returns {boolean} - Return true if a ship is removed, otherwise false.
     */
    removeShip(id) {
        const index = this.ships.findIndex(ship => ship.id === id);
        if (index !== -1) {
            this.ships.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Finds ship by its ID.
     *
     * @param {number} id - The ID of the ship to find
     * @returns {Ship|null} - The ship with the specified ID, otherwise null.
     */
    findShipById(id) {
        return this.ships.find(ship => ship.id === id) || null;
    }

    /**
     * Lists all ships in the manager.
     *
     * @returns {Ship[]} - An array of all ships.
     */
    listShips() {
        return this.ships;
    }

    /**
     * Lists all active (not sunk) ships in the manager.
     *
     * @returns {Ship[]} - An array of all active ships.
     */
    getActiveShips() {
        return this.ships.filter(ship => !ship.isSunk());
    }

    /**
     * Lists all sunk ships in the manager.
     *
     * @returns {Ship[]} - An array af all sunk ships.
     */
    getSunkShips() {
        return this.ships.filter(ship => ship.isSunk());
    }

    /**
     * Gets the number of active (not sunk) ships in the manager.
     *
     * @returns {number} - The number of active ships.
     */
    getActiveShipCount() {
        return this.getActiveShips().length;
    }

    /**
     * Gets the number of sunk ships in the manager.
     *
     * @returns {number} - The number of sunk ships.
     */
    getSunkShipCount() {
        return this.getSunkShips().length;
    }

    /**
     * Gets the total number of ships in the manager.
     *
     * @returns {number} -Total number of the ships.
     */
    getTotalShips() {
        return this.ships.length;
    }

    /**
     * Removes all ships from the manager.
     *
     */
    clearShips() {
        this.ships = [];
    }
}
