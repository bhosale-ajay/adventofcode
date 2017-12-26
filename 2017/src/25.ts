import { assert } from "./util";

const findCheckSum = (bluePrint, steps) => {
    const tape = { };
    let cursor = 0;
    let state = "a";
    while (steps--) {
        const cursorKey = "c" + cursor;
        const currentValue = tape[cursorKey] || 0;
        const [value, change, nextState] = bluePrint[state][currentValue];
        tape[cursorKey] = value;
        cursor = cursor + change;
        state = nextState;
    }
    let checksum = 0;
    // tslint:disable-next-line:forin
    for (const t in tape) {
        checksum = checksum + tape[t];
    }
    return checksum;
};

const left = -1;
const right = 1;
const testSteps = 6;
const testBP = {
    a : [ [1, right, "b"], [0, left,  "b" ] ],
    b : [ [1, left,  "a"], [1, right, "a" ] ]
};
const puzzleSteps = 12386363;
const puzzleBP = {
    a : [ [1, right, "b"], [0, left,   "e" ] ],
    b : [ [1, left,  "c"], [0, right,  "a" ] ],
    c : [ [1, left,  "d"], [0, right,  "c" ] ],
    d : [ [1, left,  "e"], [0, left,   "f" ] ],
    e : [ [1, left,  "a"], [1, left,   "c" ] ],
    f : [ [1, left,  "e"], [1, right,  "a" ] ]
};
const a = findCheckSum(testBP, testSteps);
const b = findCheckSum(puzzleBP, puzzleSteps);

assert(a,    3, "25.1, Test 01");
assert(b, 4385, "25.1");
