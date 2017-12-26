import { assert, LinkedList } from "./util";

const nextPosition = (p, s, i) => ((p + s) % i) + 1;
const findShortCircuitValue = steps => {
    const spinlock = [0];
    let position = 0;
    for (let i = 0; i <= 2017; i++) {
        const item = i + 1;
        position = nextPosition(position, steps, item);
        spinlock.splice(position, 0, item);
    }
    return spinlock[spinlock.indexOf(2017) + 1];
};
const findValueAfterZero = steps => {
    let nextToZero = 0;
    let position = 0;
    for (let i = 0; i <= 50000000; i++) {
        const item = i + 1;
        position = nextPosition(position, steps, item);
        if ((position - 1) === 0) {
            nextToZero = item;
        }
    }
    return nextToZero;
};

const testSteps = 3;
const puzzleSteps = 356;
const a = findShortCircuitValue(testSteps);
const b = findShortCircuitValue(puzzleSteps);
const c = findValueAfterZero(puzzleSteps);

assert(a,      638, "17.1, Test 01");
assert(b,      808, "17.1");
assert(c, 47465686, "17.2");
