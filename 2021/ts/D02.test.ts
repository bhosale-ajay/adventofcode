import { mapLine } from './util';

type Position = [horizontal: number, dp1: number, dp2: number, aim: number];
type Command = (p: Position, unit: number) => Position;
type CommandType = 'forward' | 'down' | 'up';
type CommandMap = Record<CommandType, Command>;
type Instruction = [command: CommandType, unit: number];

const control: CommandMap = {
    forward: ([h, dp1, dp2, a], u) => [h + u, dp1, dp2 + a * u, a],
    down: ([h, dp1, dp2, a], u) => [h, dp1 + u, dp2, a + u],
    up: ([h, dp1, dp2, a], u) => [h, dp1 - u, dp2, a - u],
};

const lineToInstruction = (l: string): Instruction => {
    const parts = l.split(' ');
    return [parts[0], +parts[1]] as Instruction;
};

const navigate = (ins: Instruction[]) => {
    const seed = [0, 0, 0, 0] as Position;
    const [h, dp1, dp2] = ins.reduce(
        (acc, [command, unit]) => control[command](acc, unit),
        seed
    );
    return [h * dp1, h * dp2];
};

test('02', () => {
    const ti = mapLine('02-test', lineToInstruction);
    const ai = mapLine('02', lineToInstruction);
    expect(navigate(ti)).toEqual([150, 900]);
    expect(navigate(ai)).toEqual([1250395, 1451210346]);
});
