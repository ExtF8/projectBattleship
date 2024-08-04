import { Ship } from '../modules/classes/Ship';

export function logGrid(grid, gameboard) {
    const letters = 'ABCDEFGHIJ'.split('');
    const table = grid.map((row, rowIndex) => {
        const rowObj = {};
        row.forEach((cell, cellIndex) => {
            let cellValue = cell;
            let hit = gameboard.successfulAttacks;
            let miss = gameboard.missedAttacks;

            // Check for successful attacks and mark cell
            hit.forEach(([letter, number]) => {
                const [attackX, attackY] = gameboard.convertCoordinates([letter, number]);
                if (attackX == cellIndex && attackY == rowIndex) {
                    cellValue = cell.title + ' hit';
                }
            });

            // Check for missed attacks and mark cell
            miss.forEach(([letter, number]) => {
                const [attackX, attackY] = gameboard.convertCoordinates([letter, number]);
                if (attackX == cellIndex && attackY == rowIndex) {
                    cellValue = 'miss';
                }
            });

            if (cell instanceof Ship && cellValue != cell.title + ' hit') {
                cellValue = cell.title;
            }

            rowObj[letters[cellIndex]] = cellValue;
        });
        return rowObj;
    });

    console.table(table);
}
