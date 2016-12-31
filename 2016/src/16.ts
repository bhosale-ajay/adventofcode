import { assert } from "./util";
/*
 Reference : https://www.reddit.com/r/adventofcode/comments/5ititq/2016_day_16_c_how_to_tame_your_dragon_in_under_a/
*/
// This is formula to get dragon parity bit
const p = (n) => (((n & (n * -1)) << 1) & n) !== 0 ? "1" : "0";
const expandInput = (a, spaceToFill) => {
    const b = a.split("").reverse().reduce((acc, c) => acc + (c === "0" ? "1" : "0"), "");
    let result = a;
    let n = 0;
    while (result.length < spaceToFill) {
        let toAppend = p(n + 1)  + b + p(n + 2) + a +
                       p(n + 3)  + b + p(n + 4) + a +
                       p(n + 5)  + b + p(n + 6) + a +
                       p(n + 7)  + b + p(n + 8) + a +
                       p(n + 9)  + b + p(n + 10) + a +
                       p(n + 11) + b + p(n + 12) + a +
                       p(n + 13) + b + p(n + 14) + a +
                       p(n + 15) + b + p(n + 16) + a;
        let required = spaceToFill - result.length;
        if (required > toAppend.length) {
            result += toAppend;
        } else {
            result += toAppend.substr(0, required);
        }
        n += 16;
    }
    return result;
};
// This can be improved a lot
const computeChecksum = (content) => {
    let checksum = "";
    for (let i = 0; i < content.length; i += 2) {
        checksum += content.charAt(i) === content.charAt(i + 1) ? "1" : "0";
    }
    return checksum.length % 2 === 1 ? checksum : computeChecksum(checksum);
};
assert(computeChecksum(expandInput("10010000000110000", 272)), "10010110010011110", "Day 16 - Set 1");
// assert(computeChecksum(expandInput("10010000000110000", 35651584)), "01101011101100011", "Day 16 - Set 2");
