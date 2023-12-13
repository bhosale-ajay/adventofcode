import { mapLine, toNumber } from './util';

// Based on https://github.com/hyper-neutrino/advent-of-code/blob/main/2023/day12p2.py
// Explanation : https://www.youtube.com/watch?v=g3Ms5e7Jdqo

type Record = [string, number[]];
const sumIt = (a: number, b: number) => a + b;
const parseLine = (l: string): Record => {
    const [conditions, sizesData] = l.split(' ');
    return [conditions, sizesData.split(',').map(toNumber)];
};
const cache = new Map<string, number>();
const findArrangements = ([conditions, sizes]: Record): number => {
    if (conditions === '') {
        return sizes.length ? 0 : 1;
    }
    if (sizes.length === 0) {
        return conditions.includes('#') ? 0 : 1;
    }
    const key = `${conditions}-${sizes}`;
    if (cache.has(key)) {
        return cache.get(key)!;
    }
    let result = 0;
    const condition = conditions[0];
    if (condition === '.' || condition === '?') {
        result += findArrangements([conditions.slice(1), sizes]);
    }
    const [first, ...rest] = sizes;
    if (condition === '#' || condition === '?') {
        if (
            first <= conditions.length &&
            !conditions.slice(0, first).includes('.') &&
            (first === conditions.length || conditions[first] !== '#')
        ) {
            result += findArrangements([conditions.slice(first + 1), rest]);
        }
    }
    cache.set(key, result);
    return result;
};

const unfold = ([conditions, sizes]: Record): Record => {
    const uc = `${conditions}?${conditions}?${conditions}?${conditions}?${conditions}`;
    const us = [...sizes, ...sizes, ...sizes, ...sizes, ...sizes];
    return [uc, us];
};

const solve = (fn: string) => {
    const records = mapLine(fn, parseLine);
    const p1 = records.map(findArrangements).reduce(sumIt);
    const p2 = records.map(unfold).map(findArrangements).reduce(sumIt);
    return [p1, p2];
};

test('12', () => {
    expect(solve('12-t1')).toEqual([21, 525152]);
    expect(solve('12')).toEqual([7753, 280382734828319]);
});
