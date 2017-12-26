import * as inputSets from "./23-input";
import { assert } from "./util";

const parse = i => i.split("\n").map(l => l.split(" ")).map(([ins, p1, p2]) => [map[ins], [p1, p2], ins]);
const set = ([setR, getR], [x, y]) => setR(x, getR(y));
const add = ([setR, getR], [x, y]) => setR(x, getR(x) + getR(y));
const mul = ([setR, getR], [x, y]) => setR(x, getR(x) * getR(y));
const sub = ([setR, getR], [x, y]) => setR(x, getR(x) - getR(y));
const jnz = ([setR, getR], [x, y]) => getR(x) !== 0 ? (getR(y) - 1) : 0;
const map = { set, add, mul, sub, jnz };
const execute = instructions => {
    const reg = {};
    const setR = (x, y) => { reg[x] = y; return 0; };
    const getR = (x) => isNaN(x) ? (reg[x] || 0) : +x;
    const ops = [setR, getR];
    let pointer = 0;
    let count = 0;
    while (0 <= pointer && pointer < instructions.length) {
        const [ins, args, name] = instructions[pointer];
        count = count + (name === "mul" ? 1 : 0);
        pointer = pointer + ins(ops, args) + 1;
    }
    return count;
};
const countComposites = b => {
    let count = 0;
    const from = (b * 100) + 100000;
    const to = from + 17000;
    for (let n = from; n <= to; n += 17) {
        for (let d = 2; d * d < n; d++) {
            if (n % d === 0) {
                count = count + 1;
                break;
            }
        }
    }
    return count;
};

assert(execute(parse(inputSets.ip2301)), 6241, "23.1");
assert(countComposites(81), 909, "23.2");
