import { count, matchesToArray } from 'dotless';
import { getInput } from './util';

type Line = [min: number, max: number, char: string, password: string];
const regex = /(\d+)-(\d+)\s+([a-z]):\s+([a-z]+)/g;
const parseLine = (m: RegExpExecArray) => [+m[1], +m[2], m[3], m[4]] as Line;
const parse = (ip: string) => matchesToArray(getInput(ip), regex, parseLine);
const isValid = ([min, max, char, password]: Line) => {
    const count = (password.match(new RegExp(char, 'g')) || []).length;
    return min <= count && count <= max;
};
const isValidCorrectPolicy = ([min, max, char, password]: Line) => {
    const cmi = password[min - 1];
    const cmx = password[max - 1];
    return (cmi === char && cmx !== char) || (cmi !== char && cmx == char);
};
const countValidPasswords = (ip: Line[], validator: (l: Line) => boolean) =>
    count(validator)(ip);

test('02', () => {
    const testInput = parse('02-test');
    const input = parse('02');
    expect(countValidPasswords(testInput, isValid)).toEqual(2);
    expect(countValidPasswords(input, isValid)).toEqual(636);
    expect(countValidPasswords(testInput, isValidCorrectPolicy)).toEqual(1);
    expect(countValidPasswords(input, isValidCorrectPolicy)).toEqual(588);
});
