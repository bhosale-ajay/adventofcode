import { getLines } from './util';
import { matchesToArray } from 'dotless';

const exp = /\d+/g;
type Stack = string[];
type Stacks = Stack[];
type Instruction = [number, number, number];

const parseStackLines = (stacks: Stacks, cl: string) => {
    if (cl.startsWith(' 1')) {
        return stacks;
    }
    const length = cl.length;
    for (let ci = 1; ci < length; ci = ci + 4) {
        if (cl[ci] !== ' ') {
            const stackIndex = Math.floor(ci / 4);
            if (!stacks[stackIndex]) {
                stacks[stackIndex] = [];
            }
            stacks[stackIndex].push(cl[ci]);
        }
    }
    return stacks;
};
const parseInstruction = (l: string) =>
    matchesToArray(l, exp, m => +m[0]) as Instruction;

const removeCreates = (stack: Stack, quantity: number) =>
    stack.splice(stack.length - quantity);

const getTop = (stacks: Stacks) =>
    stacks.reduce((acc, s) => acc + s[s.length - 1], '');

const solve = (fn: string) => {
    const [stackLines, insLines] = getLines(fn, '\n\n');
    const stackP1 = stackLines
        .split('\n')
        .reduceRight(parseStackLines, [] as Stacks);
    const stackP2 = stackP1.map(s => [...s]); // create a new copy
    const instructions = insLines.split('\n').map(parseInstruction);
    for (const [quantity, fromCI, toCI] of instructions) {
        const removedP1 = removeCreates(stackP1[fromCI - 1], quantity);
        const removedP2 = removeCreates(stackP2[fromCI - 1], quantity);
        stackP1[toCI - 1].push(...removedP1.reverse());
        stackP2[toCI - 1].push(...removedP2);
    }
    return [getTop(stackP1), getTop(stackP2)];
};

test('05', () => {
    const t = solve('05-test');
    const a = solve('05');
    expect(t).toEqual(['CMZ', 'MCD']);
    expect(a).toEqual(['MQTPGLLDN', 'LVZPSTTCZ']);
});
