import { descendingBy } from 'dotless';
import { mapLine } from './util';

const sumElfCal = (l: string) => l.split('\n').reduce((acc, l) => acc + +l, 0);
const parse = (ip: string) => mapLine(ip, sumElfCal, '\n\n');
const solve = (ip: string) => {
    const [a, b, c, ..._] = parse(ip).sort(descendingBy());
    return [a, a + b + c];
};

test('01', () => {
    const t = solve('01-test');
    const a = solve('01');
    expect(t).toEqual([24000, 45000]);
    expect(a).toEqual([68467, 203420]);
});
