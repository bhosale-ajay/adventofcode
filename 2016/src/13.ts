import { assert } from "./util";

const favoriteNumber = 1364;
const createFloor = (maxX, maxY) => {
    const result = [];
    for (let x = 0; x <= maxX; x++) {
        const row = [];
        for (let y = 0; y <= maxY; y++) {
            const blockKey = (x * x) + (3 * x) + (2 * x * y) + y + ( y * y) + favoriteNumber;
            row[y] = (blockKey.toString(2).match(/1/g) || []).length % 2 === 0;
        }
        result[x] = row;
    }
    return result;
};
const computeFloorKey = (x, y) => x + "." + y;
const nextBlocks = (floor, fromX, fromY, toX, toY) => {
    const result = [[toX + 1, toY], [toX, toY + 1], [toX - 1, toY], [toX, toY - 1]];
    return result.filter(([x, y]) => x >= 0 && x <= floor.length &&
                              y >= 0 && y <= floor[0].length &&
                              !(x === fromX && y === fromY) &&
                              floor[x][y]);
};
let distanceToDestination: any = _ => 0;
const walk = (floor, fromX, fromY, toX, toY, destinationX, destinationY, pathHashKeys, maxLength, visited) => {
    if (toX === destinationX && toY === destinationY) {
        return pathHashKeys.length;
    }
    if (pathHashKeys.length + distanceToDestination(toX, toY, destinationX, destinationY) > maxLength) {
        return 0;
    }
    const destinations = nextBlocks(floor, fromX, fromY, toX, toY);
    const floorKey = computeFloorKey(toX, toY);
    if (visited && visited.indexOf(floorKey) === -1) {
        visited.push(floorKey);
    }
    if (destinations.length === 0) {
        floor[toX][toY] = false;
        return 0;
    }
    if (pathHashKeys.indexOf(floorKey) > -1) {
        return 0;
    }
    pathHashKeys.push(floorKey);
    const shortestPaths = [];
    for (const [nextX, nextY] of destinations) {
        const result = walk(floor, toX, toY, nextX, nextY,  destinationX, destinationY, pathHashKeys, maxLength, visited);
        if (result > 0) {
            shortestPaths.push(result);
        }
    }
    pathHashKeys.pop();
    if (shortestPaths.length > 0) {
        return shortestPaths.reduce((acc, a) => acc < a ? acc : a);
    }
    if (nextBlocks(floor, fromX, fromY, toX, toY).length === 0) {
        floor[toX][toY] = false;
    }
    return 0;
};
const findShortestDistance = () => {
    const floor = createFloor(40, 40);
    distanceToDestination = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);
    return walk(floor, 0, 0, 1, 1, 31, 39, [], 90, null);
};
const visit = () => {
    const floor = createFloor(60, 60);
    const visited = [];
    distanceToDestination = _ => 0;
    walk(floor, 0, 0, 1, 1, -1, -1, [], 50, visited);
    return visited.length;
};
assert(findShortestDistance(), 86, "Day 13 - Set 1");
assert(visit(), 127, "Day 13 - Set 2");
