import { getLines } from './util';

type Tree = [number, string, boolean][];
type Expression = (arr: Tree) => number | undefined;
type Dictionary = {
    [key: string]: Expression;
};
const yellNumber =
    (n: number): Expression =>
    (_arr: Tree) =>
        n;
const yellResult =
    ([a, o, b]: string[], d: Dictionary): Expression =>
    (arr: Tree) => {
        const va = d[a](arr);
        const vb = d[b](arr);
        if (va === undefined) {
            arr.push([vb as number, o, true]);
            return undefined;
        } else if (vb === undefined) {
            arr.push([va as number, o, false]);
            return undefined;
        }
        return eval(`${va} ${o} ${vb}`) as number;
    };
const parse = (dict: Dictionary, line: string) => {
    const [name, expression] = line.split(': ');
    const parts = expression.split(' ');
    dict[name] =
        parts.length > 1 ? yellResult(parts, dict) : yellNumber(+expression);
    return dict;
};
const solve = (fn: string) => {
    const d = getLines(fn).reduce(parse, {} as Dictionary);
    const p1 = d['root']([]);
    d['humn'] = () => undefined;
    const tree: Tree = [];
    d['root'](tree);
    let r = tree[tree.length - 1][0];
    let rp = 0;
    for (let i = tree.length - 2; i >= 0; i--) {
        const [v, o, rightSide] = tree[i];
        if (o === '+') {
            // rp + v = r
            rp = r - v;
        } else if (o === '*') {
            // rp * v = r
            rp = r / v;
        } else if (o === '-') {
            // rp - v = r (if rl = 1)
            // v - rp = r (if rl = 2)
            rp = rightSide ? r + v : v - r;
        } else {
            // rp / v = r (if rl = 1)
            // v / rp = r (if rl = 2)
            rp = rightSide ? r * v : v / r;
        }
        r = rp;
    }
    return [p1, r];
};

test('21', () => {
    expect(solve('21-test')).toEqual([152, 301]);
    expect(solve('21')).toEqual([145167969204648, 3330805295850]);
});
