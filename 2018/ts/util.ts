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
