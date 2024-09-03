import { Gameboard } from './Gameboard.js';

/**
 * Represents Player
 *
 * @class
 */
export class Player {
    /**
     * Creates an instance of Player.
     *
     * @param {number} id - Id of the player.
     * @param {string} name - Name of the player.
     * @param {boolean} isComputer - Indicates if player is a computer.
     */
    constructor(id, name, isComputer) {
        this.id = id;
        this.name = name;
        this.isComputer = isComputer;
        this.gameboard = new Gameboard(id);
        this.attackHistory = [];
        this.hits = 0;
        this.misses = 0;
        this.lastHit = null; // Track the last successful hit
        this.lastDirection = null; // Track the direction of the last hit
        this.adjacentCells = []; // Track potential adjacent cells to attack
        this.sunkShips = [];
        this.shipHits = []; // Track successful hits on a ship to get surrounding cells after it has been sunk
        this.noGoZones = new Set(); // Track no-go zones around sunk ships
    }

    /**
     * Attacks an opponent at the specified coordinates.
     *
     * @param {Player} opponent - The opponent player.
     * @param {Array} coordinates - The coordinates of attack [letter, number].
     * @returns {boolean} - Returns true if attack was successful (hit or miss), otherwise false.
     */
    attack(opponent, coordinates = []) {
        // Early exit if the attack is not unique
        if (!this.isUniqueAttack(coordinates)) {
            return false;
        }

        const result = opponent.gameboard.receiveAttack(coordinates);
        this.attackHistory.push({ coordinates, result });

        if (result) {
            this.hits += 1;
        } else {
            this.misses += 1;
        }

        return true;
    }

    /**
     * Makes a computer-controlled attack on an opponent.
     *
     * @param {Player} opponent - The opponent player.
     * @returns {Boolean} - Returns true if the attack was valid, otherwise false.
     */
    computerAttack(opponent) {
        let coordinates;
        let validAttack = false;

        // Prioritize attacking adjacent cells
        if (this.adjacentCells.length > 0) {
            ({ validAttack, coordinates } = this.attackAdjacentCells(opponent));
        }

        // First attack
        if (!validAttack) {
            // Fallback to random attack if no valid adjacent cells
            ({ validAttack, coordinates } = this.attackRandomCoordinates(opponent));
        }

        // Handle attack results
        if (validAttack) {
            this.handlePostAttack(opponent, coordinates);
        }

        return validAttack;
    }

    /**
     * Attempts to attack using prioritized adjacent cells.
     *
     * @param {Player} opponent - The opponent player.
     * @returns {Object} - Returns an object containing validAttack (boolean) and coordinates (Array).
     */
    attackAdjacentCells(opponent) {
        let coordinates;
        let validAttack = false;

        while (this.adjacentCells.length > 0) {
            coordinates = this.adjacentCells.shift();

            if (this.isValidAttack(coordinates)) {
                validAttack = this.attack(opponent, coordinates);
                const attackResult = this.attackHistory[this.attackHistory.length - 1];

                if (attackResult.result) {
                    this.processSuccessfulHit(coordinates);
                    break;
                } else {
                    this.processMissedAttack();
                    break;
                }
            }
        }

        return { validAttack, coordinates };
    }

    /**
     * Performs attack on random coordinates.
     *
     * @param {Player} opponent - The opponent player
     * @returns {Object} - Returns an object containing validAttack (boolean) and coordinates (Array).
     */
    attackRandomCoordinates(opponent) {
        let coordinates;
        let validAttack = false;

        do {
            coordinates = this.getRandomCoordinates();
            if (this.isValidAttack(coordinates)) {
                validAttack = this.attack(opponent, coordinates);
            }
        } while (!validAttack);

        return { validAttack, coordinates };
    }

    /**
     * Handles logic for a successful hit.
     *
     * @param {Array} coordinates - The coordinates of the successful hit.
     */
    processSuccessfulHit(coordinates) {
        this.shipHits.push(coordinates);
        this.lastHit = coordinates;

        if (this.shipHits.length === 2) {
            // Determine the direction (horizontal or vertical) after the second hit
            this.lastDirection = this.getGeneralDirection(this.shipHits);

            // Update adjacent cells based on the determined direction
            this.adjacentCells = this.filterCellsInDirection(
                this.adjacentCells,
                this.lastDirection
            );

            // Update potential adjacent cells to target
            this.updateAdjacentCells(this.lastHit);
        } else {
            // For the first hit or subsequent hits, update potential adjacent cells
            this.updateAdjacentCells(this.lastHit);
        }
    }

    /**
     * Handles logic for a miss.
     *
     */
    processMissedAttack() {
        if (this.lastDirection) {
            // Only keep cells in the current direction
            this.adjacentCells = this.filterCellsInDirection(
                this.adjacentCells,
                this.lastDirection
            );

            if (this.adjacentCells.length === 0) {
                // Reset direction if no cells left in direction
                this.lastDirection = null;
            }
        }
    }

    /**
     * Handles post-attack logic including ship sinking.
     *
     * @param {Player} opponent - The opponent player.
     * @param {Array} coordinates - The coordinates of the attack.
     */
    handlePostAttack(opponent, coordinates) {
        const attackResult = this.attackHistory[this.attackHistory.length - 1];

        if (attackResult.result) {
            this.processHit(opponent, coordinates);
        } else {
            this.processMiss();
        }
    }

    /**
     * Process the logic when an attack is a hit.
     *
     * @param {Player} opponent - The opponent player.
     * @param {Array} coordinates - The coordinates of the attack.
     */
    processHit(opponent, coordinates) {
        const ship = opponent.gameboard.getShipAt(coordinates);

        if (ship.isSunk()) {
            this.handleSunkShip([...this.shipHits, this.lastHit]);
        } else {
            this.updateHitState(coordinates);
        }
    }

    /**
     * Processes the logic when an attack is a miss.
     *
     */
    processMiss() {
        if (this.adjacentCells.length === 0) {
            this.lastDirection = null;
            this.adjacentCells = [];
        }
    }

    /**
     * Updates the players's state after a hit.
     *
     * @param {Array} coordinates - The coordinates of the hit.
     */
    updateHitState(coordinates) {
        this.shipHits.push(coordinates);
        this.lastHit = coordinates;
        this.lastDirection =
            this.shipHits.length > 1 ? this.getGeneralDirection(this.shipHits) : null;
        this.updateAdjacentCells(this.lastHit);
    }

    /**
     * Determines the general direction (horizontal or vertical) based on two hits.
     *
     * @param {Array} hits - An array of hit coordinates.
     * @returns {string} - The direction ('horizontal' or 'vertical') or null if not determinable.
     */
    getGeneralDirection(hits) {
        if (hits.length < 2) return null; // Need at least two hits to determine direction

        const [firstHit, secondHit] = hits;
        const [firstLetter, firstNumber] = firstHit;
        const [secondLetter, secondNumber] = secondHit;

        if (firstLetter === secondLetter) {
            return 'vertical';
        } else if (firstNumber === secondNumber) {
            return 'horizontal';
        }

        return null;
    }

    /**
     * Filters adjacent cells based on the determined direction of the ship.
     *
     * @param {Array} adjacentCells - Array of potential adjacent cells.
     * @param {string} direction - The direction of the ship ('horizontal' or 'vertical').
     * @returns {Array} - Filtered array of cells.
     */
    filterCellsInDirection(adjacentCells, direction) {
        if (direction === 'horizontal') {
            return adjacentCells.filter(([letter, number]) => {
                // Retain cells in the same row (same number)
                return number === this.shipHits[0][1]; // Compare with the number of the first hit
            });
        } else if (direction === 'vertical') {
            return adjacentCells.filter(([letter, number]) => {
                // Retain cells in the same column (same letter)
                return letter === this.shipHits[0][0]; // Compare with the letter of the first hit
            });
        }

        // If no direction is determined, do not filter
        return adjacentCells;
    }

    /**
     * Update the list of adjacent cells to attack based on the last hit.
     *
     * @param {Array} lastHit - The coordinates of the last hit.
     */
    updateAdjacentCells(lastHit) {
        const possibleCells = this.getAdjacentCells(lastHit);
        let filteredCells;

        if (this.shipHits.length > 1 && this.lastDirection) {
            // If a direction is determined, filter adjacent cells in that direction
            filteredCells = this.filterCellsInDirection(possibleCells, this.lastDirection);
        } else {
            // No direction determined, consider all adjacent cells
            filteredCells = possibleCells;
        }

        // Create a Set of stringified cells to ensure uniqueness
        const uniqueCellSet = new Set([
            ...this.adjacentCells.map(JSON.stringify),
            ...filteredCells.map(JSON.stringify),
        ]);

        // Convert bask to array, parsing JSON strings, and filter out cells
        this.adjacentCells = Array.from(uniqueCellSet)
            .map(cell => JSON.parse(cell))
            .filter(cell => this.isValidAttack(cell));
    }

    /**
     * Get adjacent cells in a specified direction or in all directions if no direction is specified.
     *
     * @param {Array} lastHit - The coordinates of the last hit, e.g., ['B', 4].
     * @param {string} [direction=null] - The direction to filter adjacent cells ('horizontal', 'vertical', or null for all).
     * @returns {Array} - An array of adjacent cells in the specified direction.
     */
    getAdjacentCells([letter, number], direction = null) {
        const letters = 'ABCDEFGHIJ'.split('');
        const letterIndex = letters.indexOf(letter);
        const possibleCells = [];

        // Determine possible cells in all directions if no specific direction is provided
        if (!direction || direction === 'horizontal') {
            // Left
            if (letterIndex > 0) possibleCells.push([letters[letterIndex - 1], number]);
            // Right
            if (letterIndex < 9) possibleCells.push([letters[letterIndex + 1], number]);
        }

        if (!direction || direction === 'vertical') {
            // Up
            if (number > 1) possibleCells.push([letter, number - 1]);
            // Down
            if (number < 10) possibleCells.push([letter, number + 1]);
        }

        return possibleCells;
    }

    /**
     * Generates random coordinates for computer attack.
     *
     * @returns {Array} - An array containing coordinates, letter and number, e.g., ['B', 4].
     */
    getRandomCoordinates() {
        const letters = 'ABCDEFGHIJ'.split('');
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const number = Math.floor(Math.random() * 10) + 1;
        return [letter, number];
    }

    /**
     * Handle the event when a ship is sunk by marking the surrounding cells as no-go zones.
     *
     * @param {Array} shipCoordinates - The coordinates of the sunk ship.
     */
    handleSunkShip(shipCoordinates) {
        this.sunkShips.push([...shipCoordinates]);

        // Mark surrounding cells as no-go zones
        const surroundingCells = this.getSurroundingCells(shipCoordinates);
        surroundingCells.forEach(cell => this.noGoZones.add(JSON.stringify(cell)));

        // Reset shipHits, hit and direction after sinking a ship
        this.shipHits = [];
        this.lastHit = null;
        this.lastDirection = null;
    }

    /**
     * Get the surrounding cells of the sunk ship.
     *
     * @param {Array} shipCoordinates - The coordinates of the sunk ship.
     * @returns {Array} - Returns an array of surrounding coordinates.
     */
    getSurroundingCells(shipCoordinates) {
        const surroundingCells = new Set();
        const letters = 'ABCDEFGHIJ'.split('');
        let surroundingCoordinates = [];

        if (!Array.isArray(shipCoordinates[0])) {
            shipCoordinates = [shipCoordinates];
        }

        shipCoordinates.forEach(coordinate => {
            const possibleCells = this.getAdjacentCoordinates(coordinate, letters);

            possibleCells.forEach(cell => {
                if (cell && !this.isPartOfShip(shipCoordinates, cell)) {
                    surroundingCells.add(JSON.stringify(cell));
                }
            });
        });

        // Ensure surrounding cells are correctly marked as no-go zones
        this.noGoZones = new Set([...this.noGoZones, ...surroundingCells]);

        surroundingCoordinates = Array.from(surroundingCells).map(cell => JSON.parse(cell));

        return surroundingCoordinates;
    }

    /**
     * Get all adjacent cells to a given coordinate.
     *
     * @param {Array} coordinate - The coordinate to find adjacent cells for.
     * @param {Array} letters - The array of board letters.
     * @returns {Array} - An array of adjacent coordinates
     */
    getAdjacentCoordinates(coordinate, letters) {
        const [letter, number] = coordinate;
        const letterIndex = letters.indexOf(letter);

        const adjacentCoordinates = [
            letterIndex > 0 ? [letters[letterIndex - 1], number] : null,
            letterIndex < 9 ? [letters[letterIndex + 1], number] : null,
            number > 1 ? [letter, number - 1] : null,
            number < 10 ? [letter, number + 1] : null,
            letterIndex > 0 && number > 1 ? [letters[letterIndex - 1], number - 1] : null,
            letterIndex > 0 && number < 10 ? [letters[letterIndex - 1], number + 1] : null,
            letterIndex < 9 && number > 1 ? [letters[letterIndex + 1], number - 1] : null,
            letterIndex < 9 && number < 10 ? [letters[letterIndex + 1], number + 1] : null,
        ];

        return adjacentCoordinates;
    }

    /**
     * Check if a coordinate is part of the ship.
     *
     * @param {Array} shipCoordinates - The coordinates of the ship.
     * @param {Array} cell - The cell to check.
     * @returns {boolean} - Returns true if cell is part of the ship, otherwise false.
     */
    isPartOfShip(shipCoordinates, cell) {
        return shipCoordinates.some(shipCoord => this.arraysEqual(shipCoord, cell));
    }

    /**
     * Validates if the attack can be made at the given coordinates.
     *
     * @param {Array} coordinates - The coordinates to validate.
     * @returns {Boolean} - True if the attack is valid, otherwise false.
     */
    isValidAttack(coordinates) {
        return !this.isInNoGoZone(coordinates) && this.isUniqueAttack(coordinates);
    }

    /**
     * Check if the coordinates are in the no-go zone.
     *
     * @param {Array} coordinates - The coordinates to check.
     * @returns {Boolean} - Returns true if coordinates are in the no-go zone, otherwise false.
     */
    isInNoGoZone(coordinates) {
        return this.noGoZones.has(JSON.stringify(coordinates));
    }

    /**
     * Validate if the attack has already been made on coordinates.
     *
     * @param {Array} coordinates - The coordinates to check.
     * @returns {Boolean} - Returns true if coordinates are unique, otherwise false.
     */
    isUniqueAttack(coordinates) {
        // Check if attack has already been made
        let attackExists = this.attackHistory.some(item => {
            return this.arraysEqual(coordinates, item.coordinates);
        });

        // Return true if no previous attack was found
        return !attackExists;
    }

    /**
     * Helper function to compare two arrays.
     *
     * @param {Array} arr1 - First array, incoming coordinates.
     * @param {Array} arr2 - Second array, existing coordinates.
     * @returns {Boolean} - Returns true if arrays are equal, otherwise false.
     */
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        return arr1.every((value, index) => value === arr2[index]);
    }

    /**
     * Resets players hits and misses to zero.
     *
     */
    resetScore() {
        this.hits = 0;
        this.misses = 0;
    }
}
