/* eslint-disable no-constant-condition */
import { matchesToArray } from 'dotless';
import { mapLine } from './util';

const exp = /\d+/g;
const parseLine = (l: string) => matchesToArray(l, exp, m => +m[0]);
const parse = (fn: string) => mapLine(fn, parseLine);
type Directory<T> = {
    [key: string]: T;
};
const mKey = (x: number, y: number) => `${x},${y}`;
const watchSand = (cave: Directory<string>, abyss: number) => {
    let reachedAbyss = false;
    let sandDropped = 0;
    let p1 = 0;
    while (true) {
        let [x, y] = [500, 0];
        sandDropped = sandDropped + 1;
        while (true) {
            if (y === abyss) {
                if (!reachedAbyss) {
                    p1 = sandDropped - 1;
                    reachedAbyss = true;
                }
                cave[mKey(x, y)] = 'o';
                break;
            } else if (cave[mKey(x, y + 1)] === undefined) {
                y = y + 1;
            } else if (cave[mKey(x - 1, y + 1)] === undefined) {
                x = x - 1;
                y = y + 1;
            } else if (cave[mKey(x + 1, y + 1)] === undefined) {
                x = x + 1;
                y = y + 1;
            } else {
                cave[mKey(x, y)] = 'o';
                break;
            }
        }
        if (x === 500 && y == 0) {
            break;
        }
    }
    return [p1, sandDropped];
};

const solve = (fn: string) => {
    const data = parse(fn);
    // let [sx, hx] = [Number.MAX_SAFE_INTEGER, 0, 0];
    let hy = 0;
    const cave: Directory<string> = {};
    const lineMaker = (f: number, vf: number, vt: number, vertical = false) => {
        const small = Math.min(vf, vt);
        const large = Math.max(vf, vt);
        for (let v = small; v <= large; v++) {
            const l = vertical ? mKey(f, v) : mKey(v, f);
            cave[l] = '#';
        }
    };
    for (const line of data) {
        for (let i = 0; i < line.length - 2; i = i + 2) {
            const [x1, y1, x2, y2] = [
                line[i],
                line[i + 1],
                line[i + 2],
                line[i + 3],
            ];
            if (x1 === x2) {
                lineMaker(x1, y1, y2, true);
            } else {
                lineMaker(y1, x1, x2);
            }
            // sx = Math.min(sx, x1, x2);
            // hx = Math.max(hx, x1, x2);
            hy = Math.max(hy, y1, y2);
        }
    }
    const answer = watchSand(cave, hy + 1);
    // let c = '';
    // for (let y = 0; y <= hy + 2; y++) {
    //     c = c + `${y}`.padEnd(4);
    //     for (let x = sx - 5; x <= hx + 8; x++) {
    //         c = c + (cave[mKey(x, y)] !== undefined ? cave[mKey(x, y)] : '.');
    //     }
    //     c = c + '\n';
    // }
    // console.log(c);
    // console.log(answer);
    return answer;
};

test('14', () => {
    expect(solve('14-test')).toEqual([24, 93]);
    expect(solve('14')).toEqual([885, 28691]);
});
