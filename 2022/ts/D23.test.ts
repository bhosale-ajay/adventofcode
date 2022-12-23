import { getLines, GridLocation, neighborAddressesALL } from './util';

const MIN = Number.MIN_SAFE_INTEGER;
const MAX = Number.MAX_SAFE_INTEGER;
type Proposal = {
    [key: string]: string[];
};
const key = (n: GridLocation) => n.toString();
const keyToPos = (s: string) => s.split(',').map(Number) as GridLocation;
const checkLine = (f: Set<string>, l: string, ri: number) => {
    for (let ci = 0; ci < l.length; ci++) {
        if (l[ci] === '#') {
            f.add(key([ri, ci]));
        }
    }
    return f;
};
const N = [
    [0, 1, 2],
    [-1, 0],
];
const S = [
    [5, 6, 7],
    [1, 0],
];
const W = [
    [0, 3, 5],
    [0, -1],
];
const E = [
    [2, 4, 7],
    [0, 1],
];
const allEmpty = (ns: boolean[]) => !ns.includes(false);
const explorer = (
    f: Set<string>,
    ep: string,
    p: Proposal,
    options: number[][][]
) => {
    const [ri, ci] = keyToPos(ep);
    const neighbors = neighborAddressesALL(ri, ci).map(l => !f.has(key(l)));
    if (allEmpty(neighbors)) {
        return;
    }
    const result = options.find(([ns]) => ns.every(n => neighbors[n]));
    if (result === undefined) {
        return;
    }
    const [dr, dc] = result[1];
    const pl = key([ri + dr, ci + dc]);
    if (p[pl] === undefined) {
        p[pl] = [ep];
    } else {
        p[pl].push(ep);
    }
};
const solve = (fn: string) => {
    const lines = getLines(fn);
    const field = lines.reduce(checkLine, new Set<string>());
    const options = [N, S, W, E];
    const boundAt10 = [MAX, MIN, MAX, MIN];
    let r = 1;
    let p2 = -1;
    for (; r <= 10 || p2 === -1; r++) {
        const proposal: Proposal = {};
        for (const ep of field) {
            explorer(field, ep, proposal, options);
        }
        for (const pl in proposal) {
            if (proposal[pl].length === 1) {
                const ep = proposal[pl][0];
                field.delete(ep);
                field.add(pl);
            }
        }
        if (p2 === -1 && Object.keys(proposal).length === 0) {
            p2 = r;
        }
        options.push(options.shift() as number[][]);
        if (r === 10) {
            for (const ep of field) {
                const [ri, ci] = keyToPos(ep);
                boundAt10[0] = Math.min(ri, boundAt10[0]);
                boundAt10[1] = Math.max(ri, boundAt10[1]);
                boundAt10[2] = Math.min(ci, boundAt10[2]);
                boundAt10[3] = Math.max(ci, boundAt10[3]);
            }
        }
    }
    const p1 =
        Math.abs(boundAt10[1] - boundAt10[0] + 1) *
            Math.abs(boundAt10[3] - boundAt10[2] + 1) -
        field.size;
    return [p1, p2];
};

test('23', () => {
    expect(solve('23-test')).toEqual([110, 20]);
    expect(solve('23')).toEqual([4052, 978]);
});
