import {
    BoundChecker,
    Grid,
    GridLocation,
    gridBoundChecker,
    mapLine,
    neighborAddressesALL,
} from './util';

type Octopuses = Grid<number>;

const lineToPoints = (l: string) => l.split('').map(n => +n);

const resetAndIncreaseEnergyLevel = (os: Octopuses) => {
    for (let ri = 0; ri < os.length; ri++) {
        for (let ci = 0; ci < os[0].length; ci++) {
            const el = os[ri][ci];
            os[ri][ci] = (el <= 9 ? el : 0) + 1;
        }
    }
};

const findReadyToFlash = (os: Octopuses): GridLocation[] => {
    const result: GridLocation[] = [];
    for (let ri = 0; ri < os.length; ri++) {
        for (let ci = 0; ci < os[0].length; ci++) {
            const el = os[ri][ci];
            if (el > 9) {
                result.push([ri, ci]);
            }
        }
    }
    return result;
};

function flash(os: Octopuses, b: BoundChecker, l: GridLocation[]) {
    const location = l.pop();
    const impacted: GridLocation[] = [];
    let flashed = 0;
    if (location !== undefined) {
        const [ri, ci] = location;
        for (const [nri, nci] of neighborAddressesALL(ri, ci).filter(b)) {
            const nl = os[nri][nci];
            if (nl <= 9) {
                os[nri][nci] = os[nri][nci] + 1;
                if (os[nri][nci] > 9) {
                    impacted.push([nri, nci]);
                }
            }
        }
        flashed = 1 + flash(os, b, l.concat(impacted));
    }
    return flashed;
}

const solve = (fn: string) => {
    const octopuses = mapLine(fn, lineToPoints) as Octopuses;
    const boundChecker = gridBoundChecker(octopuses);
    let totalFlashed = 0;
    let stepAtAllFlashedFirst = 0;
    for (let si = 1; si < 100 || 0 === stepAtAllFlashedFirst; si++) {
        resetAndIncreaseEnergyLevel(octopuses);
        const readyToFlash = findReadyToFlash(octopuses);
        const flashed = flash(octopuses, boundChecker, readyToFlash);
        if (flashed === 100 && stepAtAllFlashedFirst === 0) {
            stepAtAllFlashedFirst = si;
        }
        if (si <= 100) {
            totalFlashed = totalFlashed + flashed;
        }
    }
    return [totalFlashed, stepAtAllFlashedFirst];
};

test('11', () => {
    expect(solve('11-test')).toEqual([1656, 195]);
    expect(solve('11')).toEqual([1632, 303]);
});
