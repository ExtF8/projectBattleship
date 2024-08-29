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
            console.log(`Invalid attack at ${coordinates}. Not unique.`);
            return false;
        }

        const result = opponent.gameboard.receiveAttack(coordinates);

        this.attackHistory.push({ coordinates, result });

        // Log attack details
        // console.log(`${opponent} Attack on ${coordinates}: ${result ? 'Hit' : 'Miss'}`);
        // console.log(`${opponent} Current attack history:`, this.attackHistory);

        if (result) {
            this.hits += 1;
        } else {
            this.misses += 1;
        }

        // Log the increment of hits/misses
        // console.log(`${opponent}  Hits: ${this.hits}, Misses: ${this.misses}`);

        return true;
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
     * Makes a computer-controlled attack on an opponent.
     *
     * @param {Player} opponent - The opponent player.
     * @returns {Boolean} - Returns true if the attack was valid, otherwise false.
     */
    computerAttack(opponent) {
        let coordinates;
        let validAttack = false;
        let attackResult = null;
    
        // If there are adjacent cells to attack, prioritize those.
        if (this.adjacentCells.length > 0) {
            while (this.adjacentCells.length > 0 && !validAttack) {
                coordinates = this.adjacentCells.shift();
                console.log('this.adjacentCells at the start of while: ', this.adjacentCells);
    
                // Ensure coordinates have not been attacked before
                if (!this.isInNoGoZone(coordinates) && this.isUniqueAttack(coordinates)) {
                    console.log('misses before validAttack: ', this.misses);
    
                    // Perform the attack
                    validAttack = this.attack(opponent, coordinates);
                    attackResult = this.attackHistory[this.attackHistory.length - 1];
    
                    console.log('misses after validAttack: ', this.misses);
                    console.log('Attempting attack at coordinates:', coordinates);
                    console.log('Attack result:', attackResult.result ? 'Hit' : 'Miss');
    
                    // Check if the attack was a hit
                    if (attackResult.result) {
                        // Update last hit and directions
                        this.lastHit = coordinates;
    
                        if (!this.shipHits.some(hit => this.arraysEqual(hit, this.lastHit))) {
                            this.shipHits.push(this.lastHit);
                        }
    
                        // Update direction only if there are at least two hits in the same direction
                        if (this.shipHits.length >= 2) {
                            const [firstHit, secondHit] = this.shipHits;
                            this.updateDirection(firstHit, secondHit);
                        }
    
                        // Calculate next adjacent cells to attack
                        const nextCells = this.getAdjacentCells(this.lastHit);
                        this.adjacentCells = this.prioritizeDirection(nextCells, this.lastDirection);
    
                        break; // Exit the loop after a successful hit
                    } else {
                        // If the attack was a miss, remove the cell from consideration
                        this.noGoZones.add(coordinates.toString());
                    }
                }
            }
        }
    
        // If no valid attack from adjacent cells, fallback to random attack
        if (!validAttack) {
            do {
                coordinates = this.getRandomCoordinates();
                if (!this.isInNoGoZone(coordinates) && this.isUniqueAttack(coordinates)) {
                    validAttack = this.attack(opponent, coordinates);
                    attackResult = this.attackHistory[this.attackHistory.length - 1];
    
                    console.log('Attempting random attack at coordinates:', coordinates);
                    console.log('Attack result:', attackResult.result ? 'Hit' : 'Miss');
                }
            } while (!validAttack);
        }
    
        // Handle results of the attack
        if (validAttack) {
            if (attackResult.result) { // If it's a hit
                const ship = opponent.gameboard.getShipAt(coordinates);
                if (ship && ship.isSunk()) {
                    console.log('Ship sunk!');
                    this.handleSunkShip([...this.shipHits, this.lastHit]);
                    this.shipHits = [];
                    this.lastHit = null;
                    this.lastDirection = null; // Reset direction after sinking a ship
                } else {
                    const previousHit = this.lastHit;
                    this.lastHit = coordinates;
    
                    if (!this.shipHits.some(hit => this.arraysEqual(hit, this.lastHit))) {
                        this.shipHits.push(this.lastHit);
                    }
    
                    // Update direction after a successful hit
                    if (this.shipHits.length >= 2) {
                        this.updateDirection(previousHit, this.lastHit);
                    }
    
                    // Update adjacent cells to attack next
                    const nextCells = this.getAdjacentCells(this.lastHit);
                    this.adjacentCells = this.prioritizeDirection(nextCells, this.lastDirection);
                }
            }
        } else if (this.adjacentCells.length === 0) {
            // Reset direction and adjacent cells when no valid attacks
            this.lastDirection = null;
            this.adjacentCells = [];
        }
    
        // Additional logs
        console.log('misses: ', this.misses);
        console.log('last hit: ', this.lastHit);
        console.log('shipHits: ', this.shipHits);
        console.log('no go zones: ', this.noGoZones);
    
        return validAttack;
    }
    
    // Prioritize cells in the same direction, but try others if needed
    prioritizeDirection(cells, direction) {
        if (!direction) return cells; // No direction locked in yet
    
        // Separate cells into preferred direction and others
        const preferredCells = cells.filter(cell => this.getDirection(this.lastHit, cell) === direction);
        const otherCells = cells.filter(cell => !preferredCells.includes(cell));
    
        return [...preferredCells, ...otherCells];
    }
    
    // Determine direction based on two consecutive hits
    updateDirection(firstHit, secondHit) {
        if (firstHit[0] === secondHit[0]) { // Same row (horizontal direction)
            this.lastDirection = 'horizontal';
        } else if (firstHit[1] === secondHit[1]) { // Same column (vertical direction)
            this.lastDirection = 'vertical';
        }
    }
    
    // console.log('lastDirection: ', this.lastDirection);
    // console.log('adjacentCells: ', this.adjacentCells);
    // console.log('sunkShips: ', this.sunkShips);

    getDirection(previousHit, currentHit) {
        if (!previousHit || !currentHit) {
            console.error(
                'Invalid coordinates for direction calculation:',
                previousHit,
                currentHit
            );
            return null;
        }

        const [prevLetter, prevNumber] = previousHit;
        const [currLetter, currNumber] = currentHit;

        if (prevLetter === currLetter) {
            return prevNumber < currNumber ? 'down' : 'up';
        } else if (prevNumber === currNumber) {
            return prevLetter < currLetter ? 'right' : 'left';
        }
        return null;
    }


    isValidDirection([letter, number]) {
        if (!this.lastDirection) {
            // console.log(`No direction set, allowing move to ${letter}, ${number}`);
            return true;
        }

        const [prevLetter, prevNumber] = this.lastHit;
        const direction = this.getDirection([prevLetter, prevNumber], [letter, number]);
        // console.log(
        //     `Checking direction for ${letter}, ${number}: expected ${this.lastDirection}, got ${direction}`
        // );
        return direction === this.lastDirection;
    }

    getRandomCoordinates() {
        const letters = 'ABCDEFGHIJ'.split('');
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const number = Math.floor(Math.random() * 10) + 1;
        return [letter, number];
    }

    getAdjacentCells([letter, number]) {
        const letters = 'ABCDEFGHIJ'.split('');
        const letterIndex = letters.indexOf(letter);
        const possibleCells = [];

        if (letterIndex > 0) possibleCells.push([letters[letterIndex - 1], number]); // Left
        if (letterIndex < 9) possibleCells.push([letters[letterIndex + 1], number]); // Right
        if (number > 1) possibleCells.push([letter, number - 1]); // Above
        if (number < 10) possibleCells.push([letter, number + 1]); // Below

        return possibleCells;
    }

    /**
     * Check if the coordinates are in the no-go zone.
     *
     * @param {Array} coordinates - The coordinates to check.
     * @returns {Boolean} - Returns true if coordinates are in the no-go zone, otherwise false.
     */
    isInNoGoZone(coordinates) {
        // console.log('no go zone: ', coordinates)
        return this.noGoZones.has(JSON.stringify(coordinates));
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

        if (!Array.isArray(shipCoordinates[0])) {
            shipCoordinates = [shipCoordinates];
        }

        for (let coord of shipCoordinates) {
            const [letter, number] = coord;
            const letterIndex = letters.indexOf(letter);

            const possibleCells = [
                letterIndex > 0 ? [letters[letterIndex - 1], number] : null,
                letterIndex < 9 ? [letters[letterIndex + 1], number] : null,
                number > 1 ? [letter, number - 1] : null,
                number < 10 ? [letter, number + 1] : null,
                letterIndex > 0 && number > 1 ? [letters[letterIndex - 1], number - 1] : null,
                letterIndex > 0 && number < 10 ? [letters[letterIndex - 1], number + 1] : null,
                letterIndex < 9 && number > 1 ? [letters[letterIndex + 1], number - 1] : null,
                letterIndex < 9 && number < 10 ? [letters[letterIndex + 1], number + 1] : null,
            ];

            possibleCells.forEach(cell => {
                if (cell && !shipCoordinates.some(shipCoord => this.arraysEqual(shipCoord, cell))) {
                    surroundingCells.add(JSON.stringify(cell));
                }
            });
        }

        // console.log('get surrounding Cells: ', surroundingCells);
        return Array.from(surroundingCells).map(cell => JSON.parse(cell));
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
