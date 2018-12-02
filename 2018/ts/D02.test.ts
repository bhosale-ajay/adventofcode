import { countBy, findPairs, first, query } from "dotless";
import { getInput } from "./util";

const parse = (s: string) => s.split(/\n/);
const test01 = parse("abcdef\nbababc\nabbcde\nabcccd\naabcdd\nabcdee\nababab");
const test02 = parse("abcde\nfghij\nklmno\npqrst\nfguij\naxcye\nwvxyz");
const puzzleInput = parse(getInput("02"));

const findCheckSum = (boxIDs: string[]) => {
    const counts = boxIDs
        // "aaabbccd" => { a : 3, b : 2, c : 2, d : 1}
        .map(l => query(l.split(""), countBy()))
        // { a : 3, b : 2, c : 2, d : 1} = > { 3 : 1, 2 : 2, 1 : 1}
        .map(o => query(Object.keys(o), countBy(l => o[l].toString())))
        .reduce((acc, o) => ({
            two : acc.two + (o["2"] > 0 ? 1 : 0),
            three: acc.three + (o["3"] > 0 ? 1 : 0)
        }), { two : 0, three : 0});
    return counts.two * counts.three;
};

const differByOneChar = (a: string, b: string) => {
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            mismatch = mismatch + 1;
            if (mismatch > 1) {
                return false;
            }
        }
    }
    return mismatch === 1;
};

const getCommonLettersFromMatch = (match: [string, string, number, number]) => {
    let result = "";
    const [a, b] = match;
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) {
            result = result + a[i];
        }
    }
    return result;
};

const findCommonLetters = (boxIDs: string[]) => query(boxIDs,
                                                      findPairs(differByOneChar),
                                                      first(),
                                                      getCommonLettersFromMatch);

test("02, Part 1", () => {
    expect(findCheckSum(test01)).toEqual(12);
    expect(findCheckSum(puzzleInput)).toEqual(9633);
});

test("02, Part 2", () => {
    expect(findCommonLetters(test02)).toEqual("fgij");
    expect(findCommonLetters(puzzleInput)).toEqual("lujnogabetpmsydyfcovzixaw");
});
