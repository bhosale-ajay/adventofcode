import * as inputSets from "./12-input";
import { assert } from "./util";

const validRegisters = ["a", "b", "c", "d"];
const isRegister = (r) => validRegisters.indexOf(r) > -1;
const fetchValue = (registers, parameter) => {
    return isRegister(parameter) ? +registers[parameter] : +parameter;
};
const cpy = (registers, [toCopy, register]) => {
    if (!isRegister(register)) {
        return 1;
    }
    registers[register] = fetchValue(registers, toCopy);
    return 1;
};
const inc = (registers, [register]) => {
    registers[register] = registers[register] + 1;
    return 1;
};
const dec = (registers, [register]) => {
    registers[register] = registers[register] - 1;
    return 1;
};
const jnz = (registers, [toCompare, jumpBy]) => {
    const parameterValue = fetchValue(registers, toCompare);
    const jumpByValue = fetchValue(registers, jumpBy);
    return parameterValue !== 0 ? jumpByValue : 1;
};
const computeA = (input, c = 0) => {
    const executors = { cpy, inc, dec, jnz };
    const registers = { a : 0, b : 0, c, d : 0 };
    const instructions = input.split("\n").map(l => l.split(" "))
                            .map(([instruction, ...parameters]) => [instruction, parameters]);
    let instructionPointer = 0;
    while (instructionPointer < instructions.length) {
        const [instruction, parameters] = instructions[instructionPointer];
        instructionPointer += executors[instruction](registers, parameters, instructionPointer, instructions);
    }
    return registers.a;
};
assert(computeA(inputSets.ip1201), 42, "Day 12 - Set 1, Sample Input");
assert(computeA(inputSets.ip1202), 318009, "Day 12 - Set 1");
assert(computeA(inputSets.ip1202, 1), 9227663, "Day 12 - Set 2");
