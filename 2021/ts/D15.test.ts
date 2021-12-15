import { Grid, GridLocation, mapLine, neighborAddressesST } from './util';

const lineToRisks = (l: string) => l.split('').map(n => +n);

type Position = {
    risk: number;
    links: GridLocation[];
    visited: boolean;
    totalRisk: number;
};

const getPositions = (risks: Grid<number>, factor = 1): Grid<Position> => {
    const inputSize = risks.length;
    const result: Grid<Position> = [];
    const rowCount = inputSize * factor;
    const columnCount = inputSize * factor;
    const withInBound = ([nr, nc]: GridLocation) =>
        0 <= nr && nr < rowCount && 0 <= nc && nc < columnCount;
    const getValue = (ri: number, ci: number) =>
        factor === 1
            ? risks[ri][ci]
            : ((risks[ri % inputSize][ci % inputSize] +
                  Math.floor(ci / inputSize) +
                  Math.floor(ri / inputSize) +
                  8) %
                  9) +
              1;
    for (let ri = 0; ri < rowCount; ri++) {
        const riskRow = [];
        for (let ci = 0; ci < columnCount; ci++) {
            riskRow.push({
                risk: getValue(ri, ci),
                links: neighborAddressesST(ri, ci).filter(withInBound),
                visited: false,
                totalRisk: Infinity,
            });
        }
        result.push(riskRow);
    }
    return result;
};

const findPath = (positions: Grid<Position>): number => {
    const size = positions.length;
    const getPosition = ([ri, ci]: GridLocation) => positions[ri][ci];
    const start = getPosition([0, 0]);
    start.totalRisk = 0;
    const locations: GridLocation[] = [[0, 0]];
    while (locations.length > 0) {
        // Processing without priority selection
        // does not work for part 2 of actual input
        // const location = locations.shift() as GridLocation;
        // const current = getPosition(location);

        let minDistance = Infinity;
        let selectedIndex = 0;
        for (let i = 0; i < locations.length; i++) {
            const totalRisk = getPosition(locations[i]).totalRisk;
            if (minDistance > totalRisk) {
                minDistance = totalRisk;
                selectedIndex = i;
            }
        }
        const current = getPosition(locations[selectedIndex]);
        locations.splice(selectedIndex, 1);
 
        current.visited = true;
        for (const linkAddress of current.links) {
            const link = getPosition(linkAddress);
            if (link.visited) {
                continue;
            }
            const totalRiskToLink = current.totalRisk + link.risk;
            if (totalRiskToLink < link.totalRisk) {
                if (link.totalRisk === Infinity) {
                    locations.push(linkAddress);
                }
                link.totalRisk = totalRiskToLink;
            }
        }
    }
    return positions[size - 1][size - 1].totalRisk;
};

const solve = (fn: string) => {
    const risks = mapLine(fn, lineToRisks);
    return [findPath(getPositions(risks)), findPath(getPositions(risks, 5))];
};

test('15', () => {
    expect(solve('15-test')).toEqual([40, 315]);
    expect(solve('15')).toEqual([769, 2963]);
});
