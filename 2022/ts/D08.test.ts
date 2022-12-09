import { Grid, GridLocation, BoundChecker, mapLine } from './util';

type Trees = Grid<number>;
type Walker = (l: GridLocation) => GridLocation;
type Result = [boolean, number];
const top: Walker = ([r, c]) => [r, c - 1];
const left: Walker = ([r, c]) => [r - 1, c];
const right: Walker = ([r, c]) => [r + 1, c];
const bottom: Walker = ([r, c]) => [r, c + 1];
const walkTowards =
    (trees: Trees, withInBound: BoundChecker, next: Walker) =>
    ([r, c]: GridLocation): Result => {
        const thisHeight = trees[r][c];
        let viewDepth = 0;
        let [nr, nc] = next([r, c]);
        while (withInBound([nr, nc])) {
            viewDepth = viewDepth + 1;
            if (thisHeight <= trees[nr][nc]) {
                return [false, viewDepth];
            }
            [nr, nc] = next([nr, nc]);
        }
        return [true, viewDepth];
    };
const fold = ([cs, s]: Result, [dcs, ds]: Result): Result => [
    cs || dcs,
    s * ds,
];
const lineToTree = (l: string) => l.split('').map(n => +n);
const solve = (fn: string) => {
    const treePatch = mapLine(fn, lineToTree) as Trees;
    const [rc, cc] = [treePatch.length, treePatch[0].length];
    const withInBound = ([r, c]: GridLocation) =>
        0 <= r && r < rc && 0 <= c && c < cc;
    const onEdge = ([r, c]: GridLocation) =>
        0 === r || r == rc - 1 || 0 === c || c === cc - 1;
    const directions = [
        walkTowards(treePatch, withInBound, top),
        walkTowards(treePatch, withInBound, left),
        walkTowards(treePatch, withInBound, right),
        walkTowards(treePatch, withInBound, bottom),
    ];
    let [p1, p2] = [0, 0];
    for (let ri = 0; ri < rc; ri++) {
        for (let ci = 0; ci < cc; ci++) {
            if (onEdge([ri, ci])) {
                p1 = p1 + 1;
            } else {
                const [canSee, score] = directions
                    .map(d => d([ri, ci]))
                    .reduce(fold, [false, 1]);
                if (canSee) {
                    p1 = p1 + 1;
                }
                if (p2 < score) {
                    p2 = score;
                }
            }
        }
    }
    return [p1, p2];
};

test('08', () => {
    const t = solve('08-test');
    const a = solve('08');
    expect(t).toEqual([21, 8]);
    expect(a).toEqual([1870, 517440]);
});
