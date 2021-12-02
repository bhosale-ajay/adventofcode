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

export function mapLineToNumber(fileName: string): number[] {
    return getInput(fileName)
        .split('\n')
        .map(n => +n);
}
