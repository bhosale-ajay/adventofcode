import * as inputSets from "./01-input";
import { assert } from "./util";

const [reduceX, reduceY, increaseX, increaseY, noChangeToX, noChangeToY] = [-1, -1, 1, 1, 0, 0];
const north = {
    L : [reduceX,   noChangeToY, "west"],
    R : [increaseX, noChangeToY, "east"]
};
const east = {
    L : [noChangeToX, increaseY, "north"],
    R : [noChangeToX, reduceY,   "south"]
};
const west = { L : east.R, R : east.L };
const south = { L : north.R, R : north.L };
const directions = { north, east, west, south };
const turn = (currentPosition, instruction) => {
    const [x, y, direction] = currentPosition;
    const [action, distance] = instruction;
    const [xFactor, yFactor, nextDirection] = direction[action];
    return [x + (xFactor * distance), y + (yFactor * distance), directions[nextDirection]];
};
const createTurnRecorder = () => {
    let visitedBlocks = {};
    // there is no way to break the reduce loop
    // hence the hack with found
    let found = false;
    return {
        turn : (currentPosition, specification) => {
            if (found) {
                return currentPosition;
            }
            const [fromX, fromY, direction] = currentPosition;
            const [action, distance] = specification;
            const [xFactor, yFactor, nextDirection] = direction[action];
            let [currentX, currentY] = [fromX, fromY];
            for (let blockCounter = 0; blockCounter < distance; blockCounter++) {
                currentX = currentX + xFactor;
                currentY = currentY + yFactor;
                const blockKey = `B${currentX}_${currentY}`;
                visitedBlocks[blockKey] = (visitedBlocks[blockKey] | 0) + 1;
                if (visitedBlocks[blockKey] > 1) {
                    found = true;
                    break;
                }
            }
            return [currentX, currentY, directions[nextDirection]];
        }
    };
};
const createInstruction = input => [input[0], +(input.substring(1))];
const findShortestPath = (input, turnStrategy = turn) => {
    const start = [0, 0, directions.north];
    const destination = input
        .replace(/ /g, "")
        .split(",")
        .map(createInstruction)
        .reduce(turnStrategy, start);
    const [x, y] = destination;
    return Math.abs(x) + Math.abs(y);
};
const findHQ = (input) => {
    const turnRecorder = createTurnRecorder();
    return findShortestPath(input, turnRecorder.turn);
};
assert(findShortestPath(inputSets.ip0101),   5, "Day 1 - Set 1, Sample input 01");
assert(findShortestPath(inputSets.ip0102),   2, "Day 1 - Set 1, Sample input 02");
assert(findShortestPath(inputSets.ip0103),  12, "Day 1 - Set 1, Sample input 03");
assert(findShortestPath(inputSets.ip0105), 161, "Day 1 - Set 1, Actual input 01");
assert(findHQ(inputSets.ip0104),   4, "Day 1 - Set 2, Sample input 04");
assert(findHQ(inputSets.ip0105), 110, "Day 1 - Set 2, Actual input 01");
