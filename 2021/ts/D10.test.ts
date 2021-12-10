import { ascendingBy } from 'dotless';
import { mapLine } from './util';

const openingCharacters = ['(', '[', '{', '<'];
const closing: Record<string, [string, number]> = {
    ')': ['(', 3],
    ']': ['[', 57],
    '}': ['{', 1197],
    '>': ['<', 25137],
};
const opening: Record<string, number> = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
};
const checkLegality = (
    l: string
): [syntaxError: number, autoCompleteScore: number] => {
    const queue = [];
    for (const c of l) {
        if (openingCharacters.includes(c)) {
            queue.push(c);
        } else {
            const actual = queue.pop();
            const [expected, score] = closing[c];
            if (actual !== expected) {
                return [score, 0];
            }
        }
    }
    return [0, queue.reduceRight((acc, c) => acc * 5 + opening[c], 0)];
};

const solve = (fn: string) => {
    const scores = mapLine(fn, checkLegality);
    const sumOfSES = scores.reduce((acc, score) => acc + score[0], 0);
    const acs = scores
        .filter(s => s[1] > 0)
        .map(s => s[1])
        .sort(ascendingBy());
    console.assert(acs.length % 2 === 1);
    const middleACS = acs[(acs.length - 1) / 2];
    return [sumOfSES, middleACS];
};

test('10', () => {
    expect(solve('10-test')).toEqual([26397, 288957]);
    expect(solve('10')).toEqual([392043, 1605968119]);
});
