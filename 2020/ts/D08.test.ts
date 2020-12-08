import { count } from 'dotless';
import { mapLine } from './util';

type State = [acc: number, current: number];
type Executor = (state: State, parameter: number) => State;
type Instruction = [executor: Executor, fix: Executor | undefined];
type Line = [instruction: Instruction, parameter: number];
type Program = Line[];
const nopExecutor = ([a, c]: State, _: number): State => [a, c + 1];
const accExecutor = ([a, c]: State, p: number): State => [a + p, c + 1];
const jmpExecutor = ([a, c]: State, p: number): State => [a, c + p];
const nop = [nopExecutor, jmpExecutor] as Instruction;
const acc = [accExecutor, undefined] as Instruction;
const jmp = [jmpExecutor, nopExecutor] as Instruction;
const ins: any = { nop, acc, jmp };
const parseLine = (l: string) => [ins[l.substr(0, 3)], +l.substr(4)] as Line;
const parse = (ip: string) => mapLine(ip, parseLine);

const execute = (program: Program, tryIndex = -1): [number, boolean] => {
    const seen = new Set<number>();
    let accumulator = 0,
        current = 0,
        previousInstruction = 0,
        fixableInstructionIndex = 0;
    while (current < program.length) {
        seen.add(current);
        const [[executor, fix], parameter] = program[current];
        let selectedExecutor = executor;
        if (fix !== undefined) {
            if (fixableInstructionIndex === tryIndex) {
                selectedExecutor = fix;
            }
            fixableInstructionIndex = fixableInstructionIndex + 1;
        }
        const [updatedAcc, next] = selectedExecutor(
            [accumulator, current],
            parameter
        );
        if (seen.has(next)) {
            return [accumulator, false];
        }
        previousInstruction = current;
        [accumulator, current] = [updatedAcc, next];
    }
    const lastInstructionExecuted = program.length - previousInstruction === 1;
    return [accumulator, lastInstructionExecuted];
};

const findAccumulator = (program: Program) => execute(program)[0];

const fixProgram = (program: Program) => {
    let result = -1,
        success = false;
    const fixable = count<Line>(l => l[0][1] !== undefined)(program);
    for (let i = 0; i < fixable && !success; i++) {
        [result, success] = execute(program, i);
    }
    return result;
};

test('08', () => {
    const testInput = parse('08-test');
    const input = parse('08');
    expect(findAccumulator(testInput)).toEqual(5);
    expect(findAccumulator(input)).toEqual(1451);
    expect(fixProgram(testInput)).toEqual(8);
    expect(fixProgram(input)).toEqual(1160);
});
