import { mapLine } from './util';
import { count, matchesToArray } from 'dotless';
type Passport = Map<string, string>;
type validator = (d: string) => boolean;
const regex = /((ecl)|(byr)|(iyr)|(pid)|(cid)|(hgt)|(eyr)|(hcl)):(#*\w+)/g;
const heightDataExpression = /^(\d+)(cm|in)$/;
const parseFields = (m: RegExpExecArray) => [m[1], m[10]] as [string, string];
const lineToPassport = (l: string) =>
    new Map(matchesToArray(l, regex, parseFields)) as Passport;
const parse = (ip: string) => mapLine(ip, lineToPassport, '\n\n');
const checkYearRange = (min: number, max: number) => (y: string) =>
    min <= +y && +y <= max;
const checkHeight = (height: string) => {
    const matches = heightDataExpression.exec(height);
    if (matches === null) return false;
    const [, value, unit] = matches;
    return unit === 'in'
        ? 59 <= +value && +value <= 76
        : 150 <= +value && +value <= 193;
};
const checkPattern = (p: RegExp) => (v: string) => p.test(v);

const validators: [field: string, validator: validator][] = [
    ['byr', checkYearRange(1920, 2002)],
    ['iyr', checkYearRange(2010, 2020)],
    ['eyr', checkYearRange(2020, 2030)],
    ['hgt', checkHeight],
    ['hcl', checkPattern(/^#[0-9a-f]{6}$/)],
    ['ecl', checkPattern(/^amb|blu|brn|gry|grn|hzl|oth$/)],
    ['pid', checkPattern(/^\d{9}$/)],
];

const hasValidFields = (passport: Passport) =>
    passport.size === 8 || (passport.size === 7 && !passport.has('cid'));

const hasValidData = (passport: Passport) =>
    hasValidFields(passport) &&
    validators.every(([field, validator]) =>
        validator(passport.get(field) as string)
    );

test('04', () => {
    const testInput01 = parse('04-test-01');
    const testInput02 = parse('04-test-02');
    const testInput03 = parse('04-test-03');
    const input = parse('04');

    const validFieldsCounter = count(hasValidFields);
    const validDataCounter = count(hasValidData);

    expect(validFieldsCounter(testInput01)).toEqual(2);
    expect(validFieldsCounter(input)).toEqual(237);
    expect(validDataCounter(testInput02)).toEqual(0);
    expect(validDataCounter(testInput03)).toEqual(4);
    expect(validDataCounter(input)).toEqual(172);
});
