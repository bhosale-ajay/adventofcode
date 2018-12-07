import { readFileSync } from "fs";

export interface Dictionary<T> {
    [key: string]: T;
}

export function* cycle<T>(input: Iterable<T>) {
    while (true) {
        yield* input;
    }
}

export function getInput(day: string) {
    return readFileSync(`../inputs/${day}.txt`, "utf8").replace(/\r/g, "");
}

export function seenBefore<T, TKey = T>(seed: TKey[], keyMaker: (i: T) => TKey = _ => _ as unknown as TKey) {
    const seen = new Set<TKey>(seed);
    return (n: T) => {
        const key = keyMaker(n);
        if (seen.has(key)) {
            return true;
        } else {
            seen.add(key);
            return false;
        }
    };
}

export function getValue<T>(dictionary: Dictionary<T>, key: string, defaultValue: T): T {
    if (dictionary[key] === undefined) {
        dictionary[key] = defaultValue;
    }
    return dictionary[key];
}

export function generate<T>(fromX: number, toX: number, fromY: number, toY: number, action: (x: number, y: number) => T) {
    const result: T[] = [];
    for (let x = fromX; x <= toX; x++) {
        for (let y = fromY; y <= toY; y++) {
            result.push(action(x, y));
        }
    }
    return result;
}

export function each<T1>(outer: T1[], action: (x: T1) => void) {
    const outerLength = outer.length;
    for (let outerIndex = 0; outerIndex < outerLength; outerIndex++) {
        action(outer[outerIndex]);
    }
}

export function nestedEach<T1, T2>(outer: T1[], inner: T2[], action: (x: T1, y: T2) => void) {
    const outerLength = outer.length;
    const innerLength = inner.length;
    for (let outerIndex = 0; outerIndex < outerLength; outerIndex++) {
        for (let innerIndex = 0; innerIndex < innerLength; innerIndex++) {
            action(outer[outerIndex], inner[innerIndex]);
        }
    }
}
