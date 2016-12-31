import * as inputSets from "./06-input";
import { assert } from "./util";

/*
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev         // ContenderList Sample
sdttsa         0 => { e: 3, d: 2, r: 2, a: 1, t: 2, s: 2, n: 2, v: 2 }
rasrtv         1 => { e: 2, r: 2, a: 3, t: 2, s: 2, d: 1, v: 2, n: 2 }
nssdts   ==>   2 => { d: 2, v: 1, n: 2, a: 2, e: 2, r: 2, t: 2, s: 3 }
ntnada         3 => { a: 2, t: 3, d: 2, v: 2, n: 2, r: 2, s: 2, e: 1 }
svetve         4 => { d: 2, e: 3, s: 2, r: 2, t: 2, v: 2, n: 1, a: 2 }
tesnvt         5 => { n: 2, e: 2, r: 3, d: 2, s: 2, v: 2, a: 2, t: 1 }
vntsnd
vrdear
dvrsen
enarar
*/
const createContenderList = (contendersList, characters) => {
    characters.forEach((character, placeIndex) => {
        if (!contendersList[placeIndex]) {
            contendersList[placeIndex] = {};
        }
        const contenders = contendersList[placeIndex];
        contenders[character] = (contenders[character] | 0) + 1;
    });
    return contendersList;
};
// Keys are by default sorted alphabetically 
// { e: 3, d: 2, r: 2, a: 1, t: 2, s: 2, n: 2, v: 2 } Returns b
const leastCommon = o => Object.keys(o).reduce((a, b) => (o[a] < o[b] ? a : b));
// { e: 3, d: 2, r: 2, a: 1, t: 2, s: 2, n: 2, v: 2 } Returns a
const mostCommon = o => Object.keys(o).reduce((a, b) => (o[a] > o[b] ? a : b));
const correctError = (input, selectionStrategy) => input.split("\n")
    .map((line) => line.split(""))
    .reduce(createContenderList, [])
    .map(selectionStrategy)
    .join("");
assert(correctError(inputSets.ip0601, mostCommon), "easter", "Day 6 - Set 1, Sample Input");
assert(correctError(inputSets.ip0602, mostCommon), "bjosfbce", "Day 6 - Set 1, Actual Input");
assert(correctError(inputSets.ip0601, leastCommon), "advent", "Day 6 - Set 2, Sample Input");
assert(correctError(inputSets.ip0602, leastCommon), "veqfxzfx", "Day 6 - Set 2, Actual Input");
