import { mapLine } from './util';

type Direction = 'U' | 'D' | 'L' | 'R';
type Instruction = [Direction, number];

const numberToDir: Direction[] = ['R', 'D', 'L', 'U'];

const lineToInstructions = (l: string): [Instruction, Instruction] => {
    const parts = l.split(' ');
    const p1 = [parts[0] as Direction, +parts[1]] as Instruction;
    const steps = parseInt(parts[2].substring(2, 7), 16);
    const dir = numberToDir[+parts[2][7]];
    return [p1, [dir, steps]];
};

const calculateLagoonArea = (
    instructions: [Instruction, Instruction][],
    part: number,
) => {
    let [sum, length, y] = [0, 0, 0];
    for (const set of instructions) {
        const [dir, steps] = set[part];
        length = length + steps;
        if (dir === 'U') {
            y = y - steps;
        } else if (dir === 'D') {
            y = y + steps;
        } else if (dir === 'L') {
            sum = sum + y * steps;
        } else if (dir === 'R') {
            sum = sum - y * steps;
        }
    }
    return Math.abs(sum) + length / 2 + 1;
};

const solve = (fn: string) => {
    const instructions = mapLine(fn, lineToInstructions);
    const p1 = calculateLagoonArea(instructions, 0);
    const p2 = calculateLagoonArea(instructions, 1);
    return [p1, p2];
};

test('18', () => {
    expect(solve('18-t1')).toEqual([62, 952408144115]);
    expect(solve('18')).toEqual([38188, 93325849869340]);
});
