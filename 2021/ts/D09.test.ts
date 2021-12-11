import { descendingBy } from 'dotless';
import {
    gridBoundChecker,
    mapGrid,
    mapLine,
    neighborAddressesST,
    BoundChecker,
    Grid,
    GridLocation,
} from './util';

type Area = Grid<number>;
const lineToPoints = (l: string) => l.split('').map(n => +n);

const pointCheck = (
    p: number,
    pl: GridLocation,
    ns: number[]
): [number, GridLocation] => {
    const isLow = ns.every(e => e > p);
    return [isLow ? p + 1 : 0, pl];
};

function exploreBasin(
    [ri, ci]: GridLocation,
    isBasin: BoundChecker,
    visited: Set<string>
): number {
    let basinSize = 1;
    for (const np of neighborAddressesST(ri, ci).filter(isBasin)) {
        const locationKey = np.toString();
        if (visited.has(locationKey)) {
            continue;
        }
        visited.add(locationKey);
        basinSize = basinSize + exploreBasin(np, isBasin, visited);
    }
    return basinSize;
}

const basinChecker =
    (area: Area, withInBound: BoundChecker) => (l: GridLocation) =>
        withInBound(l) && area[l[0]][l[1]] < 9;

const solve = (fn: string) => {
    const area = mapLine(fn, lineToPoints) as Area;
    const riskyPoints = mapGrid(area, neighborAddressesST, pointCheck).filter(
        ([r]) => r > 0
    );
    const isBasin = basinChecker(area, gridBoundChecker(area));
    const visited = new Set<string>();
    let sumOfRisks = 0;
    const basinSizes: number[] = [];
    for (const [risk, point] of riskyPoints) {
        sumOfRisks = sumOfRisks + risk;
        visited.add(point.toString());
        basinSizes.push(exploreBasin(point, isBasin, visited));
    }
    basinSizes.sort(descendingBy());
    const productOfBasinSize = basinSizes[0] * basinSizes[1] * basinSizes[2];
    return [sumOfRisks, productOfBasinSize];
};

test('09', () => {
    expect(solve('09-test')).toEqual([15, 1134]);
    expect(solve('09')).toEqual([535, 1122700]);
});
