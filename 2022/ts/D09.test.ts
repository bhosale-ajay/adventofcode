import { mapLine, GridLocation } from './util';

type Mover = (l: GridLocation) => GridLocation;
type Action = 'U' | 'L' | 'R' | 'D';
const U: Mover = ([r, c]) => [r, c - 1];
const L: Mover = ([r, c]) => [r - 1, c];
const R: Mover = ([r, c]) => [r + 1, c];
const D: Mover = ([r, c]) => [r, c + 1];
const actions: Record<Action, Mover> = { U, R, D, L };
type Instruction = [Action, number];
const lineToInstruction = (l: string): Instruction => {
    const parts = l.split(' ');
    return [parts[0] as Action, +parts[1]];
};
type State = {
    knots: GridLocation[];
    visited1: Set<string>;
    visited9: Set<string>;
};
const movePoint = (hp: number, tp: number) => {
    const d = hp - tp;
    return tp + (Math.abs(d) === 2 ? d / 2 : d);
};
const moveT = (
    [hr, hc]: GridLocation,
    [tr, tc]: GridLocation
): GridLocation => {
    const distance = Math.max(Math.abs(tr - hr), Math.abs(tc - hc));
    if (distance > 1) {
        tr = movePoint(hr, tr);
        tc = movePoint(hc, tc);
    }
    return [tr, tc];
};
const locationToKey = ([r, c]: GridLocation) => `${r}:${c}`;
const followInstruction = (
    { knots, visited1, visited9 }: State,
    [action, steps]: Instruction
): State => {
    for (let s = 0; s < steps; s++) {
        knots[0] = actions[action](knots[0]);
        for (let i = 1; i <= 9; i++) knots[i] = moveT(knots[i - 1], knots[i]);
        visited1.add(locationToKey(knots[1]));
        visited9.add(locationToKey(knots[9]));
    }
    return { knots, visited1, visited9 };
};
const solve = (fn: string) => {
    const seed: State = {
        knots: new Array(10).fill(0).map(_ => [0, 0] as GridLocation),
        visited1: new Set<string>(['0:0']),
        visited9: new Set<string>(['0:0']),
    };
    const final = mapLine(fn, lineToInstruction).reduce(
        followInstruction,
        seed
    );
    return [final.visited1.size, final.visited9.size];
};

test('09', () => {
    const t1 = solve('09-test-01');
    const t2 = solve('09-test-02');
    const a = solve('09');
    expect(t1).toEqual([13, 1]);
    expect(t2).toEqual([88, 36]);
    expect(a).toEqual([5619, 2376]);
});
