import { cycle, first, mapWithLast, query } from "dotless";
import { getInput, seenBefore } from "./util";

const parse = (s: string) => s.split(/,|\n/).map(n => + n);
const test01 = parse("+1, +1, +1");
const test02 = parse("+1, +1, -2");
const test03 = parse("-1, -2, -3");
const test04 = parse("+1, -1");
const test05 = parse("+3, +3, +4, -2, -4");
const test06 = parse("-6, +3, +8, +5, -6");
const test07 = parse("+7, +7, -2, -7, -4");
const puzzleInput = parse(getInput("01"));

const sum = (f: number, i: number) => f + i;

const findResultingFrequency = (frequencies: number[]) => frequencies.reduce(sum, 0);

const firstFrequencyReachesTwice = (frequencies: number[]) => query(
    cycle(frequencies),
    mapWithLast(sum, 0),
    first(seenBefore([0]))
);

test("01, Part 1", () => {
    expect(findResultingFrequency(test01)).toEqual(3);
    expect(findResultingFrequency(test02)).toEqual(0);
    expect(findResultingFrequency(test03)).toEqual(-6);
    expect(findResultingFrequency(puzzleInput)).toEqual(466);
});

test("01, Part 2", () => {
    expect(firstFrequencyReachesTwice(test04)).toEqual(0);
    expect(firstFrequencyReachesTwice(test05)).toEqual(10);
    expect(firstFrequencyReachesTwice(test06)).toEqual(5);
    expect(firstFrequencyReachesTwice(test07)).toEqual(14);
    expect(firstFrequencyReachesTwice(puzzleInput)).toEqual(750);
});
