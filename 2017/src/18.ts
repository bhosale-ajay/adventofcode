import * as inputSets from "./18-input";
import { assert } from "./util";

const parse = i => i.split("\n").map(l => l.split(" ")).map(([ins, p1, p2]) => [map[ins], [p1, p2]]);
const snd = ([setR, getR, send], [x])               => send(getR(x));
const set = ([setR, getR], [x, y])                  => setR(x, getR(y));
const add = ([setR, getR], [x, y])                  => setR(x, getR(x) + getR(y));
const mul = ([setR, getR], [x, y])                  => setR(x, getR(x) * getR(y));
const mod = ([setR, getR], [x, y])                  => setR(x, getR(x) % getR(y));
const rcv = ([setR, getR, _, rec, duetMode], [x])   => getR(x) !== 0 || duetMode ? rec(x) : 0;
const jgz = ([setR, getR], [x, y])                  => getR(x) > 0 ? (getR(y) - 1) : 0;
const map = { snd, set, add, mul, mod, rcv, jgz };
const execute = instructions => {
    let sound = 0;
    const reg = { };
    const setR = (x, y) => { reg[x] = y; return 0; };
    const getR = (x) => isNaN(x) ? (reg[x] || 0) : +x;
    const send = s => { sound = s; return 0; };
    const receive = _ => Number.MAX_SAFE_INTEGER;
    const ops = [setR, getR, send, receive, false];
    let pointer = 0;
    while (0 <= pointer && pointer < instructions.length) {
        const [ins, args] = instructions[pointer];
        pointer = pointer + ins(ops, args) + 1;
    }
    return sound;
};
const program = id => ({ reg : { p : id }, write : [], read: [], pointer : 0, lastPointer : -1, count : 0 });
const duet = instructions => {
    const [p0, p1] = [program(0), program(1)];
    p0.read = p1.write;
    p1.read = p0.write;

    let current = p0;
    const setR = (x, y) => { current.reg[x] = y; return 0; };
    const getR = (x) => isNaN(x) ? (current.reg[x] || 0) : +x;
    const send = m => {
        current.write.push(m);
        current.count++;
        return 0;
    };
    const receive = (x) => {
        if (current.read.length > 0) {
            const v = current.read.shift();
            return setR(x, v);
        }
        return -1;
    };
    const ops = [setR, getR, send, receive, true];
    const sing = () => {
        const [ins, args] = instructions[current.pointer];
        current.pointer = current.pointer + ins(ops, args) + 1;
    };
    while ((p0.lastPointer !== p0.pointer) || (p1.lastPointer !== p1.pointer)) {
        p0.lastPointer = p0.pointer;
        p1.lastPointer = p1.pointer;
        current = p0;
        sing();
        current = p1;
        sing();
    }
    return p1.count;
};

const a = execute(parse(inputSets.ip1801));
const b = execute(parse(inputSets.ip1802));
const c = duet(parse(inputSets.ip1803));
const d = duet(parse(inputSets.ip1802));

assert(a,    4, "18.1, Test 01");
assert(b, 1187, "18.1");
assert(c,    3, "18.2, Test 01");
assert(d, 5969, "18.2");
