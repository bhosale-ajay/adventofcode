import { mapLine } from './util';
type Action = 'addx' | 'noop';
type Instruction = [Action, number];
type State = {
    cycles: number;
    interesting: number;
    x: number;
    pos: number;
    crt: string;
};
const lineToInstruction = (l: string): Instruction => {
    const parts = l.split(' ');
    return [parts[0] as Action, +parts[1]];
};
const cycle = (
    { cycles, interesting, x, pos, crt }: State,
    v: number
): State => {
    cycles = cycles + 1;
    if ((cycles - 20) % 40 === 0) {
        interesting = interesting + cycles * x;
    }
    crt = crt + (x - 1 <= pos && pos <= x + 1 ? '#' : ' ');
    pos = (pos + 1) % 40;
    if (pos === 0) crt = crt + '\n';
    x = x + v;
    return { cycles, interesting, x, pos, crt };
};
const followInstruction = (state: State, [Action, v]: Instruction): State => {
    state = cycle(state, 0);
    if (Action === 'addx') {
        state = cycle(state, v);
    }
    return state;
};
const solve = (fn: string) => {
    const seed = { cycles: 0, interesting: 0, x: 1, pos: 0, crt: '' };
    const final = mapLine(fn, lineToInstruction).reduce(
        followInstruction,
        seed
    );
    console.log(final.interesting);
    console.log(final.crt);
};
solve('10-test');
solve('10');
