import { first, mapWithLast, query } from "dotless";
import { puzzleInput, test01, test02, test03, test04, test05, test06, test07 } from "./inputs/i01";

const sum = (f: number, i: number) => f + i;

const findResultingFrequency = (input: number[]) => input.reduce(sum, 0);

const reachedTwice = () => {
    const seen: any = { "0" : true };
    return (n: number) => {
        if (seen[n]) {
            return true;
        } else {
            seen[n] = true;
            return false;
        }
    };
};

function* repeat(input: number[]) {
    while (true) {
        yield* input;
    }
}

const firstFrequencyReachesTwice = (input: number[]) => query(
    repeat(input),
    mapWithLast(sum, 0),
    first(reachedTwice())
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
