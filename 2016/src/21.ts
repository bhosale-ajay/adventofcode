import * as inputSets from "./21-input";
import { assert } from "./util";

const regex = /(reverse positions) (\d+) through (\d+)|(rotate left) (\d+)|(rotate right) (\d+)|(swap position) (\d+) with position (\d+)|(move position) (\d+) to position (\d+)|(swap letter) (\w) with letter (\w)|(rotate based) on position of letter (\w)/;
const swapPosition = (password, [x, y]) => {
    const temp = password[x];
    password[x] = password[y];
    password[y] = temp;
    return password;
};
const swapLetter = (password, [x, y]) => {
    return password.map(l => l === x ? y : (l === y) ? x : l);
};
const rotate = (password, direction, rotateBy) => {
    let times = rotateBy % password.length;
    while (times > 0) {
        if (direction === "left") {
            password.push(password.shift());
        } else {
            password.unshift(password.pop());
        }
        times--;
    }
    return password;
};
const rotateBasedOnLetter = (password, [x]) => {
    const index = password.indexOf(x);
    let rotateBy = index + 1;
    if (index >= 4) {
        rotateBy += 1;
    }
    return rotate(password, "right", rotateBy);
};
const undoRotateBasedOnLetter = (password, [x]) => {
    const index = password.indexOf(x);
    // works only for 8 char based length
    // A better option will be reversing this ((2 * index ) + 1 + (1 if index > 4)) % 8
    const cheat = [1, 1, -2, 2, -1, 3, 0, 4];
    const rotateBy = cheat[index];
    return rotate(password, rotateBy > 0 ? "left" : "right", Math.abs(rotateBy));
};
const rotateRight = (password, [rotateBy]) => {
    return rotate(password, "right", +rotateBy);
};
const rotateLeft = (password, [rotateBy]) => {
    return rotate(password, "left", +rotateBy);
};
const reversePositions = (password, [from, to]) => {
    let counter = 0;
    from = +from;
    to = +to;
    while (counter < Math.ceil((to - from) / 2)) {
        const temp = password[from + counter];
        password[from + counter] = password[to - counter];
        password[to - counter] = temp;
        counter += 1;
    }
    return password;
};
const movePosition = (password, [from, to]) => {
    from = +from;
    to = +to;
    const result = password.reduce((acc, c, index) => {
        if (acc.length === to) {
            acc.push(password[from]);
        }
        if (index !== from) {
            acc.push(c);
        }
        return acc;
    }, []);
    if (result.length < password.length) {
        result.push(password[from]);
    }
    return result;
};
const undoMovePosition = (password, [from, to]) => movePosition(password, [to, from]);
const commands = {
  "swap position" : swapPosition,
  "swap letter" : swapLetter,
  "rotate based" : rotateBasedOnLetter,
  "rotate right" : rotateRight,
  "reverse positions" : reversePositions,
  "rotate left" : rotateLeft,
  "move position" : movePosition
};
const undoCommands = {
  "swap position" : swapPosition,
  "swap letter" : swapLetter,
  "rotate based" : undoRotateBasedOnLetter,
  "rotate right" : rotateLeft,
  "reverse positions" : reversePositions,
  "rotate left" : rotateRight,
  "move position" : undoMovePosition
};
const parseInstructions = (input) => input.split("\n")
                                          .map(l => l.match(regex).filter(m => m))
                                          .map(([_, cmd, ...rest]) => [cmd, rest]);
const sampleInstructions = parseInstructions(inputSets.ip2101);
const instructions = parseInstructions(inputSets.ip2102);
const undoInstructions = instructions.concat([]).reverse();
const process = (ins, p, cmds) => ins.reduce((accP, [cmd, params]) => cmds[cmd](accP, params), p.split("")).join("");
assert(process(sampleInstructions, "abcde", commands), "decab", "Day 21 - Set 1, Test Input");
assert(process(instructions, "abcdefgh", commands), "gbhcefad", "Day 21 - Set 1, Main Input");
assert(process(undoInstructions, "gbhcefad", undoCommands), "abcdefgh", "Day 21 - Set 2, Test");
assert(process(undoInstructions, "fbgdceah", undoCommands), "gahedfcb", "Day 21 - Set 2, Main Input");
