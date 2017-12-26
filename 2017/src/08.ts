import * as inputSets from "./08-input";
import { forEach, map, query, reduce, where } from "./linq";
import { assert } from "./util";

const inc = (a, b) => (a || 0) + b;
const dec = (a, b) => (a || 0) - b;
const ops = { inc, dec };
const lessThan = (a, b) => (a || 0) < b;
const greaterThan = (a, b) => (a || 0) > b;
const equal = (a, b) => (a || 0) === b;
const lessThanOrEqualTo = (a, b) => (a || 0) <= b;
const greaterThanOrEqualTo = (a, b) => (a || 0) >= b;
const notEuqalTo = (a, b) => (a || 0) !== b;
const cons = { "<"  : lessThan,          ">"  : greaterThan,          "==" : equal,
               "<=" : lessThanOrEqualTo, ">=" : greaterThanOrEqualTo, "!=" : notEuqalTo};

const execute = input => {
    const reg = {};
    const highValue = query([
                            input.split("\n"),
                            map(l => l.split(" ")),
                            map(([or, o, oa, i, cr, c, ca]) => [[or, ops[o], +oa], [cr, cons[c], +ca]]),
                            where(([_, [cr, con, ca]]) => con(reg[cr], ca)),
                            map(([[or, op, oa]]) => reg[or] = op(reg[or], oa)),
                            reduce((acc, rv) => Math.max(acc, rv), Number.MIN_SAFE_INTEGER)]);
    const largestValue = Object.keys(reg).reduce((max, r) => Math.max(reg[r], max),  Number.MIN_SAFE_INTEGER);
    return [largestValue, highValue];
};

const [testLV, testHV] = execute(inputSets.ip0801);
const [puzzleLV, puzzleHV] = execute(inputSets.ip0802);

assert(testLV,      1, "08.1, Test 01");
assert(puzzleLV, 5102, "08.1");
assert(testHV,     10, "08.2, Test 01");
assert(puzzleHV, 6056, "08.2");
