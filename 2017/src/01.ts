import * as inputSets from "./01-input";
import { assert } from "./util";

const parseInput = input => input.split("").map(n => +n);
const getNextDigit = (i, arr) => arr[i === arr.length - 1 ? 0 : i + 1];
const getHalfwayAroundDigit = (i, arr) => arr[(i + (arr.length / 2)) % arr.length];
const solveCaptcha = (seq, next) => seq.reduce((acc, d, i, arr) => acc + (d === next(i, arr) ? d : 0), 0);

assert(solveCaptcha(parseInput(inputSets.ip0101), getNextDigit),    3, "01.1, Test 01");
assert(solveCaptcha(parseInput(inputSets.ip0102), getNextDigit),    4, "01.1, Test 02");
assert(solveCaptcha(parseInput(inputSets.ip0103), getNextDigit),    0, "01.1, Test 03");
assert(solveCaptcha(parseInput(inputSets.ip0104), getNextDigit),    9, "01.1, Test 04");
assert(solveCaptcha(parseInput(inputSets.ip0105), getNextDigit), 1177, "01.1");
assert(solveCaptcha(parseInput(inputSets.ip0106), getHalfwayAroundDigit),    6, "01.2, Test 01");
assert(solveCaptcha(parseInput(inputSets.ip0107), getHalfwayAroundDigit),    0, "01.2, Test 02");
assert(solveCaptcha(parseInput(inputSets.ip0108), getHalfwayAroundDigit),    4, "01.2, Test 03");
assert(solveCaptcha(parseInput(inputSets.ip0109), getHalfwayAroundDigit),   12, "01.2, Test 04");
assert(solveCaptcha(parseInput(inputSets.ip0110), getHalfwayAroundDigit),    4, "01.2, Test 05");
assert(solveCaptcha(parseInput(inputSets.ip0105), getHalfwayAroundDigit), 1060, "01.2");
