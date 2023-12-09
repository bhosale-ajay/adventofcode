import { getInput, Map } from './util';
import { matchesToArray } from 'dotless';

const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const parse = (fn: string): [string, Map<[string, string]>] => {
    const [instructions, ...mapData] = matchesToArray(
        getInput(fn),
        /\w+/g,
        m => m[0],
    );
    const map: Map<[string, string]> = {};
    for (let i = 0; i < mapData.length; i = i + 3) {
        map[mapData[i]] = [mapData[i + 1], mapData[i + 2]];
    }
    return [instructions, map];
};

const solveP1 = (fn: string): number => {
    const [instructions, map] = parse(fn);
    const ic = instructions.length;
    let current = 'AAA';
    let steps = 0;
    while (current != 'ZZZ') {
        const instruction = instructions[steps % ic] === 'L' ? 0 : 1;
        current = map[current][instruction];
        steps = steps + 1;
    }
    return steps;
};

const solveP2 = (fn: string): number => {
    const [instructions, map] = parse(fn);
    const ic = instructions.length;
    const ghostSteps = [];
    let currentNodes = Object.keys(map).filter(n => n.endsWith('A'));
    let steps = 0;
    while (currentNodes.length > 0) {
        const instruction = instructions[steps % ic] === 'L' ? 0 : 1;
        const proposed = currentNodes
            .map(n => map[n][instruction])
            .filter(n => !n.endsWith('Z'));
        steps = steps + 1;
        if (currentNodes.length != proposed.length) {
            // Steps at one or more Z found
            ghostSteps.push(steps);
        }
        currentNodes = proposed;
    }
    return ghostSteps.reduce(lcm, 1);
};

test('08', () => {
    expect(solveP1('08-t1')).toEqual(2);
    expect(solveP1('08-t2')).toEqual(6);
    expect(solveP1('08')).toEqual(18113);
    expect(solveP2('08-t3')).toEqual(6);
    expect(solveP2('08')).toEqual(12315788159977);
});
