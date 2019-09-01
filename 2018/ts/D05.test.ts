import { map, query, range, reduce } from "dotless";
import { getInput } from "./util";

const reducePolymer = (units: string, ignore: number = 0) => {
    const stack = [];
    for (const u of units) {
        const uc = u.charCodeAt(0);
        if(uc === ignore || uc === ignore + 32) {
            continue;
        }
        if(stack.length === 0) {
            stack.push(uc);
            continue;
        }
        const luc = stack[stack.length - 1];
        if(luc === uc + 32 || luc === uc - 32) {
            stack.pop();
        } else {
            stack.push(uc);
        }
    }
    return stack.length;
};

const findOptimalSolution = (units: string) => query(
    range(65, 90),
    map(r => reducePolymer(units, r)),
    reduce((acc, l) => acc < l ? acc : l, Number.MAX_SAFE_INTEGER)
);

test("05", () => {
    const test01 = "dabAcCaCBAcCcaDA";
    const puzzleInput = getInput("05");
    expect(reducePolymer("aA")).toEqual(0);
    expect(reducePolymer("abBA")).toEqual(0);
    expect(reducePolymer("abAB")).toEqual(4);
    expect(reducePolymer("aabAAB")).toEqual(6);
    expect(reducePolymer(test01)).toEqual(10);
    expect(findOptimalSolution(test01)).toEqual(4);
    expect(reducePolymer(puzzleInput)).toEqual(9808);
    expect(findOptimalSolution(puzzleInput)).toEqual(6484);
});
