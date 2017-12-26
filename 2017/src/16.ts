import * as inputSets from "./16-input";
import { assert } from "./util";

const parseMoves = i => i.split(",").map(m => moveTypes[m[0]](m.substr(1).split("/")));
const spin = ([i]) => ps => [...ps.slice(ps.length - i), ...ps.slice(0, ps.length - i)];
const findIndex = (ps, p) => ps.findIndex(x => x === p);
const exchange = ([a, b]) => ps => {
    const t = ps[a];
    ps[a] = ps[b];
    ps[b] = t;
    return ps;
};
const partner = ([a, b]) => ps => exchange([findIndex(ps, a), findIndex(ps, b)])(ps);
const moveTypes = { s : spin, x : exchange, p : partner };
const dance = (seed, moves) => moves.reduce((acc, m) => m(acc), seed);
const danceBillionTimes = (seed, moves) => {
    const cycle = [];
    const times = 1000000000;
    for (let i = 0; i < times; i++) {
        const position = seed.join("");
        if (cycle.indexOf(position) >= 0) {
            return cycle[times % i];
        }
        cycle.push(position);
        seed = dance(seed, moves);
    }
    return seed.join("");
};
const testMoves = parseMoves(inputSets.ip1601);
const puzzleMoves = parseMoves(inputSets.ip1602);
const testPositions = "abcde";
const puzzlePositions = "abcdefghijklmnop";
const testPosition = dance(testPositions.split(""), testMoves).join("");
const afterOneRound = dance(puzzlePositions.split(""), puzzleMoves).join("");
const billionthPosition = danceBillionTimes(puzzlePositions.split(""), puzzleMoves);

assert(testPosition,      "baedc",            "16.1, Test 01");
assert(afterOneRound,     "padheomkgjfnblic", "16.1");
assert(billionthPosition, "bfcdeakhijmlgopn", "16.2");
