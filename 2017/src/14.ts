import { hash } from "./10";
import * as inputSets from "./14-input";
import { assert } from "./util";

const padLeft = s => "00000000".substring(0, 8 - s.length) + s;
const binary = n => padLeft(n.toString(2));
const computeKnotHash = i => hash(i).map(binary).join("").split("");
const computeHashRows = i => [...new Array(128).keys()].map(n => `${i}-${n}`).map(computeKnotHash);
const directions = [[-1, 0], [0, -1], [0, 1], [1, 0]];
const adjacents = (ri, ci, rows) => directions
                            .map(([x, y]) => [ri + x, ci + y])
                            .filter(([x, y]) => 0 <= x && x < 128 && 0 <= y && y < 128 &&
                                                rows[x][y] === "1");
const visit = (ri, ci, rows) => {
    rows[ri][ci] = -1;
    adjacents(ri, ci, rows).forEach(([ar, ac]) => visit(ar, ac, rows));
};
const solve = input => {
    const rows = computeHashRows(input);
    let count = 0;
    let empty = 0;
    for (let ri = 0; ri < 128; ri++) {
        for (let ci = 0; ci < 128; ci++) {
            if (rows[ri][ci] === "0") {
                empty = empty + 1;
                continue;
            }
            if (rows[ri][ci] === "1") {
                visit(ri, ci, rows);
                count = count + 1;
            }
        }
    }
    return [(128 * 128) - empty, count];
};

const [tFilled, tGroupCount] = solve(inputSets.ip1401);
const [filled, grouoCount] = solve(inputSets.ip1402);

assert(tFilled,     8108, "14.1, Test 01");
assert(filled,      8292, "14.1");
assert(tGroupCount, 1242, "14.2, Test 01");
assert(grouoCount,  1069, "14.2");
