import { assert } from "./util";
declare var require: any;

// tslint:disable-next-line:no-var-requires
const md5 = require("./../lib/md5");
const validKeys = ["b", "c", "d", "e", "f"];
const isOpen = (key) => validKeys.some(k => k === key);
const nextBlocks = (currentX, currentY, passCode, pathSoFar) => {
    const result = [[currentX - 1, currentY, "U"],  // UP
                    [currentX + 1, currentY, "D"],  // Down
                    [currentX, currentY - 1, "L"],  // Left
                    [currentX, currentY + 1, "R"]]; // Right
    const hash: string = md5(passCode + pathSoFar);
    const doorOpen = [isOpen(hash[0]), isOpen(hash[1]), isOpen(hash[2]), isOpen(hash[3])];
    return result.filter(([x, y], index) => x >= 0 && x <= 3 &&
                                            y >= 0 && y <= 3 &&
                                            doorOpen[index]);
};
const findShortestPath = (x, y, passCode, pathSoFar = "") => {
    if (pathSoFar.length > 10) {
        return "";
    }
    if (x === 3 && y === 3) {
        return pathSoFar;
    }
    let shortestPath = "";
    for (const [nextX, nextY, path] of nextBlocks(x, y, passCode, pathSoFar)) {
        const result = findShortestPath(nextX, nextY, passCode, pathSoFar + path);
        if (result.length > 0 && (shortestPath.length > result.length || shortestPath.length === 0)) {
            shortestPath = result;
        }
    }
    return shortestPath;
};
const findLongestPathLength = (x, y, passCode, pathSoFar = "") => {
    if (x === 3 && y === 3) {
        return pathSoFar.length;
    }
    let longestPathLength = 0;
    for (const [nextX, nextY, path] of nextBlocks(x, y, passCode, pathSoFar)) {
        const result = findLongestPathLength(nextX, nextY, passCode, pathSoFar + path);
        if (result > 0 && (longestPathLength < result || longestPathLength === 0)) {
            longestPathLength = result;
        }
    }
    return longestPathLength;
};
assert(findShortestPath(0, 0, "vwbaicqe"), "DRDRULRDRD", "Day 17 - Set 1");
assert(findLongestPathLength(0, 0, "vwbaicqe"), 384, "Day 17 - Set 2");
