import * as inputSets from "./09-input";
import { assert } from "./util";

const clean = input => {
    let insideGarbage = false;
    let score = 0;
    let level = 1;
    let nonCanceled = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === "!") {
            i = i + 1;
        } else if (char === ">") {
            insideGarbage = false;
        } else if (insideGarbage) {
            nonCanceled = nonCanceled + 1;
        } else if (char === "<") {
            insideGarbage = true;
        } else if (char === "{") {
            score = score + level;
            level = level + 1;
        } else if (char === "}") {
            level = level - 1;
        }
    }
    return [score, nonCanceled];
};

const [s, nc] = clean(inputSets.ip0901);
assert(s, 10616, "09.1");
assert(nc, 5101, "09.2");
