import { mapLine } from './util';

const value: any = {
    1: 1,
    2: 2,
    '=': -2,
    '-': -1,
    0: 0,
};
const s2n = (s: string) => {
    let p = 0;
    let v = 0;
    for (let i = s.length - 1; i >= 0; i--) {
        v = v + Math.pow(5, p) * value[s[i]];
        p = p + 1;
    }
    return v;
};

const unit = ['=', '-', '0', '1', '2'];
const n2s = (n: number): string => {
    if (n === 0) {
        return '';
    }
    const d = Math.floor((n + 2) / 5);
    const m = (n + 2) % 5;
    return n2s(d) + unit[m];
};

const solve = (fn: string) => n2s(mapLine(fn, s2n).reduce((a, b) => a + b, 0));

test('25', () => {
    expect(solve('25-test')).toEqual('2=-1=0');
    expect(solve('25')).toEqual('2=10---0===-1--01-20');
});
