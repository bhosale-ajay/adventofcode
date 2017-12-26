import * as inputSets from "./19-input";
import { assert } from "./util";

const parse = i => i.split("\n").map(l => l.split(""));
const vertical = ([r, c], dir) => [r + dir, c];
const horizontal = ([r, c], dir) => [r, c + dir];
const leftOrRight = (path, [r, c]) => getSign(path, [r, c + 1]) ? 1 : -1;
const upOrDown = (path, [r, c]) => getSign(path, [r + 1, c]) ? 1 : -1;
const getSign = (path, [r, c]) => (r >= 0 && r < path.length) &&
                                (c >= 0 && c < path[r].length) &&
                                path[r][c] !== " " ? path[r][c] : false;
const walk = path => {
    let location: any = [0, path[0].findIndex(c => c === "|")];
    let letters = "";
    let direction = 1;
    let navigator = vertical;
    let steps = 0;
    let sign = getSign(path, location);
    while (sign) {
        steps = steps + 1;
        if (sign === "+") {
            direction = navigator === vertical ? leftOrRight(path, location) : upOrDown(path, location);
            navigator = navigator === vertical ? horizontal : vertical;
        } else if ("A" <= sign && sign <= "Z") {
            letters = letters + sign;
        }
        location = navigator(location, direction);
        sign = getSign(path, location);
    }
    return [letters, steps];
};

const [tl, ts] = walk(parse(inputSets.ip1901));
const [pl, ps] = walk(parse(inputSets.ip1902));

assert(tl, "ABCDEF",     "19.1, Test 01");
assert(pl, "NDWHOYRUEA", "19.1");
assert(ts, 38,           "19.2, Test 01");
assert(ps,  17540,       "19.2");
