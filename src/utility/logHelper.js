export function logGrid(grid) {
    const letters = 'ABCDEFGHIJ'.split('');
    const table = grid.map(row => {
        const rowObj = {};
        row.forEach((cell, cellIndex) => {
            rowObj[letters[cellIndex]] =
                cell === null ? 'null' : `{${cell.title}}`;
        });
        return rowObj;
    });

    console.table(table);
}
