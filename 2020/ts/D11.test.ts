import { any, count } from 'dotless';
import {
    buildGrid,
    cellNeighbors,
    getGrid,
    Grid,
    gridBoundChecker,
    GridLocation,
    neighborsDelta,
} from './util';

const FLOOR = '.';
const EMPTY = 'L';
const OCCUPIED = '#';
type STATE = '.' | 'L' | '#';
type Layout = Grid<STATE>;
type Location = GridLocation;
type AdjacentFinder = (l: Location) => Location[];
type AdjacentStrategy = (layout: Layout) => AdjacentFinder;
const isSeat = (c: STATE) => c !== FLOOR;
const isOccupied = (c: STATE) => c === OCCUPIED;

const simple: AdjacentStrategy = cellNeighbors;
const deep: AdjacentStrategy = (layout: Layout) => {
    const withInBound = gridBoundChecker(layout);
    return ([r, c]: Location) => {
        const result: Location[] = [];
        for (const [dr, dc] of neighborsDelta()) {
            let [nr, nc] = [r + dr, c + dc];
            while (withInBound([nr, nc])) {
                if (isSeat(layout[nr][nc])) {
                    result.push([nr, nc]);
                    break;
                }
                [nr, nc] = [nr + dr, nc + dc];
            }
        }
        return result;
    };
};
const memoize = (base: AdjacentFinder): AdjacentFinder => {
    const memory = new Map<string, Location[]>();
    return ([r, c]: Location): Location[] => {
        const key = `${r}.${c}`;
        if (memory.has(key)) {
            return memory.get(key) as Location[];
        }
        const result = base([r, c]);
        memory.set(key, result);
        return result;
    };
};

const getNextState = (
    layout: Layout,
    adjacentSeatsOf: AdjacentFinder,
    t: number
): [Layout, number] => {
    const rc = layout.length;
    const cc = layout[0].length;
    const occupied = ([r, c]: Location) => isOccupied(layout[r][c]);
    const filled = (l: Location) => count(occupied)(adjacentSeatsOf(l));
    const anyFilled = (l: Location) => any(occupied)(adjacentSeatsOf(l));
    const stateChange = {
        [FLOOR]: (_l: Location) => FLOOR as STATE,
        [EMPTY]: (l: Location) => (anyFilled(l) ? EMPTY : OCCUPIED),
        [OCCUPIED]: (l: Location) => (filled(l) >= t ? EMPTY : OCCUPIED),
    };
    let occupiedCount = 0;
    const nextState = buildGrid(rc, cc, ([ri, ci]) => {
        const current = layout[ri][ci];
        const next = stateChange[current]([ri, ci]);
        if (next === OCCUPIED) {
            occupiedCount = occupiedCount + 1;
        }
        return next;
    });
    return [nextState, occupiedCount];
};

const solve = (layout: Layout, strategy: AdjacentStrategy = simple, t = 4) => {
    let current = layout,
        lastOccupiedCount = -1,
        occupiedCount = 0;
    const finder = memoize(strategy(layout));
    while (lastOccupiedCount !== occupiedCount) {
        lastOccupiedCount = occupiedCount;
        [current, occupiedCount] = getNextState(current, finder, t);
    }
    return occupiedCount;
};

test('11', () => {
    const testInput01 = getGrid('11-test') as Layout;
    const input = getGrid('11') as Layout;

    expect(solve(testInput01)).toEqual(37);
    expect(solve(input)).toEqual(2296);
    expect(solve(testInput01, deep, 5)).toEqual(26);
    expect(solve(input, deep, 5)).toEqual(2089);
});
