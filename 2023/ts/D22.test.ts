import { matchesToArray } from 'dotless';
import { mapLine } from './util';

type Brick = {
    cord: number[];
    supports: number[];
    supportedBy: number[];
};

const parseBrick = (l: string): Brick => ({
    cord: matchesToArray(l, /\d+/g, m => +m[0]),
    supports: [],
    supportedBy: [],
});

const overlap = (a: Brick, b: Brick) =>
    Math.max(a.cord[0], b.cord[0]) <= Math.min(a.cord[3], b.cord[3]) &&
    Math.max(a.cord[1], b.cord[1]) <= Math.min(a.cord[4], b.cord[4]);

const sortByZ1 = (a: Brick, b: Brick) => a.cord[2] - b.cord[2];

const settleBricks = (bricks: Brick[]) => {
    bricks.sort(sortByZ1);
    for (let i = 0; i < bricks.length; i++) {
        const upper = bricks[i];
        let settledZ = 1;
        for (let j = 0; j < i; j++) {
            const lower = bricks[j];
            if (overlap(lower, upper)) {
                settledZ = Math.max(settledZ, lower.cord[5] + 1);
            }
        }
        upper.cord[5] = upper.cord[5] - upper.cord[2] + settledZ;
        upper.cord[2] = settledZ;
    }
    bricks.sort(sortByZ1);
    for (let i = 0; i < bricks.length; i++) {
        const upper = bricks[i];
        for (let j = 0; j < i; j++) {
            const lower = bricks[j];
            if (upper.cord[2] - lower.cord[5] === 1 && overlap(lower, upper)) {
                upper.supportedBy.push(j);
                lower.supports.push(i);
            }
        }
    }
    return bricks;
};

const getImpact = (bricks: Brick[], i: number) => {
    const queue = [i];
    const falling = new Set(queue);
    const willFall = (di: number) =>
        bricks[di].supportedBy.every(sb => falling.has(sb));
    while (queue.length > 0) {
        const f = queue.shift()!;
        for (const di of bricks[f].supports.filter(willFall)) {
            falling.add(di);
            queue.push(di);
        }
    }
    return falling.size - 1;
};

const solve = (fn: string) => {
    const bricks = settleBricks(mapLine(fn, parseBrick));
    let [p1, p2] = [0, 0, 0];
    for (let i = 0; i < bricks.length; i++) {
        const impact = getImpact(bricks, i);
        p1 = p1 + (impact > 0 ? 0 : 1);
        p2 = p2 + impact;
    }
    return [p1, p2];
};

test('22', () => {
    expect(solve('22-t1')).toEqual([5, 7]);
    expect(solve('22')).toEqual([451, 66530]);
});
