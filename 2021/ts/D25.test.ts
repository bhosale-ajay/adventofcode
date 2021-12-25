import { mapLine } from './util';

const EAST_HERD = '>';
const SOUTH_HERD = 'v';
const getEastNavigation =
    (n: number) =>
    ([r, c]: [number, number]): [number, number] =>
        c < n ? [r, c + 1] : [r, 0];
const getSouthNavigation =
    (n: number) =>
    ([r, c]: [number, number]): [number, number] =>
        r < n ? [r + 1, c] : [0, c];
const solve = (fn: string) => {
    const sea = mapLine(fn, l => l.split(''));
    const eastBound: [number, number][] = [];
    const southBound: [number, number][] = [];
    const columnCount = sea[0].length;
    const rowCount = sea.length;
    const eastNavigation = getEastNavigation(columnCount - 1);
    const southNavigation = getSouthNavigation(rowCount - 1);
    for (let ri = 0; ri < rowCount; ri++) {
        for (let ci = 0; ci < columnCount; ci++) {
            const occupant = sea[ri][ci];
            if (occupant === EAST_HERD) {
                eastBound.push([ri, ci]);
            } else if (occupant === SOUTH_HERD) {
                southBound.push([ri, ci]);
            }
        }
    }

    const move = (herd: [number, number][], type: string) => {
        const navigation =
            type === EAST_HERD ? eastNavigation : southNavigation;
        const movable: [number, number, number, number, number][] = [];
        for (let i = 0; i < herd.length; i++) {
            const [ri, ci] = herd[i];
            const [nr, nc] = navigation([ri, ci]);
            if (sea[nr][nc] === '.') {
                movable.push([i, ri, ci, nr, nc]);
            }
        }
        for (const [i, ri, ci, nr, nc] of movable) {
            sea[nr][nc] = type;
            sea[ri][ci] = '.';
            herd[i] = [nr, nc];
        }
        return movable.length > 0;
    };

    let anyOneMoved = true;
    let step = 0;
    while (anyOneMoved) {
        const eastHerdMoved = move(eastBound, EAST_HERD);
        const southHerdMoved = move(southBound, SOUTH_HERD);
        anyOneMoved = eastHerdMoved || southHerdMoved;
        step = step + 1;
    }
    return step;
};

test('25', () => {
    expect(solve('25-test')).toEqual(58);
    expect(solve('25')).toEqual(486);
});
