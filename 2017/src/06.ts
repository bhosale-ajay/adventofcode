import { assert } from "./util";

const ip0601 = "0 2 7 0";
const ip0602 = "0	5	10	0	11	14	13	4	11	8	8	7	1	4	12	11";

const parseInput = input => input.split(/\s/g).map(n => +n);
const findContender = banks => banks.reduce((mI, cB, cI) => cB > banks[mI] ? cI : mI, 0);
const signature = banks => banks.join(".");
const redistribute = (banks) => {
    const contenderIndex = findContender(banks);
    const numberOfBanks = banks.length;
    const share = Math.floor(banks[contenderIndex] / numberOfBanks);
    let reminder = banks[contenderIndex] % numberOfBanks;
    banks[contenderIndex] = 0;
    for (let index = contenderIndex + 1, counter = 0; counter < numberOfBanks; counter++, index++) {
        index = index === banks.length ? 0 : index;
        banks[index] = banks[index] + share + (reminder > 0 ? 1 : 0);
        reminder = reminder - 1;
    }
};
const cyclesToReachInfiniteLoop = (banks) => {
    const configurations = {};
    let cycles = 0;
    let configuration = signature(banks);
    while (!(configuration in configurations)) {
        configurations[configuration] = cycles;
        redistribute(banks);
        configuration = signature(banks);
        cycles = cycles + 1;
    }
    return [cycles, cycles - configurations[configuration]];
};

const [testCycles, testSizeOfLoop] = cyclesToReachInfiniteLoop(parseInput(ip0601));
const [puzzleCycles, puzzleSizeOfLoop] = cyclesToReachInfiniteLoop(parseInput(ip0602));

assert(testCycles,          5, "06.1, Test 01");
assert(puzzleCycles,     7864, "06.1");
assert(testSizeOfLoop,      4, "06.2, Test 01");
assert(puzzleSizeOfLoop, 1695, "06.2");
