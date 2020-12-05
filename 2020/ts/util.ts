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
