import { countBy, count } from 'dotless';
import { getLines } from './util';

const countQuestions = countBy<string>(q => q);
const checkGroup = (
    [accUQ, accAllYes]: [number, number],
    group: string
): [number, number] => {
    const questions = countQuestions(group);
    const participants = (questions['\n'] || 0) + 1;
    delete questions['\n'];
    const uniqueQuestions = Object.keys(questions).length;
    const countIfAllAgrees = count<number>(c => c === participants);
    const allYes =
        participants === 1
            ? uniqueQuestions
            : countIfAllAgrees(Object.values(questions));
    return [accUQ + uniqueQuestions, accAllYes + allYes];
};
const solve = (ip: string) => getLines(ip, '\n\n').reduce(checkGroup, [0, 0]);

test('06', () => {
    expect(solve('06-test')).toEqual([11, 6]);
    expect(solve('06')).toEqual([6170, 2947]);
});
