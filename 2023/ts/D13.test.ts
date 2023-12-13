import { mapLine } from './util';

type MirrorSide = string[];
type Mirror = [MirrorSide, MirrorSide];

const parseMirror = (ls: string) => {
    const horizontals = ls.split('\n') as MirrorSide;
    const verticals: MirrorSide = [];
    const verticalLength = horizontals[0].length;
    for (let i = 0; i < verticalLength; i++) {
        verticals.push(horizontals.reduce((acc, h) => acc + h[i], ''));
    }
    return [horizontals, verticals] as Mirror;
};

const getDifference = (a: string, b: string) =>
    a.split('').filter((c, i) => c != b[i]).length;

const findReflection = (side: MirrorSide) => {
    for (let i = 1; i < side.length; i++) {
        let isReflecting = true;
        for (let j = 0; j < Math.min(side.length - i, i); j++) {
            if (side[i + j] !== side[i - j - 1]) {
                isReflecting = false;
                break;
            }
        }
        if (isReflecting) {
            return i;
        }
    }
    return undefined;
};

const fixAndFindReflection = (side: MirrorSide) => {
    for (let i = 1; i < side.length; i++) {
        let diff = 0;
        for (let j = 0; j < Math.min(side.length - i, i); j++) {
            diff = diff + getDifference(side[i + j], side[i - j - 1]);
            if (diff > 1) {
                break;
            }
        }
        if (diff === 1) {
            return i;
        }
    }
    return undefined;
};

const summarizeMirror = (
    [hs, vs]: Mirror,
    method: (s: MirrorSide) => number | undefined,
) => {
    const h = method(hs);
    if (h !== undefined) {
        return h * 100;
    }
    const v = method(vs);
    if (v !== undefined) {
        return v;
    }
    return 0;
};

const solve = (fn: string) => {
    const mirrors = mapLine(fn, parseMirror, '\n\n');
    const p1 = mirrors.reduce(
        (acc, m) => acc + summarizeMirror(m, findReflection),
        0,
    );
    const p2 = mirrors.reduce(
        (acc, m) => acc + summarizeMirror(m, fixAndFindReflection),
        0,
    );
    return [p1, p2];
};

test('13', () => {
    expect(solve('13-t1')).toEqual([405, 400]);
    expect(solve('13')).toEqual([33728, 28235]);
});
