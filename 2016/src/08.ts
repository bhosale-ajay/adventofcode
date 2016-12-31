import * as inputSets from "./08-input";
import { assert } from "./util";

const operations = inputSets.ip0802.split("\n");
const [rowCount, colCount] = inputSets.ip0802GridSize;
const grid = [];

for (let rowCounter = 0; rowCounter < rowCount; rowCounter++ ) {
    grid[rowCounter] = [];
    for (let colCounter = 0; colCounter < colCount; colCounter++ ) {
        grid[rowCounter][colCounter] = 0;
    }
}

let rect = (colToLit, rowToLit) => {
    for (let rowCounter = 0; rowCounter < rowToLit; rowCounter++ ) {
        for (let colCounter = 0; colCounter < colToLit; colCounter++ ) {
            grid[rowCounter][colCounter] = 1;
        }
    }
};

const rotateColumn = (colToRotare, by) => {
    const updatedValues = [];
    for (let rowCounter = 0; rowCounter < rowCount; rowCounter++) {
        updatedValues[(rowCounter + by) % rowCount] = grid[rowCounter][colToRotare];
    }
    for (let rowCounter = 0; rowCounter < rowCount; rowCounter++) {
        grid[rowCounter][colToRotare] = updatedValues[rowCounter];
    }
};

const rotateRow = (rowsToRotate, by) => {
    const updatedValues = [];
    for (let colCounter = 0; colCounter < colCount; colCounter++) {
        updatedValues[(colCounter + by) % colCount] = grid[rowsToRotate][colCounter];
    }
    for (let colCounter = 0; colCounter < colCount; colCounter++) {
        grid[rowsToRotate][colCounter] = updatedValues[colCounter];
    }
};

operations.forEach(o => {
    // dirty string parsing, convert to regex
    if (o.startsWith("rotate column x=")) {
        const values = (o.split("=")[1]).split(" by ");
        rotateColumn(+(values[0]), +(values[1]));
    } else if (o.startsWith("rect ")) {
        const values = (o.split("rect ")[1]).split("x");
        rect(+(values[0]), +(values[1]));
    } else if (o.startsWith("rotate row y=")) {
        const values = (o.split("=")[1]).split(" by ");
        rotateRow(+(values[0]), +(values[1]));
    }
});
let litCount = grid.reduce((acc, row) => row.reduce((rowAcc, col) => rowAcc + col, 0) + acc, 0);
assert(litCount, 106, "Day 8 - Set 1");
// Part 2
// const replaceChars = { "0" : " ", "1" : "#", "," : "" };
// const message = grid.join("\n").replace(/0|1|,/g, (c) => replaceChars[c]);
// console.log(message);
