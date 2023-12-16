import { getLines } from './util';

type Cave = string[];
const [N, E, W, S] = [0, 1, 2, 3];
const delta: [number, number][] = [
    [-1, 0], // N
    [0, 1], // E
    [0, -1], // W
    [1, 0], // S
];
const navigation: Record<string, number[][]> = {
    '.': [[N], [E], [W], [S]],
    '/': [[E], [N], [S], [W]],
    '\\': [[W], [S], [N], [E]],
    '|': [[N], [N, S], [N, S], [S]],
    '-': [[E, W], [E], [W], [E, W]],
};
type Direction = [number, number, number];
const getLocationKey = (l: Direction) => `${l[0]}:${l[1]}`;
const getDirectionKey = (l: Direction) => l.toString();
const boundChecker = (mr: number, mc: number) => (r: number, c: number) =>
    0 <= r && r < mr && 0 <= c && c < mc;

const nextLocations =
    (cave: Cave, isInside: (r: number, c: number) => boolean) =>
    ([r, c, f]: Direction): Direction[] => {
        const tile = cave[r][c];
        const result: Direction[] = [];
        for (const nf of navigation[tile][f]) {
            const [dr, dc] = delta[nf];
            if (isInside(r + dr, c + dc)) {
                result.push([r + dr, c + dc, nf]);
            }
        }
        return result;
    };

const processLight =
    (next: (d: Direction) => Direction[]) => (startLocation: Direction) => {
        const travelLog = new Set<string>();
        const energized = new Set<string>();
        const toVisit: Direction[] = [];
        toVisit.push(startLocation);
        while (toVisit.length > 0) {
            const current = toVisit.shift()!;
            travelLog.add(getDirectionKey(current));
            energized.add(getLocationKey(current));
            next(current)
                .filter(d => !travelLog.has(getDirectionKey(d)))
                .forEach(d => toVisit.push(d));
        }
        return energized.size;
    };

const solve = (fn: string) => {
    const cave = getLines(fn) as Cave;
    const isInside = boundChecker(cave.length, cave[0].length);
    const next = nextLocations(cave, isInside);
    const process = processLight(next);
    const edges: Direction[] = [];
    for (let r = 0; r < cave.length; r++) {
        edges.push([r, 0, E]);
        edges.push([r, cave[0].length - 1, W]);
    }
    for (let c = 0; c < cave[0].length; c++) {
        edges.push([0, c, S]);
        edges.push([cave.length - 1, c, N]);
    }
    let [p1, p2] = [-1, -1];
    for (const [r, c, d] of edges) {
        const e = process([r, c, d]);
        if (p1 === -1) {
            p1 = e;
        }
        p2 = Math.max(e, p2);
    }
    return [p1, p2];
};

test('16', () => {
    expect(solve('16-t1')).toEqual([46, 51]);
    expect(solve('16')).toEqual([7415, 7943]);
});
