import { first, map, query, where } from "./linq";
import { assert } from "./util";

const findLayerForSquare = (square) => Math.floor(Math.ceil(Math.sqrt(square)) / 2);
const maxNumberForLayer = n => (n * (n + 1) * 4) + 1;
const closePointsForLayer = n => [7, 5, 3, 1].map(ep => maxNumberForLayer(n) - (n * ep));
const findSteps = (square) => {
    const layer = findLayerForSquare(square);
    const closePoints = closePointsForLayer(layer);
    const distanceToClosestPoint = Math.min(... closePoints.map(p => Math.abs(p - square)));
    return layer + distanceToClosestPoint;
};

function* walkSpiral() {
    let [l, x, y] = [8, 0, 0];
    while (true) {
        yield [++x, y];
        const factor = l / 4;
        for (let i = 1; i < l; i++) {
            switch (Math.floor(i / factor)) {
                case 0:
                    yield [x, ++y];
                    break;
                case 1:
                    yield [--x, y];
                    break;
                case 2:
                    yield [x, --y];
                    break;
                default:
                    yield [++x, y];
                    break;
            }
        }
        l = l + 8;
    }
}
const offsets = [[-1,  1], [ 0,  1], [1,  1], [-1,  0],
                 [ 1,  0], [-1, -1], [0, -1], [ 1, -1]];
const key = ([x, y]) => `s${x}-${y}`;
const adjuacentSquares = ([x, y]) => offsets.map(([xO, yO]) => key([x + xO, y + yO]));
const findLargeSquare = (numberToCross) => {
    const grid = { [key([0, 0])] : 1};
    const computeValue = (s) => adjuacentSquares(s).map(n => grid[n] || 0).reduce((acc, v) => acc + v, 0);
    const setValue = s => grid[key(s)] = computeValue(s);
    return query([walkSpiral(), map(setValue), where(n => n > numberToCross), first]);
};

assert(findSteps(12),                3, "03.1, Test 01");
assert(findSteps(23),                2, "03.1, Test 02");
assert(findSteps(1024),             31, "03.1, Test 03");
assert(findSteps(48),                5, "03.1, Test 04");
assert(findSteps(34),                3, "03.1, Test 05");
assert(findSteps(265149),          438, "03.1");
assert(findLargeSquare(140),       142, "03.2, Test 01");
assert(findLargeSquare(800),       806, "03.2, Test 02");
assert(findLargeSquare(265149), 266330, "03.2");
