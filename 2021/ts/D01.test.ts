import { mapLineToNumber } from './util';

const countIncrements = (ms: number[], indexToCompare = 1) =>
    ms.reduce(
        (c, m, i) =>
            i >= indexToCompare && m > ms[i - indexToCompare] ? c + 1 : c,
        0
    );

test('01', () => {
    const ti = mapLineToNumber('01-test');
    const ai = mapLineToNumber('01');
    expect(countIncrements(ti)).toEqual(7);
    expect(countIncrements(ai)).toEqual(1791);
    expect(countIncrements(ti, 3)).toEqual(5);
    expect(countIncrements(ai, 3)).toEqual(1822);
});
