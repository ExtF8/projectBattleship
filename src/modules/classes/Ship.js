/**
 * Represents a Ship.
 *
 * @class
 */
export class Ship {
    /**
     *
     * @param { number } id - The ID of the ship.
     * @param { string } shipClass - Type of the Ships class, e.g., Carrier/Submarine/Cruiser/Destroyer/Patrol Boat.
     * @param { number } length - Length/Size of the Ship according to its class.
     */
    constructor(id, shipClass, length) {
        this.id = id;
        this.shipClass = shipClass;
        this.length = length;
        this.hits = 0;
    }

    /**
     * Counter method for tracking how many times the Ship has been hit.
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
        return this.hits === this.length;
    }
}
