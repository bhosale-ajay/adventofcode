import { assert } from 'console';
import { getLines } from './util';

const check = new RegExp(/-?\d+/);

type ProgramInput = [string[], number[][]];

const parse = ([ls, ps]: ProgramInput, l: string, i: number) => {
    const parts = l.split(' ');
    if (parts.length == 2) {
        ls.push(`ops.${parts[0]}(${parts[1]})`);
    } else {
        if (check.test(parts[2])) {
            ls.push(`ops.${parts[0]}(${parts[1]}, ${parts[2]})`);
        } else {
            ls.push(`ops.${parts[0]}(${parts[1]}, reg[${parts[2]}])`);
        }
    }
    const im = i % 18;
    if (im === 4 || im === 5 || im === 15) {
        if (im === 4) {
            ps.push([]);
        }
        const last = ps[ps.length - 1];
        last.push(+parts[2]);
    }
    return [ls, ps] as ProgramInput;
};

const executeSlow = (input: number[], program: string[]) => {
    let ic = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [x, y, z, w] = [0, 1, 2, 3];
    const reg = [0, 0, 0, 0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ops = {
        inp: (a: number) => (reg[a] = input[ic++]),
        add: (a: number, b: number) => (reg[a] = reg[a] + b),
        mul: (a: number, b: number) => (reg[a] = reg[a] * b),
        div: (a: number, b: number) => (reg[a] = Math.floor(reg[a] / b)),
        mod: (a: number, b: number) => (reg[a] = reg[a] % b),
        eql: (a: number, b: number) => (reg[a] = reg[a] === b ? 1 : 0),
    };
    for (const line of program) {
        eval(line);
    }
    return reg[z] === 0;
};

const executeFast = (input: number[], parameters: number[][]) => {
    let [ic, x, z, w] = [0, 0, 0, 0, 0];
    const processInput = ([a, b, c]: number[]) => {
        w = input[ic++];
        x = (z % 26) + b;
        z = Math.floor(z / a);
        if (x != w) {
            z = z * 26 + w + c;
        }
    };
    parameters.forEach(processInput);
    return z === 0;
};

// copied and converted from https://github.com/kunalb/AoC2021/blob/main/js/day24.js
const getSmallestAndLargestModelNumber = (
    parameters: number[][]
): [number[], number[]] => {
    const deps = [0];
    const constraints = new Array(15).fill(null);
    for (let i = 1; i <= parameters.length; i++) {
        const p = parameters[i - 1];
        if (p[0] == 1) {
            deps.push(i);
        } else {
            constraints[i] = deps[deps.length - 1];
            deps.pop();
        }
    }

    const maxValues = new Array(15).fill(null);
    const minValues = new Array(15).fill(null);
    for (const [i, constraint] of constraints.entries()) {
        if (constraint === null) continue;
        maxValues[constraint] = Math.min(
            9,
            9 - parameters[constraint - 1][2] - parameters[i - 1][1]
        );
        const sum = parameters[constraint - 1][2] + parameters[i - 1][1];
        minValues[constraint] = Math.max(1 - sum, 1);
    }

    const smallest: number[] = [];
    const largest: number[] = [];
    for (let i = 1; i < maxValues.length; i++) {
        smallest.push(minValues[i]);
        largest.push(maxValues[i]);
    }
    for (const [i, constraint] of constraints.entries()) {
        if (constraint == null) continue;
        smallest[i - 1] =
            smallest[constraint - 1] +
            parameters[constraint - 1][2] +
            parameters[i - 1][1];
        largest[i - 1] =
            largest[constraint - 1] +
            parameters[constraint - 1][2] +
            parameters[i - 1][1];
    }

    return [smallest, largest];
};

const solve = (fn: string) => {
    const [program, parameters] = getLines(fn).reduce(parse, [[], []]);
    const [smallestModelNumber, largestModelNumber] =
        getSmallestAndLargestModelNumber(parameters);
    assert(executeSlow(smallestModelNumber, program));
    assert(executeFast(smallestModelNumber, parameters));
    assert(executeSlow(largestModelNumber, program));
    assert(executeFast(largestModelNumber, parameters));
    return [+smallestModelNumber.join(''), +largestModelNumber.join('')];
};

test('24', () => {
    expect(solve('24')).toEqual([31111121382151, 95299897999897]);
});
