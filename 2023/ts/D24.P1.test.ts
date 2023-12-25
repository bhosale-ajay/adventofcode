import { matchesToArray } from 'dotless';
import { mapLine } from './util';

type Hailstone = {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    a: number;
    b: number;
    c: number;
};

const parse = (l: string): Hailstone => {
    const [x, y, z, vx, vy, vz] = matchesToArray(l, /-?\d+/g, m => +m[0]);
    const a = vy;
    const b = vx * -1;
    const c = vy * x - vx * y;
    return { x, y, z, vx, vy, vz, a, b, c };
};

const solve = (fn: string, MIN: number, MAX: number) => {
    const hailstones = mapLine(fn, parse);
    let p1 = 0;
    for (let i = 0; i < hailstones.length; i++) {
        const hs1 = hailstones[i];
        for (let j = 0; j < i; j++) {
            const hs2 = hailstones[j];
            const d = hs1.a * hs2.b - hs1.b * hs2.a;
            if (d === 0) {
                continue;
            }
            const x = (hs1.c * hs2.b - hs1.b * hs2.c) / d;
            const y = (hs1.a * hs2.c - hs1.c * hs2.a) / d;
            if (MIN <= x && x <= MAX && MIN <= y && y <= MAX) {
                if (
                    (x - hs1.x) * hs1.vx >= 0 &&
                    (y - hs1.y) * hs1.vy >= 0 &&
                    (x - hs2.x) * hs2.vx >= 0 &&
                    (y - hs2.y) * hs2.vy >= 0
                ) {
                    p1 = p1 + 1;
                }
            }
        }
    }
    return p1;
};

test('24', () => {
    expect(solve('24-t1', 7, 27)).toEqual(2);
    expect(solve('24', 200000000000000, 400000000000000)).toEqual(20963);
});

// x + y + z at Second 0 999782576459892
// No part 2, got my answer with Python Sympy based on suggestions from solution megathread
