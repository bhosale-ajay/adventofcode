import { readFileSync } from 'fs';

export function getInput(name: string): string {
    return readFileSync(`../inputs/${name}.txt`, 'utf8').replace(/\r/g, '');
}

export const assertNotNull = <T>(n: T | null): T => {
    if (n === null) {
        throw 'Item is null';
    }
    return n;
};
