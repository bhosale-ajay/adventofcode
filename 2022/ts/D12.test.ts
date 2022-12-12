import {
    Grid,
    GridLocation,
    neighborAddressesST,
    mapLine,
    gridBoundChecker,
} from './util';

type Area = Grid<number>;
type Directory<T> = {
    [key: string]: T;
};
type HightComparer = (a: number, b: number) => boolean;
const locationToString = ([r, c]: GridLocation) => `${r},${c}`;
const stringToLocation = (k: string) =>
    k.split(',').map(n => +n) as GridLocation;
const nextFetcher = (area: Area, comparer: HightComparer) => {
    const boundChecker = gridBoundChecker(area);
    return (l: string) => {
        const [r, c] = stringToLocation(l);
        return neighborAddressesST(r, c).filter(
            ([nr, nc]) =>
                boundChecker([nr, nc]) && comparer(area[r][c], area[nr][nc])
        );
    };
};
const nearestInQueue = (dist: Directory<number>, queue: Set<string>) => {
    let result: string | undefined = undefined;
    for (const current of queue) {
        if (result === undefined || dist[current] < dist[result]) {
            result = current;
        }
    }
    return result;
};
const hike = (
    area: Area,
    start: GridLocation,
    compare: HightComparer,
    reachedDestination: (l: string) => boolean
) => {
    const dist: Directory<number> = {};
    const queue = new Set<string>();
    for (let r = 0; r < area.length; r++) {
        for (let c = 0; c < area[r].length; c++) {
            const l = locationToString([r, c]);
            dist[l] = Infinity;
            queue.add(l);
        }
    }
    const next = nextFetcher(area, compare);
    dist[locationToString(start)] = 0;
    while (queue.size) {
        // as queue.size is > 0, this will always return string
        const nearest = nearestInQueue(dist, queue) as string;
        if (reachedDestination(nearest)) {
            return dist[nearest];
        }
        queue.delete(nearest);
        for (const nl of next(nearest)) {
            const nextKey = locationToString(nl);
            if (queue.has(nextKey)) {
                const d = dist[nearest] + 1;
                if (d < dist[nextKey]) {
                    dist[nextKey] = d;
                }
            }
        }
    }
    return -1;
};

const solve = (fn: string) => {
    let start: GridLocation = [0, 0];
    let end: GridLocation = [0, 0];
    const parseLine = (l: string, r: number) => {
        return l.split('').map((h: string, c: number) => {
            if (h === 'S') {
                start = [r, c];
                return 0;
            }
            if (h === 'E') {
                end = [r, c];
                return 25;
            }
            return h.charCodeAt(0) - 'a'.charCodeAt(0);
        });
    };
    const area = mapLine(fn, parseLine) as Area;
    const endKey = locationToString(end);
    const easyMovement = (a: number, b: number) => b <= a + 1;
    const reachedEnd = (l: string) => l === endKey;
    const maximizeExercise = (a: number, b: number) => b >= a - 1;
    const reachedAnyA = (l: string) => {
        const [r, c] = stringToLocation(l);
        return area[r][c] === 0;
    };
    const p1 = hike(area, start, easyMovement, reachedEnd);
    const p2 = hike(area, end, maximizeExercise, reachedAnyA);
    return [p1, p2];
};

test('12', () => {
    expect(solve('12-test')).toEqual([31, 29]);
    expect(solve('12')).toEqual([380, 375]);
});
