import * as inputSets from "./05-input";
import { assert } from "./util";

const parseInput = input => input.split("\n").map(n => +n);
const findStepsToExit = (input, incrementor = _ => 1) => {
    let steps = 0;
    let index = 0;
    while (0 <= index && index < input.length) {
        const nextIndex = index + input[index];
        input[index] = input[index] + incrementor(input[index]);
        index = nextIndex;
        steps = steps + 1;
    }
    return steps;
};
const strangeIncrementor = offset => offset >= 3 ? -1 : 1;
assert(findStepsToExit(parseInput(inputSets.ip0501)), 5, "05.1, Test 01");
assert(findStepsToExit(parseInput(inputSets.ip0502)), 394829, "05.1");
assert(findStepsToExit(parseInput(inputSets.ip0501), strangeIncrementor), 10, "05.2, Test 01");
assert(findStepsToExit(parseInput(inputSets.ip0502), strangeIncrementor), 31150702, "05.2");
