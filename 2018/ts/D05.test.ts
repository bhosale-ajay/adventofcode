import { map, query, range, reduce } from "dotless";
import { getInput } from "./util";

const parse = (ip: string) => ip.split("").map(c => c.charCodeAt(0));

const reducePolymer = (units: number[]) => {
    for (let i = 0; i < units.length - 1; i++) {
        if (Math.abs(units[i] - units[i + 1]) === 32) {
            units.splice(i, 2);
            i = i - 2;
        }
    }
    return units.length;
};

const findOptimalSolution = (units: number[]) => query(
    range(65, 90),
    map(r => reducePolymer(([...units]).filter(u => !(u === r || u === r + 32)))),
    reduce((acc, l) => acc < l ? acc : l, Number.MAX_SAFE_INTEGER)
);

test("05", () => {
    const test01 = parse("dabAcCaCBAcCcaDA");
    const puzzleInput = parse(getInput("05"));
    expect(reducePolymer(parse("aA"))).toEqual(0);
    expect(reducePolymer(parse("abBA"))).toEqual(0);
    expect(reducePolymer(parse("abAB"))).toEqual(4);
    expect(reducePolymer(parse("aabAAB"))).toEqual(6);
    expect(reducePolymer(test01)).toEqual(10);
    expect(findOptimalSolution(test01)).toEqual(4);
    expect(reducePolymer(puzzleInput)).toEqual(9808);
    expect(findOptimalSolution(puzzleInput)).toEqual(6484);
});
