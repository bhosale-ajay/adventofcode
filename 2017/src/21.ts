import * as inputSets from "./21-input";
import { assert } from "./util";

const parseRules = i => i.split("\n").map(rd => rd.split(" => "))
                                     .map(([k, r]) => [combinations(k), r])
                                     .reduce((acc, [cs, r]) => {
                                        cs.forEach(c => acc[c] = r);
                                        return acc;
                                     }, {});
const r2 = ([a, b, c, d]) => `${a}${b}/${c}${d}`;
const r3 = ([a, b, c, d, e, f, g, h, i]) => `${a}${b}${c}/${d}${e}${f}/${g}${h}${i}`;
const c3 = ([a, b, c, d, e, f, g, h, i]) => [
    r3([a, b, c, d, e, f, g, h, i]), r3([g, d, a, h, e, b, i, f, c]),
    r3([i, h, g, f, e, d, c, b, a]), r3([c, f, i, b, e, h, a, d, g]),
    r3([g, h, i, d, e, f, a, b, c]), r3([a, d, g, b, e, h, c, f, i]),
    r3([c, b, a, f, e, d, i, h, g]), r3([i, f, c, h, e, b, g, d, a])];
const c2 = ([a, b, c, d]) => [
    r2([a, b, c, d]), r2([c, a, d, b]), r2([d, c, b, a]), r2([b, d, a, c]),
    r2([c, d, a, b]), r2([a, c, b, d]), r2([b, a, d, c]), r2([d, b, c, a])];
const pixels = r => r.replace(/\//g, "").split("");
const combinations = rule => ((rule.length === 5 ? c2 : c3) as any)(pixels(rule));
const transform = (grid, rules) => {
    if (grid.length < 16) {
        return rules[grid];
    }
    const ps = grid.split("/");
    const length = ps.length;
    const size = (length % 2 === 0) ? 2 : 3;
    const transformed = [];
    let chunkCounter = 0;
    for (let gr = 0; gr < length; gr = gr + size) {
        for (let gc = 0; gc < length; gc = gc + size) {
            let part = "";
            for (let pr = 0; pr < size; pr++) {
                if (pr !== 0) {
                    part = part + "/";
                }
                part = part + ps[gr + pr].substr(gc, size);
            }
            const transformedPart = rules[part].split("/");
            for (let tr = 0; tr < transformedPart.length; tr++) {
                const index = (chunkCounter * transformedPart.length) + tr;
                transformed[index] = (transformed[index] || "");
                transformed[index] = transformed[index] + transformedPart[tr];
            }
        }
        chunkCounter = chunkCounter + 1;
    }
    return transformed.join("/");
};

const countOn = g => (g.match(/#/g) || []).length;

const expand = (rules, times) => {
    let grid = ".#./..#/###";
    while (times--) {
        grid = transform(grid, rules);
    }
    return countOn(grid);
};

const testRules = parseRules(inputSets.ip2101);
const puzzleRules = parseRules(inputSets.ip2102);

const on1 = expand(testRules, 2);
const on2 = expand(puzzleRules, 5);
const on3 = expand(puzzleRules, 18);
assert(on1,      12, "21.1, Test 01");
assert(on2,     117, "21.1");
assert(on3, 2026963, "21.2");
