import * as inputSets from "./15-input";
import { assert } from "./util";

const findTicks = (input, addExtraDish = false) => {
    const regex = /Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)/;
    const parseLine = m => [+(m[1]), +(m[2])];
    const discs = input.split("\n").map(l => l.match(regex)).map(parseLine);
    const willPassDisc = ([positions, offset], diskIndex, tick) => (tick + diskIndex + 1 + offset) % positions === 0;
    const willPass = (tick) => discs.every((disc, diskIndex) => willPassDisc(disc, diskIndex, tick));
    if (addExtraDish) {
      discs.push([11, 0]);
    }
    let tick = 0;
    while (!willPass(tick)) {
      tick++;
    }
    return tick;
};
assert(findTicks(inputSets.ip1501), 317371, "Day 15 - Set 1");
assert(findTicks(inputSets.ip1501, true), 2080951, "Day 15 - Set 1");
