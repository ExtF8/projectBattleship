/**
 * Converts grid coordinates form letter and number to x and y indices.
 *
 * @param {string} letter - The letter representing the column, e.g., (A-J).
 * @param {number} number - The number representing the row, e.g., (1-10).
 * @returns {number[]} - An array containing the x and y indices.
 */
export function convertCoordinatesToIndices(coordinates = []) {
    const [letter, number] = coordinates;
    const x = letterToIndex(letter);
    const y = number - 1;

    return [x, y];
}

/**
 * Converts grid coordinates form x and y indices to letter and number.
 *
 * @param {string} letter - The letter representing the column, e.g., (A-J).
 * @param {number} number - The number representing the row, e.g., (1-10).
 * @returns {number[]} - An array containing the letter and number.
 */
export function convertCoordinatesFromIndices(coordinates = []) {
    const [letter, number] = coordinates;
    const x = indexToLetter(letter);
    const y = number + 1;

    return [x, y];
}

/**
 * Converts a letter to its corresponding index.
 *
 * @param {string} letter - A letter to convert
 * @returns {number} - The index of the letter
 */
export function letterToIndex(letter) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
}

/**
 * Converts an index to its corresponding letter.
 *
 * @param {number} index - An index to convert
 * @returns {string} - The corresponding letter
 */
export function indexToLetter(index) {
    return String.fromCharCode('A'.charCodeAt(0) + index);
}
