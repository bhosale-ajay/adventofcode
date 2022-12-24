import { ascendingBy } from 'dotless';
import { GridLocation, mapLine } from './util';

type Valley = string[][][];
type Radar = Map<number, Valley>;
const deltaMap: any = {
    '^': [-1, 0],
    '<': [0, -1],
    '>': [0, 1],
    v: [1, 0],
};
const parseLine = (l: string) => l.split('').map(c => (c === '.' ? [] : [c]));
const emptyLine = (l: string) => l.split('').map(c => (c === '#' ? [c] : []));
const makeRadar = (fn: string): [Radar, GridLocation] => {
    const valley = mapLine(fn, parseLine);
    const empty = mapLine(fn, emptyLine);
    const radar: Radar = new Map([[0, valley]]);
    const sh = valley.length - 2;
    const sw = valley[0].length - 2;
    const combinations = sw * sh;
    const destination: GridLocation = [sh + 1, sw];
    for (let time = 1; time < combinations; time++) {
        const next = empty.map(row => row.map(col => [...col]));
        const last = radar.get(time - 1) as Valley;
        for (let r = 1; r <= sh; r++) {
            for (let c = 1; c <= sw; c++) {
                for (const b of last[r][c]) {
                    const [dx, dy] = deltaMap[b];
                    let [pr, pc] = [dx + r, dy + c];
                    pr = pr < 1 ? sh : pr > sh ? 1 : pr;
                    pc = pc < 1 ? sw : pc > sw ? 1 : pc;
                    next[pr][pc].push(b);
                }
            }
        }
        radar.set(time, next);
    }
    return [radar, destination];
};
export const next = (r: number, c: number): GridLocation[] => [
    [r - 1, c], // Top
    [r, c - 1], // Left
    [r, c + 1], // Right
    [r + 1, c], // Bottom
    [r, c], // Self
];
const walk = (
    [sr, sc]: GridLocation,
    [dr, dc]: GridLocation,
    radar: Radar,
    startTime: number,
    mt: number
) => {
    const queue: number[][] = [[sr, sc, startTime, 0]];
    const visited = new Set<string>();
    const radarFactor = radar.size;
    const v0 = radar.get(0) as Valley;
    const maxR = v0.length - 1;
    const maxC = v0[0].length - 1;
    const notVisitedAndEmpty =
        (time: number) =>
        ([nr, nc]: GridLocation) => {
            const tf = (time + 1) % radarFactor;
            const valley = radar.get(tf) as Valley;
            if (
                nr < 0 ||
                nc < 0 ||
                maxR < nr ||
                maxC < nc ||
                valley[nr][nc].length > 0
            )
                return false;
            const key = `${nr}:${nc}:${tf}`;
            if (visited.has(key)) {
                return false;
            } else {
                visited.add(key);
                return true;
            }
        };
    while (queue.length > 0) {
        const [r, c, time] = queue.shift() as number[];
        for (const [nr, nc] of next(r, c).filter(notVisitedAndEmpty(time))) {
            if (nr === dr && nc === dc) return time + 1;
            if (startTime - (time + 1) < mt)
                queue.push([
                    nr,
                    nc,
                    time + 1,
                    Math.abs(dr - nr) + Math.abs(dc - nc) + time + 1,
                ]);
        }
        queue.sort(ascendingBy(qi => qi[3]));
    }
    return -1;
};

const solve = (fn: string, mt: number) => {
    const [radar, destination] = makeRadar(fn);
    const start: GridLocation = [0, 1];
    const p1 = walk(start, destination, radar, 0, mt);
    const back = walk(destination, start, radar, p1, mt);
    const p2 = walk(start, destination, radar, back, mt);
    return [p1, p2];
};

test('24', () => {
    expect(solve('24-test', 20)).toEqual([18, 54]);
    // expect(solve('24', 338)).toEqual([322, 974]);
});
