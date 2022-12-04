import { getLines } from './util';

const calPriority = (c: string) => {
    const charCode = c.charCodeAt(0);
    if (charCode >= 97) {
        return charCode - 97 + 1;
    } else {
        return charCode - 65 + 1 + 26;
    }
};

const commonChars = (a: string, b: string) => {
    const m = b.match(new RegExp(`[${a}]`, 'g'));
    return m ? m.join('') : '';
};

const lineToPriority = (l: string) => {
    const cs = l.length / 2;
    const fc = l.substring(0, cs);
    const sc = l.substring(cs);
    return calPriority(commonChars(fc, sc));
};

const solve = (ip: string) =>
    getLines(ip).reduce(
        ([sumP1, sumP2, pl], l, li): [number, number, string] => {
            const updatedP1 = sumP1 + lineToPriority(l);
            if (li % 3 === 0) return [updatedP1, sumP2, l];
            if (li % 3 === 1) return [updatedP1, sumP2, commonChars(pl, l)];
            return [updatedP1, sumP2 + calPriority(commonChars(pl, l)), ''];
        },
        [0, 0, ''] as [number, number, string]
    );

test('03', () => {
    const t = solve('03-test');
    const a = solve('03');
    expect(t).toEqual([157, 70, '']);
    expect(a).toEqual([7568, 2780, '']);
});
