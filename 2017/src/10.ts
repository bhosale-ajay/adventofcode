import * as inputSets from "./10-input";
import { assert } from "./util";

const parseLengths = i => i.split(",").map(n => +n);
const generateList = size => {
    const list = [];
    for (let i = 0; i < size; i++) {
        list.push(i);
    }
    return list;
};
const reverse = (list, start, length) => {
    const end = start + length - 1;
    for (let i = 0; i < length / 2; i++) {
        const a = (start + i) % list.length;
        const b = (end - i) % list.length;
        const temp = list[a];
        list[a] = list[b];
        list[b] = temp;
    }
};
const process = (lengths, size = 256, times = 64) => {
    const list = generateList(size);
    let currentPosition = 0;
    let skipSize = 0;
    while (times--) {
        for (const length of lengths) {
            reverse(list, currentPosition, length);
            currentPosition = (currentPosition + length + skipSize) % list.length;
            skipSize = skipSize + 1;
        }
    }
    return list;
};
const productAfterRoundOne = (input, size = 256) => {
    const list = process(parseLengths(input), size, 1);
    return list[0] * list[1];
};
const salt = [17, 31, 73, 47, 23];
const generateLengths = i => i.split("").map(c => c.charCodeAt()).concat(salt);
const combineBlocks = (acc, cV, cI) => {
    const index = Math.floor(cI / 16);
    acc[index] = acc[index] !== undefined ? acc[index] ^ cV : cV;
    return acc;
};
const hex = n => (n.toString(16).length === 1 ? "0" : "") + n.toString("16");
export const hash = (input) => process(generateLengths(input)).reduce(combineBlocks, []);
const computeKnotHash = (input) => {
    return hash(input).map(hex).join("");
};

assert(productAfterRoundOne(inputSets.ip1001,   5),    12, "10.1, Test 01");
assert(productAfterRoundOne(inputSets.ip1002, 256), 23874, "10.1");
assert(computeKnotHash("AoC 2017"),        "33efeb34ea91902bb2f59c9920caa6cd", "10.2, Test 01");
assert(computeKnotHash(inputSets.ip1002),  "e1a65bfb5a5ce396025fab5528c25a87", "10.2");
