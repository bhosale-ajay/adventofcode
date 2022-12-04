import { mapLine } from './util';
import { matchesToArray } from 'dotless';

type Pairs = [number, number, number, number];
const exp = /\d+/g;
const parseLine = (l: string) => matchesToArray(l, exp, m => +m[0]) as Pairs;
const parse = (fn: string) => mapLine(fn, parseLine);

const isFullyContain = ([s1, e1, s2, e2]: Pairs) =>
    (s1 <= s2 && e2 <= e1) || (s2 <= s1 && e1 <= e2);

const isOverLap = ([s1, e1, s2, e2]: Pairs) =>
    (s1 <= s2 && s2 <= e1) || (s2 <= s1 && s1 <= e2);

const solve = (ip: string) =>
    parse(ip).reduce(
        ([p1, p2], pairs) => [
            p1 + (isFullyContain(pairs) ? 1 : 0),
            p2 + (isOverLap(pairs) ? 1 : 0),
        ],
        [0, 0]
    );

test('04', () => {
    const t = solve('04-test');
    const a = solve('04');
    expect(t).toEqual([2, 4]);
    expect(a).toEqual([453, 919]);
});
