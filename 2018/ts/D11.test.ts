const GRID_SIZE = 300;
const buildGrid = (serialNumber: number) => {
    const grid: number[][] = new Array(GRID_SIZE + 1).fill(0).map(() => new Array(GRID_SIZE + 1).fill(0));
    for (let y = 1; y <= GRID_SIZE; y++) {
        for (let x = 1; x <= GRID_SIZE; x++) {
            const rackId = x + 10;
            const powerLevel = (Math.floor((((rackId * y) + serialNumber) * rackId) / 100)  % 10) - 5;
            grid[y][x] = powerLevel + grid[y][x - 1] + grid[y - 1][x] - grid[y - 1][x - 1];
        }
    }
    return grid;
};

const findLargestPowerCell = (serialNumber: number, fromSize: number = 3, toSize: number = 3) => {
    let cellWithMostPower = "";
    let maxPower = 0;
    const grid = buildGrid(serialNumber);
    for (let sizeCounter = fromSize; sizeCounter <= toSize; sizeCounter++) {
        const sizeFactor = sizeCounter - 1;
        for (let y = 1; y <= GRID_SIZE - sizeFactor; y++) {
            for (let x = 1; x <= GRID_SIZE - sizeFactor; x++) {
                const cellPower = grid[y - 1][x - 1]
                                - grid[y + sizeFactor][x - 1]
                                - grid[y - 1][x + sizeFactor]
                                + grid[y + sizeFactor][x + sizeFactor];
                if (cellPower > maxPower) {
                    maxPower = cellPower;
                    cellWithMostPower = `${x},${y},${sizeCounter}`;
                }
            }
        }
    }
    return cellWithMostPower;
};

test("11", () => {
    expect(findLargestPowerCell(18)).toEqual("33,45,3");
    expect(findLargestPowerCell(42)).toEqual("21,61,3");
    expect(findLargestPowerCell(7511)).toEqual("21,22,3");
    expect(findLargestPowerCell(7511, 12, 14)).toEqual("235,288,13");
});
