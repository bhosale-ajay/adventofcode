import { getLines } from './util';

const boundChecker = (mr: number, mc: number) => (r: number, c: number) =>
    0 <= r && r < mr && 0 <= c && c < mc;

const solve = (fn: string) => {
    const map = getLines(fn);
    const desiredSteps = 64;
    const sr = Math.ceil(map.length / 2) - 1;
    const sc = Math.ceil(map[0].length / 2) - 1;
    const isInside = boundChecker(map.length, map[0].length);
    map[sr] = map[sr].replace('S', '.');
    const queue: [number, number, number][] = [[sr, sc, desiredSteps]];
    const seen = new Set<string>([sr + '.' + sc]);
    const answer = new Set<string>();
    while (queue.length) {
        const [r, c, s] = queue.shift()!;
        if (s % 2 === 0) {
            answer.add(r + '.' + c);
        }
        if (s === 0) {
            continue;
        }
        for (const [nr, nc] of [
            [r - 1, c],
            [r, c - 1],
            [r, c + 1],
            [r + 1, c],
        ]) {
            if (
                isInside(nr, nc) &&
                map[nr][nc] === '.' &&
                !seen.has(nr + '.' + nc)
            ) {
                queue.push([nr, nc, s - 1]);
                seen.add(nr + '.' + nc);
            }
        }
    }
    return answer.size;
};

test('21-P1', () => {
    expect(solve('21')).toEqual(3748);
});

// No part 2
// Refer https://github.com/hyper-neutrino/advent-of-code/blob/main/2023/day21p2.py
