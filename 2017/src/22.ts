import * as inputSets from "./22-input";
import { assert } from "./util";

const parse = i => i.split("\n").map(l => l.split(""));
const n = [ 0, -1, "north"];
const e = [ 1,  0, "east"];
const w = [-1,  0, "west"];
const s = [ 0,  1, "south"];
const north = { L : w, R : e, O : s, F : n };
const east  = { L : n, R : s, O : w, F : e };
const west  = { L : s, R : n, O : e, F : w };
const south = { L : e, R : w, O : n, F : s };
const directions = { north, east, west, south };
const getNode = (grid, key) => grid[key] = (grid[key] || ".");
const createGrid = input => {
    const grid = {};
    const seed = parse(input);
    const length = seed.length;
    const offset = Math.floor(length / 2);
    for (let y = 0; y < length; y++) {
        for (let x = 0; x < length; x++) {
            grid[`n${y - offset}.${x - offset}`] = seed[y][x];
        }
    }
    return grid;
};
const states = {
    "." : ["#", "L", true],
    "#" : [".", "R", false]
};
const evolvedStates = {
    "." : ["W", "L", false],
    "W" : ["#", "F", true],
    "#" : ["F", "R", false],
    "F" : [".", "O", false]
};
const spread = (input, transition, times) => {
    const grid = createGrid(input);
    let [x, y, xo, yo, dir, count] = [0, 0, 0, -1, "north", 0];
    while (times--) {
        const key = `n${y}.${x}`;
        const node = getNode(grid, key);
        const [next, move, infected] = transition[node];
        grid[key] = next;
        if (infected) {
            count = count + 1;
        }
        [xo, yo, dir] = directions[dir][move];
        [x, y] = [x + xo, y + yo];
    }
    return count;
};
assert(spread(inputSets.ip2201, states, 10000),              5587, "22.1, Test 01");
assert(spread(inputSets.ip2202, states, 10000),              5223, "22.1");
assert(spread(inputSets.ip2201, evolvedStates, 10000000), 2511944, "22.2, Test 01");
assert(spread(inputSets.ip2202, evolvedStates, 10000000), 2511456, "22.2");
