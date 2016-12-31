import * as inputSets from "./09-input";
import { assert, matchesToArray } from "./util";

const countDecompressedLength = (input) => {
    const compressed = input.replace(/\n/g, "");
    let count = 0;
    let character;
    let startIndex = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let characterIndex = 0; characterIndex < compressed.length; characterIndex++) {
        character = compressed[characterIndex];
        if (character === "(") {
            startIndex = characterIndex;
            let instruction = "";
            while (1 === 1) {
                characterIndex = characterIndex + 1;
                character = compressed[characterIndex];
                if (character === ")") {
                    break;
                }
                instruction = instruction + character;
            }
            const [noOfCharToRepeated, by] = instruction.split("x").map(c => +c);
            characterIndex = characterIndex + noOfCharToRepeated;
            count = count + (noOfCharToRepeated * by);
        } else {
            count = count + 1;
        }
    }
    return count;
};

// Your input is an expression
const markers = matchesToArray(inputSets.ip0902, /\((\d+)+x(\d+)\)([a-z]+)?/ig, m =>
    [
        0,
        m[0].length,
        +(m[1]),
        +(m[2]),
        (m[3] ? m[3].length : 0),
        +(m[1]) > (m[3] ? m[3].length : 0)
    ]);

let markerIndex = 0;
// tslint:disable-next-line:no-unused-variable
for (const [closingBrackets, selfLength, noOfCharToRepeated, by, charLength, expanding] of markers) {
    if (expanding) {
        let charCovered = 0;
        let childCounter = 1;
        while (charCovered < noOfCharToRepeated) {
            const [closingBracketsForChild, childLength] = markers[markerIndex + childCounter];
            charCovered = charCovered + <number> childLength;
            if (charCovered === noOfCharToRepeated) {
                markers[markerIndex + childCounter][0] = <number> closingBracketsForChild + 1;
            }
            childCounter = childCounter + 1;
        }
    }
    markerIndex++;
}
let expression = "0 ";
// tslint:disable-next-line:no-unused-variable
for (const [closingBrackets, selfLength, noOfCharToRepeated, by, charLength, expanding] of markers) {
    expression += ` + (${by} * ` + (expanding ? "(0 " : ` ${charLength})`) +  "))".repeat(closingBrackets);
}
assert(countDecompressedLength(inputSets.ip0901), 57, "Day 9 - Set 1, Sample input");
assert(countDecompressedLength(inputSets.ip0902), 115118, "Day 9 - Set 1, Actual input");
// tslint:disable-next-line:no-eval
assert(eval(expression), 11107527530, "Day 9 - Set 2, Actual input");
