import * as inputSets from "./11-input";
import { assert } from "./util";

const getPath = i => i.split(",");
const n =  [ 0,  2];
const ne = [ 1,  1];
const se = [ 1, -1];
const s =  [ 0, -2];
const nw = [-1,  1];
const sw = [-1, -1];
const directionsMap = {n, ne, se, s, sw, nw};
const directionsList = [n, ne, se, s, sw, nw];
const getCordinate = ([x, y], [xO, yO]) => [x + xO, y + yO];
const key = ([x, y]: any) => `k${x}.${y}`;
const withinBoundary = ([x, y], [minX, minY, maxX, maxY]) => minX <= x && minY <= y && x <= maxX && y <= maxY;
const getAdjacentsHexs = ([x, y], visited, boundary) => directionsList
                                                        .map(([xO, yO]) => [x + xO, y + yO])
                                                        .filter((h: any) => withinBoundary(h, boundary))
                                                        .filter((h: any) => visited[key(h)] !== true)
                                                        .map(h => ({ location : h, parent : null}));
const findShortestDistance = path => {
    const [cx, cy] = path.map(d => directionsMap[d]).reduce(getCordinate, [0, 0]);
    const quque = [{location: [cx, cy] }];
    const visited = {};
    const boundary = [Math.min(0, cx), Math.min(0, cy), Math.max(0, cx), Math.max(0, cy)];
    let current;
    whileloop:
    while (quque.length) {
        current = quque.shift();
        for (const nextHex of getAdjacentsHexs(current.location, visited, boundary)) {
            visited[key(nextHex.location)] = true;
            nextHex.parent = current;
            if (nextHex.location[0] === 0 && nextHex.location[1] === 0) {
                current = nextHex;
                break whileloop;
            } else {
                quque.push(nextHex);
            }
        }
    }

    let stepsTaken = 0;
    while (current.parent) {
        current = current.parent;
        stepsTaken += 1;
    }
    return stepsTaken;
};

const t1 = findShortestDistance(getPath(inputSets.ip1101));
const t2 = findShortestDistance(getPath(inputSets.ip1102));
const t3 = findShortestDistance(getPath(inputSets.ip1103));
const t4 = findShortestDistance(getPath(inputSets.ip1104));

const shortest = findShortestDistance(getPath(inputSets.ip1105));

assert(t1, 3, "11.1, Test 01");
assert(t2, 0, "11.1, Test 02");
assert(t3, 2, "11.1, Test 03");
assert(t4, 3, "11.1, Test 04");
assert(shortest, 705, "11.1");
