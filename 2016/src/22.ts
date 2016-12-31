import * as inputSets from "./22-input";
import { assert } from "./util";

// based on https://en.wikipedia.org/wiki/15_puzzle
const parseNode = s => s.match(/\d+/g).map(n => +n);
const getNodes = () => inputSets.ip2201.split("\n").slice(2).map(parseNode);
// tslint:disable-next-line:no-unused-variable
const [xI, yI, sizeI, usedI, availI] = [0, 1, 2, 3, 4];
const areDifferent = (a, b) => !(a[xI] === b[xI] && a[yI] === b[yI]);
const canFit = (a, b) => areDifferent(a, b) && b[availI] >= a[usedI];
const canMoveAround = (nodes, node) => nodes.some(otherNode => canFit(node, otherNode));
const solve = nodes => {
    const maxXLocation = nodes[nodes.length - 1][xI];
    let [pairCount, emptyXIndex, emptyYIndex, wallXIndex, wallYIndex] = [0, 0, 0, -1, -1];
    for (const node of nodes) {
        const [x, y] = node;
        if (node[usedI] === 0) {
            // This will not work if there are more than 1 empty nodes
            emptyXIndex = x;
            emptyYIndex = y;
        } else {
            const isMovable = canMoveAround(nodes, node);
            if (isMovable) {
                pairCount += 1;
            } else if (wallYIndex === -1) {
                wallXIndex = x;
                wallYIndex = y;
            }
        }
    }
    // this may not work for other inputs
    let steps = emptyXIndex - wallXIndex + 1   // Moves to skip wall
              + emptyYIndex                    // Moves to go to top row
              + maxXLocation - wallXIndex + 1  // Moves to go to top right
              + (maxXLocation - 1) * 5;        // Moves to move the data node to left
    return [steps, pairCount];
};
const [steps, pairCount] = solve(getNodes());
assert(pairCount, 1034, "Day 22 - Set 1");
assert(steps, 261, "Day 22 - Set 2");
