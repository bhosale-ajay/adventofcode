import { getLines } from './util';

const TREE = '#';
const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
];

const countTrees = (area: string[], right = 3, down = 1) => {
    const patternLength = area[0].length;
    let col = 0;
    let count = 0;
    for (let row = 0; row < area.length; row = row + down) {
        if (area[row][col] === TREE) {
            count++;
        }
        col = (col + right) % patternLength;
    }
    return count;
};

const productOfSlopes = (input: string[]) =>
    slopes.reduce(
        (product, [right, down]) => product * countTrees(input, right, down),
        1
    );

test('03', () => {
    const testInput = getLines('03-test');
    const input = getLines('03');
    expect(countTrees(testInput)).toEqual(7);
    expect(countTrees(input)).toEqual(173);
    expect(productOfSlopes(testInput)).toEqual(336);
    expect(productOfSlopes(input)).toEqual(4385176320);
});
