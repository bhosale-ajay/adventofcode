import { mapLine } from './util';
import { matchesToArray } from 'dotless';

type Galaxy = {
    row: number;
    rowE1: number;
    rowE2: number;
    col: number;
    colE1: number;
    colE2: number;
};

const matchToGalaxy =
    (row: number) =>
    (m: RegExpExecArray): Galaxy => {
        const col = m.index;
        return {
            row,
            rowE1: row,
            rowE2: row,
            col,
            colE1: col,
            colE2: col,
        };
    };

const parseLine = (l: string, li: number): Galaxy[] =>
    matchesToArray(l, /#/g, matchToGalaxy(li));

const solve = (fn: string, expansion: number) => {
    const galaxies = mapLine(fn, parseLine).flat();
    const maxRow = galaxies.reduce((a, g) => Math.max(a, g.row), 0);
    const maxCol = galaxies.reduce((a, g) => Math.max(a, g.col), 0);
    const rowsWithNoGalaxies = [];
    const colsWithNoGalaxies = [];
    for (let i = 0; i < maxRow; i++) {
        if (!galaxies.some(g => g.row === i)) {
            rowsWithNoGalaxies.push(i);
        }
    }
    for (let i = 0; i < maxCol; i++) {
        if (!galaxies.some(g => g.col === i)) {
            colsWithNoGalaxies.push(i);
        }
    }
    for (const galaxy of galaxies) {
        const emptyRows = rowsWithNoGalaxies.filter(
            ri => ri < galaxy.row,
        ).length;
        const emptyCols = colsWithNoGalaxies.filter(
            ci => ci < galaxy.col,
        ).length;
        galaxy.rowE1 = galaxy.rowE1 + emptyRows;
        galaxy.colE1 = galaxy.colE1 + emptyCols;
        galaxy.rowE2 = galaxy.rowE2 + (expansion - 1) * emptyRows;
        galaxy.colE2 = galaxy.colE2 + (expansion - 1) * emptyCols;
    }
    let sumOfLengthsP1 = 0;
    let sumOfLengthsP2 = 0;
    for (let i = 0; i < galaxies.length; i++) {
        const a = galaxies[i];
        for (let j = i + 1; j < galaxies.length; j++) {
            const b = galaxies[j];
            sumOfLengthsP1 =
                sumOfLengthsP1 +
                Math.abs(a.rowE1 - b.rowE1) +
                Math.abs(a.colE1 - b.colE1);
            sumOfLengthsP2 =
                sumOfLengthsP2 +
                Math.abs(a.rowE2 - b.rowE2) +
                Math.abs(a.colE2 - b.colE2);
        }
    }
    return [sumOfLengthsP1, sumOfLengthsP2];
};

test('11', () => {
    expect(solve('11-t1', 10)).toEqual([374, 1030]);
    expect(solve('11', 1000000)).toEqual([10313550, 611998089572]);
});
