import * as inputSets from "./25-input";
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
const out = (registers, [register], output) => {
    const parameterValue = fetchValue(registers, register);
    if (!(parameterValue === 0 || parameterValue === 1)) {
        return Number.MAX_SAFE_INTEGER;
    }
    if (output.length > 0) {
        if (output[output.length - 1] === parameterValue) {
            return Number.MAX_SAFE_INTEGER;
        }
    }
    output.push(parameterValue);
    return 1;
};
const generateSignal = (input, a = 0, lenToCheck) => {
    const executors = { cpy, inc, dec, jnz, out };
    const registers = { a, b : 0, c : 0, d : 0 };
    const instructions = input.split("\n").map(l => l.split(" "))
                            .map(([instruction, ...parameters]) => [instruction, parameters]);
    let instructionPointer = 0;
    let output = [];
    while (instructionPointer < instructions.length && output.length < lenToCheck) {
        const [instruction, parameters] = instructions[instructionPointer];
        instructionPointer += executors[instruction](registers, parameters, output);
    }
    return output.length;
};
const findLowestSeed = (input) => {
    const lenToCheck = 14;
    for (let i = 0; i < 200; i++) {
        const streamLength = generateSignal(input, i, lenToCheck);
        if (streamLength === lenToCheck) {
            return i;
        }
    }
};
assert(findLowestSeed(inputSets.ip2501), 196, "Day 25");
