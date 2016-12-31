import * as inputSets from "./02-input";
import { assert } from "./util";

const [increment, decrement, nochange] = [1, -1, 0];
const U = [decrement, nochange];
const R = [nochange, increment];
const D = [increment, nochange];
const L = [nochange, decrement];
const actions = {U, R, D, L};

const getPassword = (keypad, instructions, startPosition) => {
    const [min, max] = [-1, keypad[0].length];
    const boundChecker = ([x, y]) => x > min && max > x && y > min && max > y;
    const hasValue = ([x, y]) => keypad[x][y] !== 0;
    const [finalPassword] = instructions
            .split("\n")
            .reduce(([password, x, y], line) => {
                const [newX, newY] = line.split("")
                    .map(aI => actions[aI])
                    .reduce(([currentX, currentY], [xChange, yChange]) => {
                        const newPosition: any = [currentX + xChange, currentY + yChange];
                        return (boundChecker(newPosition) && hasValue(newPosition)) ? newPosition : [currentX, currentY];
                    }, [x, y]);
                    return [password + keypad[newX][newY], newX, newY];
            }, ["", ...startPosition]);
    return finalPassword;
};

assert(getPassword(inputSets.ip0201Grid, inputSets.ip0201, inputSets.ip0201StartPosition),  "1985", "Day 2 - Set 1, Sample input 01");
assert(getPassword(inputSets.ip0201Grid, inputSets.ip0202, inputSets.ip0201StartPosition), "65556", "Day 2 - Set 1, Actual input 01");
assert(getPassword(inputSets.ip0202Grid, inputSets.ip0201, inputSets.ip0202StartPosition),  "5DB3", "Day 2 - Set 2, Sample input 01");
assert(getPassword(inputSets.ip0202Grid, inputSets.ip0202, inputSets.ip0202StartPosition), "CB779", "Day 2 - Set 2, Actual input 01");
