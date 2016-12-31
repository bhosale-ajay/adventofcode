import * as inputSets from "./23-input";
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
const tgl = (registers, [register], currentInstructionPointer, instructions) => {
    const index = currentInstructionPointer + fetchValue(registers, register);
    if (index < 0 || index >= instructions.length) {
        return 1;
    }
    const [instruction] = instructions[index];
    switch (instruction) {
        case "inc" :
        case "dec" :
        case "tgl" :
            instructions[index][0] = instruction === "inc" ? "dec" : "inc";
            break;
        case "jnz" :
        case "cpy" :
            instructions[index][0] = instruction === "jnz" ? "cpy" : "jnz";
            break;
        default :
            break;
    }
    return 1;
};
const computeA = (input, a = 0) => {
    const executors = { cpy, inc, dec, jnz, tgl };
    const registers = { a, b : 0, c : 0, d : 0 };
    const instructions = input.split("\n").map(l => l.split(" "))
                            .map(([instruction, ...parameters]) => [instruction, parameters]);
    let instructionPointer = 0;
    while (instructionPointer < instructions.length) {
        const [instruction, parameters] = instructions[instructionPointer];
        instructionPointer += executors[instruction](registers, parameters, instructionPointer, instructions);
    }
    return registers.a;
};
assert(computeA(inputSets.ip2301), 3, "Day 23 - Set 1, Sample Input");
assert(computeA(inputSets.ip2302, 7), (89 * 84) + (7 * 6 * 5 * 4 * 3 * 2), "Day 23 - Set 1, Actual Input");
// Part 2 is 89 * 84 * 12!
