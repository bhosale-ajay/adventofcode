import { descendingBy } from 'dotless';
import { getLines } from './util';

const descending = descendingBy();

const rotate = (lines: string[]) => {
    const rocks: string[] = [];
    const verticalLength = lines.length;
    for (let i = 0; i < verticalLength; i++) {
        rocks.push(lines.reduce((acc, h) => acc + h[i], ''));
    }
    return rocks;
};

const tilt = (line: string) => {
    return line
        .split('#')
        .map(s => s.split('').sort(descending).join(''))
        .join('#');
};

const calculateLoad = (line: string) => {
    const ll = line.length;
    let load = 0;
    for (let i = 0; i <= ll; i++) {
        if (line[i] === 'O') {
            load = load + (ll - i);
        }
    }
    return load;
};

const sumIt = (a: number, b: number) => a + b;

const solve = (fn: string) => {
    return rotate(getLines(fn)).map(tilt).map(calculateLoad).reduce(sumIt);
};

test('14-P1', () => {
    expect(solve('14-t1')).toEqual(136);
    expect(solve('14')).toEqual(109654);
});
