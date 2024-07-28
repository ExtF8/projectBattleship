import { Ship } from '../modules/classes/Ship';

export function logGrid(grid) {
    const letters = 'ABCDEFGHIJ'.split('');
    const table = grid.map(row => {
        const rowObj = {};
        row.forEach((cell, cellIndex) => {
            // for loop for every missed attack array
                // updates cell to 'miss'
            // for loop for every hit attack array
                // updates cell to cell.title + 'hit'

            // if (cell === null) {
            //     rowObj[letters[cellIndex]] = 'null';
            // } else if (cell === 'miss') {
            //     rowObj[letters[cellIndex]] = 'miss';
            // } else if (cell instanceof Ship) {
            //     rowObj[letters[cellIndex]] = `${cell.title}`;
            // } else {
            //     rowObj[letters[cellIndex]] = 'unknown'; // For any unexpected cases
            // }
            rowObj[letters[cellIndex]] = cell
        });
        return rowObj;
    });

    console.table(table);
}
