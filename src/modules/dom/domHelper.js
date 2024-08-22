export default function addGridLabels(gridElement, gridSize) {
    const letters = 'ABCDEFGHIJ'.split('');
    
    // Create the top row for column labels (letters)
    for (let colIndex = 0; colIndex <= gridSize; colIndex++) {
        const labelElement = document.createElement('div');
        labelElement.classList.add('label');
        
        if (colIndex > 0) {
            labelElement.textContent = letters[colIndex - 1];
        }

        gridElement.appendChild(labelElement);
    }

    // Create the grid cells and row labels (numbers)
    for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
        // Add row label (number)
        const labelElement = document.createElement('div');
        labelElement.classList.add('label');
        labelElement.textContent = rowIndex + 1;
        gridElement.appendChild(labelElement);

        // The renderGameboard function will handle the actual cells
    }
}