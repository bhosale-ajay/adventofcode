import * as inputSets from "./07-input";
import { assert } from "./util";

const parseInput = i => i.replace(/ /g, "").split("\n");
const build = (programs, l) => {
    const getProgram = n => programs[n] || (programs[n] = { bottom : true });
    const parts = l.split(")");
    const [name, weight] = parts[0].split("(");
    const tower = parts[1].length > 0 ? parts[1].replace("->", "").split(",") : [];
    const program = getProgram(name);
    program.diskWeight = +weight;
    program.tower = tower.map(p => getProgram(p));
    program.tower.forEach(p => p.bottom = false);
    return programs;
};

const reachConsensus = ([x, y, z]) => (x === y && x === z) ? -1 :
                                      (x !== y && y === z) ?  0 :
                                      (x !== y && z === z) ?  1 : 2;

const verify = (tower) => {
    const diskWeights = [];
    const programWeights = [];
    let towerWeight = 0;
    let consensusWeight = 0;
    for (const program of tower) {
        const weight = program.diskWeight + verify(program.tower);
        diskWeights.push(program.diskWeight);
        programWeights.push(weight);
        if (consensusWeight > 0 && consensusWeight !== weight) {
            throw program.diskWeight - weight + consensusWeight;
        } else if (programWeights.length === 3) {
            const unbalancedIndex = reachConsensus(programWeights as any);
            if (unbalancedIndex !== -1) {
                const balancedIndex = unbalancedIndex === 0 ? 1 : 0;
                throw diskWeights[unbalancedIndex] - programWeights[unbalancedIndex] + programWeights[balancedIndex];
            }
            consensusWeight = weight;
        }
        towerWeight = towerWeight + weight;
    }
    return towerWeight;
};

const findRootAndVerify = (i) => {
    const programs = parseInput(i).reduce(build, {});
    const bottomProgram = Object.keys(programs).find(p => programs[p].bottom);
    let balanceMismatch = 0;
    try {
        verify(programs[bottomProgram].tower);
    } catch (e) {
        balanceMismatch = e;
    }
    return [bottomProgram, balanceMismatch];
};

const [testBottom, testCorrectWeight] = findRootAndVerify(inputSets.ip0701);
const [puzzleBottom, puzzleCorrectWeight] = findRootAndVerify(inputSets.ip0702);
const [b01, c01] = findRootAndVerify(inputSets.ip0703);
const [b02, c02] = findRootAndVerify(inputSets.ip0704);
const [b03, c03] = findRootAndVerify(inputSets.ip0705);
const [b04, c04] = findRootAndVerify(inputSets.ip0706);
assert(testBottom,       "tknk", "07.1, Test 01");
assert(puzzleBottom,    "vtzay", "07.1");
assert(testCorrectWeight,    60, "07.2, Test 01");
assert(puzzleCorrectWeight, 910, "07.2");
assert(c01, 40, "07.2, 4th node underweight");
assert(c02, 10, "07.2, 5th node overweight");
assert(c03, 15, "07.2, 2nd node underweight");
assert(c04, 50, "07.2, 3rd node overweight");
