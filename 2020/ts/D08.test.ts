import { mapLine } from './util';

type State = [acc: number, current: number];
type Instruction = (state: State, parameter: number) => State;
type Line = [instruction: Instruction, parameter: number];
type Program = Line[];
const nop = ([a, c]: State, _: number): State => [a, c + 1];
const acc = ([a, c]: State, p: number): State => [a + p, c + 1];
const jmp = ([a, c]: State, p: number): State => [a, c + p];
const ins: any = { nop, acc, jmp };
const parseLine = (l: string) => [ins[l.substr(0, 3)], +l.substr(4)] as Line;
const parse = (ip: string) => mapLine(ip, parseLine);

const execute = (program: Program): [number, boolean] => {
    const seen = new Set<number>();
    let accumulator = 0,
        current = 0;
    while (current < program.length) {
        seen.add(current);
        const [instruction, parameter] = program[current];
        const [updatedAcc, next] = instruction(
            [accumulator, current],
            parameter
        );
        if (seen.has(next)) {
            return [accumulator, false];
        }
        [accumulator, current] = [updatedAcc, next];
    }
    return [accumulator, true];
};

const findAccumulator = (program: Program) => execute(program)[0];

const fixProgram = (program: Program) => {
    let result = -1,
        success = false;
    for (let i = 0; i < program.length && !success; i++) {
        const instruction = program[i][0];
        if (instruction === acc) {
            continue;
        }
        program[i][0] = instruction === jmp ? nop : jmp;
        [result, success] = execute(program);
        program[i][0] = instruction;
    }
    return result;
};

const testInput = parse('08-test');
const input = parse('08');

test('08, Part 1', () => {
    expect(findAccumulator(testInput)).toEqual(5);
    expect(findAccumulator(input)).toEqual(1451);
});

test('08, Part 2', () => {
    expect(fixProgram(testInput)).toEqual(8);
    expect(fixProgram(input)).toEqual(1160);
});
