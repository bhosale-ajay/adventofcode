import { readFileSync } from 'fs';

export function getInput(name: string): string {
    return readFileSync(`../inputs/${name}.txt`, 'utf8').replace(/\r/g, '');
}

export function getLines(name: string, separator = '\n'): string[] {
    return getInput(name).split(separator);
}

export function mapLine<T>(
    name: string,
    selector: (l: string) => T,
    separator = '\n'
): T[] {
    return getInput(name).split(separator).map(selector);
}

export function mapLineToNumber(name: string): number[] {
    return getInput(name)
        .split('\n')
        .map(n => +n);
}

export const assertNotNull = <T>(n: T | null): T => {
    if (n === null) {
        throw 'Item is null';
    }
    return n;
};

export type Grid<T> = T[][];
export type GridLocation = [r: number, c: number];
export const getGrid = <T extends string>(ip: string): Grid<T> => {
    return (getLines(ip).map(l => l.split('') as T[]) as any) as Grid<T>;
};
export const neighborsDelta = (): [number, number][] =>
    [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ] as [number, number][];

export const gridBoundChecker = <T>(
    grid: Grid<T>
): ((l: GridLocation) => boolean) => {
    const rc = grid.length;
    const cc = rc > 0 ? grid[0].length : 0;
    return ([ar, ac]: GridLocation) =>
        0 <= ar && ar < rc && 0 <= ac && ac <= cc;
};

export const cellNeighbors = <T>(
    grid: Grid<T>
): ((l: GridLocation) => GridLocation[]) => {
    const withInBound = gridBoundChecker(grid);
    return ([r, c]: GridLocation) => {
        const result = [];
        for (const [dr, dc] of neighborsDelta()) {
            const [nr, nc] = [r + dr, c + dc];
            if (withInBound([nr, nc])) {
                result.push([nr, nc] as GridLocation);
            }
        }
        return result;
    };
};

export const buildGrid = <T>(
    rc: number,
    cc: number,
    mapper: (l: GridLocation) => T
): Grid<T> => {
    const result: T[][] = [];
    for (let r = 0; r < rc; r++) {
        result.push([]);
        const row = result[r];
        for (let c = 0; c < cc; c++) {
            row.push(mapper([r, c]));
        }
    }
    return result;
};
