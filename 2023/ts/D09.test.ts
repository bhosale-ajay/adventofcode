import { mapLine, toNumber } from './util';

const getDiff = (
    acc: number[],
    c: number,
    i: number,
    arr: number[],
): number[] => {
    if (i === 0) {
        return acc;
    }
    acc.push(c - arr[i - 1]);
    return acc;
};

const predictValue = (history: number[]) => {
    const seq: number[][] = [];
    let current = history;
    while (current.length > 1) {
        seq.push(current);
        current = current.reduce(getDiff, []);
        if (current.every(c => c === 0)) {
            break;
        }
    }
    return seq.reduceRight(([f, p], hd) => [hd.at(-1)! + f, hd[0] - p], [0, 0]);
};

const solve = (fn: string) => {
    const historyLines = mapLine(fn, l => l.split(' ').map(toNumber));
    return historyLines
        .map(predictValue)
        .reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);
};

test('09', () => {
    expect(solve('09-t1')).toEqual([114, 2]);
    expect(solve('09')).toEqual([2008960228, 1097]);
});
