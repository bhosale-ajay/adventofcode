import { matchesToArray } from 'dotless';
import { mapLine } from './util';

type Location = [number, number];
type Direction = 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w';
type Path = Direction[];
type Floor = Set<string>;
const key = ([x, y]: Location) => `${x}:${y}`;
const navigator: Record<Direction, (l: Location) => Location> = {
    se: ([x, y]) => [x + 1, y - 1],
    sw: ([x, y]) => [x - 1, y - 1],
    ne: ([x, y]) => [x + 1, y + 1],
    nw: ([x, y]) => [x - 1, y + 1],
    e: ([x, y]) => [x + 2, y],
    w: ([x, y]) => [x - 2, y],
};
const regex = /(se)|(sw)|(ne)|(nw)|(w)|(e)/g;
const lineToPath = (l: string) => matchesToArray(l, regex, m => m[0]) as Path;
const parse = (ip: string) => mapLine(ip, lineToPath);
const next = (l: Location, d: Direction) => navigator[d](l);
const center = [0, 0] as Location;
const locate = (tp: Path) => key(tp.reduce(next, center));
const delta = Object.values(navigator).map(n => n([0, 0]));
const cache = new Map<string, string[]>();
const adjacentOf = (t: string) => {
    let result = cache.get(t);
    if (result === undefined) {
        const [x, y] = t.split(':').map(n => +n);
        result = delta.map(([dx, dy]) => key([x + dx, y + dy]));
        cache.set(t, result);
    }
    return result;
};

const iterate = (floor: Floor): Floor => {
    const countIfBlack = (c: number, k: string) => c + (floor.has(k) ? 1 : 0);
    const updated = new Set<string>();
    const tilesToConsider = new Set<string>(floor.keys());
    for (const tile of floor.keys()) {
        for (const n of adjacentOf(tile)) {
            tilesToConsider.add(n);
        }
    }
    for (const tile of tilesToConsider) {
        let state = floor.has(tile);
        const blackNeighbors = adjacentOf(tile).reduce(countIfBlack, 0);
        if (state && (blackNeighbors === 0 || blackNeighbors > 2)) {
            state = false;
        } else if (!state && blackNeighbors === 2) {
            state = true;
        }
        if (state) {
            updated.add(tile);
        }
    }
    return updated;
};

const navigateAndFlip = (ip: string) => {
    const tilePaths = parse(ip);
    let floor = new Set<string>();
    for (const tp of tilePaths) {
        const tile = locate(tp);
        if (floor.has(tile)) {
            floor.delete(tile);
        } else {
            floor.add(tile);
        }
    }
    const blackTilesP1 = floor.size;
    for (let day = 1; day <= 100; day++) {
        floor = iterate(floor);
    }
    const blackTilesP2 = floor.size;
    return [blackTilesP1, blackTilesP2];
};

test('24', () => {
    expect(navigateAndFlip('24-test')).toEqual([10, 2208]);
    expect(navigateAndFlip('24')).toEqual([330, 3711]);
});
