import { getLines, Map } from './util';

type DigitMap = Map<string>;
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const letters = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
];
const arrayToMap = (acc: DigitMap, n: string, ni: number) => {
    acc[n] = (ni + 1).toString();
    return acc;
};
const mapDigits = digits.reduce(arrayToMap, {} as DigitMap);
const mapLetters = letters.reduce(arrayToMap, {} as DigitMap);
const mapP1 = mapDigits;
const tokensP1 = digits;
const mapP2 = { ...mapDigits, ...mapLetters };
const tokensP2 = [...digits, ...letters];
const findFirst = (line: string, tokens: string[], map: DigitMap): string => {
    for (let i = 0; i < line.length; i++) {
        const ti = tokens.findIndex(t => line.substring(i).startsWith(t));
        if (ti > -1) {
            return map[tokens[ti]];
        }
    }
    return '0';
};
const findLast = (line: string, tokens: string[], map: DigitMap): string => {
    for (let i = line.length - 1; i >= 0; i--) {
        const ti = tokens.findIndex(t => line.substring(i).startsWith(t));
        if (ti > -1) {
            return map[tokens[ti]];
        }
    }
    return '0';
};
const solve = (fn: string, tokens: string[], map: DigitMap): number => {
    return getLines(fn)
        .map(l => findFirst(l, tokens, map) + '' + findLast(l, tokens, map))
        .reduce((acc, l) => +l + acc, 0);
};

test('01', () => {
    expect(solve('01-t1', tokensP1, mapP1)).toEqual(142);
    expect(solve('01', tokensP1, mapP1)).toEqual(56465);
    expect(solve('01-t2', tokensP2, mapP2)).toEqual(281);
    expect(solve('01', tokensP2, mapP2)).toEqual(55902);
});
