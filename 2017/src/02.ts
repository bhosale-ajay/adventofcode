import * as inputSets from "./02-input";
import { findPairs, first, map, query, where } from "./linq";
import { assert } from "./util";

const parseInput = input => input.split("\n").map(line => line.split(/\s/g).map(n => +n));
const diffOfMaxAndMin = line => Math.max(...line) - Math.min(...line);
const sum = (acc = 0, lc) => acc + lc;
const aCanDivideB = (a, b) => b > a && a !== 0 && b % a === 0;
const divide = ([a, b]) => b / a;
const rowChecksum = line => query([line, findPairs(aCanDivideB), map(divide), first]);
const calculateChecksum = (input, mapper) => parseInput(input).map(mapper).reduce(sum);

assert(calculateChecksum(inputSets.ip0201, diffOfMaxAndMin),    18, "02.1, Test 01");
assert(calculateChecksum(inputSets.ip0202, diffOfMaxAndMin), 53460, "02.1");
assert(calculateChecksum(inputSets.ip0203, rowChecksum),         9, "02.2, Test 01");
assert(calculateChecksum(inputSets.ip0202, rowChecksum),       282, "02.2");
