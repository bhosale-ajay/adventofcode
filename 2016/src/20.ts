import * as inputSets from "./20-input";
import { assert } from "./util";

const lines = inputSets.ip2001.split("\n");
const parseRange = l => l.split("-").map(n => +n);
const range: any = lines.map(parseRange).sort((a, b) => a[0] - b[0]);
let allowedInRange = 0;
let firstValid = -1;
let lastTo = 0;
for (const [from, to] of range) {
    if (from - lastTo > 1) {
        if (firstValid === -1) {
            firstValid = lastTo + 1;
        }
        allowedInRange += from - lastTo - 1;
    }
    lastTo = Math.max(lastTo, to);
}
const allowed = 4294967295 - lastTo + allowedInRange;
assert(firstValid, 19449262, "Day 20 - Set 1");
assert(allowed, 119, "Day 20 - Set 1");
