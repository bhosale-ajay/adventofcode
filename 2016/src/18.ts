import { assert } from "./util";

const getCellStatus = (left, center, right) => {
    return (left && center && !right) ||
           (!left && center && right) ||
           (left && !center && !right) ||
           (!left && !center && right);
};
const runGrid = (input, rows) => {
    let currentLine = input.split("").map(c => c === "^");
    let countOfSafeTiles = currentLine.reduce((acc, c) => acc + (c ? 0 : 1), 0);
    for (let counter = 1; counter < rows; counter++) {
        const nextLine = [];
        currentLine.forEach((_, i) => {
            const cell = getCellStatus(currentLine[i - 1], currentLine[i], currentLine[i + 1]);
            if (!cell) {
                countOfSafeTiles += 1;
            }
            nextLine[i] = cell;
        });
        currentLine = nextLine;
    }
    return countOfSafeTiles;
};
const input = ".^^^.^.^^^.^.......^^.^^^^.^^^^..^^^^^.^.^^^..^^.^.^^..^.^..^^...^.^^.^^^...^^.^.^^^..^^^^.....^....";
assert(runGrid(".^^.^.^^^^", 10), 38, "Day 18 - Set 1, Sample Input");
assert(runGrid(input, 40), 2013, "Day 18 - Set 1");
// slow - uncomment to run part 2
// Based on Sierpinski triangle formulas
// assert(runGrid(input, 400000), 20006289, "Day 18 - Set 2");
