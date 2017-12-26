import { assert } from "./util";

const generator = (seed, factor, multipleOf) => {
    let sequence = seed;
    return () => {
        do {
            sequence = (sequence * factor) % 2147483647;
        } while (sequence & multipleOf);
        return sequence & 0xFFFF;
    };
};

const countMatches = (seedA, seedB, wait = 40000000, mulA = 0, mulB = 0) => {
    const genA = generator(seedA, 16807, mulA);
    const genB = generator(seedB, 48271, mulB);
    let matches = 0;
    for (let i = 0; i < wait; i++) {
        if (genA() === genB()) {
            matches = matches + 1;
        }
    }
    return matches;
};

const count = countMatches(873, 583);
// instead of checking x % 4 or x % 8, x & 3 or x & 7
const countPicky = countMatches(873, 583, 5000000, 3, 7);
assert(count,      631, "15.1");
assert(countPicky, 279, "15.2");
