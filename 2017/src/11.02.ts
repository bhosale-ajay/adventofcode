import * as inputSets from "./11-input";
import { assert } from "./util";

const n =  [ 0,  2];
const ne = [ 1,  1];
const se = [ 1, -1];
const s =  [ 0, -2];
const nw = [-1,  1];
const sw = [-1, -1];
const directions = {n, ne, se, s, sw, nw};
const next = ([x, y], [xo, yo]) => [x + xo, y + yo];
const distance = (x, y) => x >= y ? x : ((y - x) / 2) + x;
const findShortestDistance = path => {
    let max = 0;
    const [x, y] = path.split(",").reduce((from, d) => {
        const [tx, ty] = next(from, directions[d]);
        max = Math.max(max, distance(Math.abs(tx), Math.abs(ty)));
        return [tx, ty];
    }, [0, 0]);
    return [distance(Math.abs(x), Math.abs(y)), max];
};

const [t1] = findShortestDistance(inputSets.ip1101);
const [t2] = findShortestDistance(inputSets.ip1102);
const [t3] = findShortestDistance(inputSets.ip1103);
const [t4] = findShortestDistance(inputSets.ip1104);
const [shortest, maxDistance] = findShortestDistance(inputSets.ip1105);

assert(t1, 3, "11.1, Test 01");
assert(t2, 0, "11.1, Test 02");
assert(t3, 2, "11.1, Test 03");
assert(t4, 3, "11.1, Test 04");
assert(shortest,     705, "11.1");
assert(maxDistance, 1469, "11.2");
