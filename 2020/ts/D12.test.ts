import { mapLine } from './util';
const N = 'N';
const S = 'S';
const E = 'E';
const W = 'W';
const L = 'L';
const R = 'R';
type Direction = 'N' | 'S' | 'E' | 'W';
type Turn = 'L' | 'R';
type Action = Direction | Turn | 'F';
type Navigation = [action: Action, value: number];
type Ship = [x: number, y: number, facing: Direction];
type Snwp = [x: number, y: number, wx: number, wy: number];
type StateChange<T> = (s: T, v: number) => T;
type StateChangeMap<T> = Record<Action, StateChange<T>>;
const takeTurn = (current: Direction, value: number, turn: Turn): Direction => {
    const map: Direction[] = [N, E, S, W];
    const index = map.indexOf(current);
    const next = value / 90;
    const nextIndex = (4 + index + next * (turn === R ? 1 : -1)) % 4;
    return map[nextIndex];
};
const rotate = (
    wx: number,
    wy: number,
    value: number,
    turn: Turn
): [number, number] => {
    if (value == 180) {
        return [wx * -1, wy * -1];
    }
    if ((value === 90 && turn === R) || (value === 270 && turn == L)) {
        return [wy, -wx];
    }
    return [-wy, wx];
};
const factor = {
    E: 1,
    W: -1,
    S: -1,
    N: 1,
};
const shipNav: StateChangeMap<Ship> = {
    N: ([x, y, f], v) => [x, y + v, f],
    S: ([x, y, f], v) => [x, y - v, f],
    E: ([x, y, f], v) => [x + v, y, f],
    W: ([x, y, f], v) => [x - v, y, f],
    L: ([x, y, f], v) => [x, y, takeTurn(f, v, L)],
    R: ([x, y, f], v) => [x, y, takeTurn(f, v, R)],
    F: ([x, y, f], v) => [
        f === E || f === W ? x + v * factor[f] : x,
        f === N || f === S ? y + v * factor[f] : y,
        f,
    ],
};
const snwpNav: StateChangeMap<Snwp> = {
    N: ([x, y, wx, wy], v) => [x, y, wx, wy + v],
    S: ([x, y, wx, wy], v) => [x, y, wx, wy - v],
    E: ([x, y, wx, wy], v) => [x, y, wx + v, wy],
    W: ([x, y, wx, wy], v) => [x, y, wx - v, wy],
    L: ([x, y, wx, wy], v) => [x, y, ...rotate(wx, wy, v, L)],
    R: ([x, y, wx, wy], v) => [x, y, ...rotate(wx, wy, v, R)],
    F: ([x, y, wx, wy], v) => [x + wx * v, y + wy * v, wx, wy],
};
const lineToNav = (l: string) => [l[0], +l.substr(1)] as Navigation;
const calculate = <T extends [number, number, ...any[]]>(
    ins: Navigation[],
    stateChange: StateChangeMap<T>,
    base: T
) => {
    const [x, y] = ins.reduce(
        (state, [action, value]) => stateChange[action](state, value),
        base
    );
    return Math.abs(x) + Math.abs(y);
};
test('12', () => {
    const t = mapLine('12-test', lineToNav);
    const i = mapLine('12', lineToNav);
    expect(calculate(t, shipNav, [0, 0, E] as Ship)).toEqual(25);
    expect(calculate(i, shipNav, [0, 0, E] as Ship)).toEqual(2879);
    expect(calculate(t, snwpNav, [0, 0, 10, 1] as Snwp)).toEqual(286);
    expect(calculate(i, snwpNav, [0, 0, 10, 1] as Snwp)).toEqual(178986);
});
