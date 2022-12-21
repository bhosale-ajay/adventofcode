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

export const neighborAddressesALL = (r: number, c: number): GridLocation[] => [
    [r - 1, c - 1], // Top Left
    [r - 1, c + 0], // Top
    [r - 1, c + 1], // Top Right

    [r + 0, c - 1], // Left
    [r + 0, c + 1], // Right

    [r + 1, c - 1], // Bottom Left
    [r + 1, c + 0], // Bottom
    [r + 1, c + 1], // Bottom Right
];

export interface Node<T> {
    value: T;
    prev: Node<T>;
    next: Node<T>;
}

export class LinkedList<T> {
    private length = 0;

    public get count() {
        return this.length;
    }

    public init(value: T): Node<T> {
        const node: any = {
            value,
        };
        node.prev = node;
        node.next = node;
        this.length = 1;
        return node as Node<T>;
    }

    public remove(node: Node<T>) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        (node as any).prev = null;
        (node as any).next = null;
        this.length--;
    }

    public insertAfter(node: any, value: T) {
        const currentNext = node.next;
        const newNode = {
            value,
            prev: node,
            next: currentNext,
        };
        node.next = newNode;
        currentNext.prev = newNode;
        this.length++;
        return newNode;
    }

    public insertNodeAfter(node: any, newNode: Node<T>) {
        const currentNext = node.next;
        newNode.prev = node;
        newNode.next = currentNext;
        node.next = newNode;
        currentNext.prev = newNode;
        this.length++;
        // console.log(`${newNode.value} moves between ${node.value} and ${currentNext.value}`)
    }

    public insertNodeBefore(node: any, newNode: Node<T>) {
        const currentPrev = node.prev;
        newNode.prev = currentPrev;
        newNode.next = node;
        node.prev = newNode;
        currentPrev.next = newNode;
        this.length++;
        // console.log(`${newNode.value} moves between ${currentPrev.value} and ${node.value}`)
    }
}
