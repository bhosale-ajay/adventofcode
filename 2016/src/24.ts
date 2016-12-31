import * as inputSets from "./24-input";
import { assert, permutator } from "./util";

const createCell = (row, col, data) => {
    const isOpen = data !== "#";
    const isPointOfInterest = isOpen && data !== ".";
    return {row, col, isOpen, isPointOfInterest, data, route : "", parent : null};
};
const createFloor = (input) => {
    const pointsOfInterests = [];
    const otherPoints = [];
    const floor = input.split("\n").map((line, rowIndex) => line.split("").map((data, colIndex) => {
        const cell = createCell(rowIndex, colIndex, data);
        if (cell.isPointOfInterest) {
            pointsOfInterests[cell.data] = [rowIndex, colIndex];
            if (cell.data !== "0") {
                otherPoints.push(cell.data);
            }
        }
        return cell;
    }));
    return [floor, pointsOfInterests, otherPoints];
};
const findNeighbors = (floor, rowIndex, colIndex, forRoute) => {
    const neighbors = [[rowIndex + 1, colIndex],
                       [rowIndex, colIndex + 1],
                       [rowIndex - 1, colIndex],
                       [rowIndex, colIndex - 1]];
    return neighbors.filter(([r, c]) => r >= 0 && r <= floor.length &&
                                        c >= 0 && c <= floor[0].length &&
                                        floor[r][c].isOpen &&
                                        floor[r][c].route !== forRoute)
                    .map(([r, c]) => floor[r][c]);
};
const calculateDistance = (floor, [fromRowIndex, fromColIndex], [toRowIndex, toColIndex]) => {
    const startNode = floor[fromRowIndex][fromColIndex];
    const queue = [startNode];
    const path = [];
    let destination = null;
    let routeId = fromRowIndex + ":" + fromColIndex + ":" + toRowIndex + ":" + toColIndex;
    startNode.route = routeId;
    startNode.parent = null;

    whileloop:
    while (queue.length) {
        const current = queue.shift();
        for (const neighbor of findNeighbors(floor, current.row, current.col, routeId)) {
            neighbor.parent = current;
            neighbor.route = routeId;
            if (neighbor.row === toRowIndex && neighbor.col === toColIndex) {
                destination = current;
                break whileloop;
            } else {
                queue.push(neighbor);
            }
        }
    }
    while (destination.parent !== null) {
        path.push(destination);
        destination = destination.parent;
    }
    return path.length;
};
const createDistanceMap = (floor, pointsOfInterests) => {
    const distanceMap = [];
    for (let from = 0; from < pointsOfInterests.length - 1; from ++) {
        if (!distanceMap[from]) {
            distanceMap[from] = [];
        }
        for (let destination = from + 1; destination < pointsOfInterests.length; destination++) {
            if (!distanceMap[destination]) {
                distanceMap[destination] = [];
            }
            const distance = calculateDistance(floor, pointsOfInterests[from], pointsOfInterests[destination]);
            distanceMap[from][destination] = distance;
            distanceMap[destination][from] = distance;
        }
    }
    return distanceMap;
};
const [floor, pointsOfInterests, otherPoints] = createFloor(inputSets.ip2401);
const distanceMap = createDistanceMap(floor, pointsOfInterests);
const pathCombinations = permutator(otherPoints);
const shortestPath = (expected, returnToZero = false) => {
    let result = expected;
    for (const pathCombination of pathCombinations) {
        let distance = distanceMap[0][pathCombination[0]];
        for (let j = 1; j < pathCombination.length; j++) {
            distance += distanceMap[pathCombination[j - 1]][pathCombination[j]];
            if (distance > result) {
                break;
            }
        }
        if (returnToZero) {
            distance += distanceMap[pathCombination[pathCombination.length - 1]][0];
        }
        if (result > distance) {
            result = distance;
        }
    }
    return result;
};
assert(shortestPath(500), 442, "Day 24 - Set 1");
assert(shortestPath(670, true), 660, "Day 24 - Set 2");
