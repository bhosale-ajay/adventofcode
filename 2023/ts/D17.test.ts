import { mapLine, toNumber } from './util';

type State = {
    r: number;
    c: number;
    dr: number;
    dc: number;
    ss: number; // straight steps
    hl: number;
    fs: boolean; // not start
};
const delta: [number, number][] = [
    [-1, 0], // N
    [0, 1], // E
    [0, -1], // W
    [1, 0], // S
];
const getStateKey = ({ r, c, dr, dc, ss }: State) =>
    `${r}:${c}:${dr}:${dc}:${ss}`;
const pushToQueue = (
    a: State[],
    r: number,
    c: number,
    dr: number,
    dc: number,
    ss: number,
    hl: number,
) => {
    const s = { r, c, dr, dc, ss, hl, fs: false };
    for (let i = a.length - 1; 0 <= i; i--) {
        if (a[i].hl <= s.hl) {
            a.splice(i + 1, 0, s);
            return;
        }
    }
    if (a.length === 0) {
        a.push(s);
        return;
    }
    a.unshift(s);
};
const findHeatLoss = (
    layout: number[][],
    maxStraightSteps: number,
    minStepsBeforeTurn: number,
) => {
    const [tr, tc] = [layout.length - 1, layout[0].length - 1];
    const inBound = (r: number, c: number) =>
        0 <= r && r <= tr && 0 <= c && c <= tc;
    const start: State = { r: 0, c: 0, dr: 0, dc: 0, ss: 0, hl: 0, fs: true };
    const toVisit: State[] = [start];
    const seen = new Set<string>();
    while (toVisit.length) {
        const state = toVisit.shift()!;
        const { r, c, dr, dc, ss, hl, fs } = state;
        if (r === tr && c === tc && minStepsBeforeTurn <= ss) {
            return hl;
        }
        const key = getStateKey(state);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        // Excluding first position
        // Follow same direction for min step
        if (!fs && ss < maxStraightSteps) {
            const nr = r + dr;
            const nc = c + dc;
            if (inBound(nr, nc)) {
                pushToQueue(
                    toVisit,
                    nr,
                    nc,
                    dr,
                    dc,
                    ss + 1,
                    hl + layout[nr][nc],
                );
            }
        }

        if (fs || minStepsBeforeTurn <= ss) {
            // Take left or right
            for (const [ndr, ndc] of delta) {
                if (
                    // same direction - avoid it, covered above
                    (ndr === dr && ndc === dc) ||
                    // same direction - avoid it, covered above
                    (ndr === dr * -1 && ndc === dc * -1)
                ) {
                    continue;
                }
                const nr = r + ndr;
                const nc = c + ndc;
                if (inBound(nr, nc)) {
                    pushToQueue(
                        toVisit,
                        nr,
                        nc,
                        ndr,
                        ndc,
                        1,
                        hl + layout[nr][nc],
                    );
                }
            }
        }
    }
    return -1;
};

const solve = (fn: string) => {
    const layout = mapLine(fn, l => l.split('').map(toNumber));
    const p1 = findHeatLoss(layout, 3, 0);
    const p2 = findHeatLoss(layout, 10, 4);
    return [p1, p2];
};

test('17', () => {
    expect(solve('17-t1')).toEqual([102, 94]);
    expect(solve('17')).toEqual([1246, 1389]);
});
