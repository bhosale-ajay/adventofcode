import { readFileSync } from 'fs';

export function getInput(fileName: string): string {
    return readFileSync(`../inputs/${fileName}.txt`, 'utf8').replace(/\r/g, '');
}

export function getLines(fileName: string, separator = '\n'): string[] {
    return getInput(fileName).split(separator);
}

export function mapLine<T>(
    fileName: string,
    selector: (l: string) => T,
    separator = '\n'
): T[] {
    return getInput(fileName).split(separator).map(selector);
}

export function mapLineToNumber(fileName: string, separator = '\n'): number[] {
    return getInput(fileName)
        .split(separator)
        .map(n => +n);
}

export type Grid<T> = T[][];
export type GridLocation = [row: number, column: number];
export const neighborAddressesST = (r: number, c: number): GridLocation[] => [
    [r - 1, c], // Top
    [r, c - 1], // Left
    [r, c + 1], // Right
    [r + 1, c], // Bottom
];

export function mapGrid<T, U>(
    grid: Grid<T>,
    neighborFinder: (r: number, c: number) => GridLocation[],
    mapper: (item: T, itemLocation: GridLocation, neighbors: T[]) => U
): U[] {
    const rowCount = grid.length;
    const columnCount = grid[0].length;
    const result: U[] = [];
    const withInBound = ([nr, nc]: GridLocation) =>
        0 <= nr && nr < rowCount && 0 <= nc && nc < columnCount;
    for (let ri = 0; ri < rowCount; ri++) {
        for (let ci = 0; ci < columnCount; ci++) {
            result.push(
                mapper(
                    grid[ri][ci],
                    [ri, ci],
                    neighborFinder(ri, ci)
                        .filter(withInBound)
                        .map(([nr, nc]) => grid[nr][nc])
                )
            );
        }
    }
    return result;
}

export const gridBoundChecker = <T>(
    grid: Grid<T>
): ((l: GridLocation) => boolean) => {
    const rc = grid.length;
    const cc = rc > 0 ? grid[0].length : 0;
    return ([ar, ac]: GridLocation) =>
        0 <= ar && ar < rc && 0 <= ac && ac <= cc;
};
export type BoundChecker = ReturnType<typeof gridBoundChecker>;
