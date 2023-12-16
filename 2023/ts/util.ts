import { readFileSync } from 'fs';

export function getInput(fileName: string): string {
    return readFileSync(`../inputs/${fileName}.txt`, 'utf8').replace(/\r/g, '');
}

export function getLines(fileName: string, separator = '\n'): string[] {
    return getInput(fileName).split(separator);
}

export function mapLine<T>(
    fileName: string,
    selector: (l: string, index: number) => T,
    separator = '\n',
): T[] {
    return getInput(fileName).split(separator).map(selector);
}

export function mapLineToNumber(fileName: string, separator = '\n'): number[] {
    return getInput(fileName)
        .split(separator)
        .map(n => +n);
}

export interface Map<T> {
    [details: string]: T;
}

export const toNumber = (n: string) => +n;

export type Grid<T> = T[][];
export type GridLocation = [row: number, column: number];
export const neighborAddressesST = (r: number, c: number): GridLocation[] => [
    [r - 1, c], // Top
    [r, c - 1], // Left
    [r, c + 1], // Right
    [r + 1, c], // Bottom
];
export const gridBoundChecker = <T>(
    grid: Grid<T>,
): ((l: GridLocation) => boolean) => {
    const rc = grid.length;
    const cc = rc > 0 ? grid[0].length : 0;
    return ([ar, ac]: GridLocation) => 0 <= ar && ar < rc && 0 <= ac && ac < cc;
};
export type BoundChecker = ReturnType<typeof gridBoundChecker>;
