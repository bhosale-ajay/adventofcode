import * as inputSets from "./03-input";
import { assert, matches } from "./util";

const parseInput = (input) => {
    const result = [];
    const regex = /\s+(\d+)\s+(\d+)\s+(\d+)/g;
    for (const m of matches(input, regex)) {
        result.push([+(m[1]), +(m[2]), +(m[3])]);
    }
    return result;
};

const parseColsAsRows = (input) => {
    const regex = /\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/g;
    const result = [];
    for (const m of matches(input, regex)) {
        result.push([+(m[1]), +(m[4]), +(m[7])]);
        result.push([+(m[2]), +(m[5]), +(m[8])]);
        result.push([+(m[3]), +(m[6]), +(m[9])]);
    }
    return result;
};

const convertColumnsToRows = (input) => {
    const result = [];
    let rowCounter = 0;
    let currentColumnIndex = 0;

    for (const eachRow of parseInput(input)) {
        if (currentColumnIndex === 0) {
            // too lazy to write a loop
            result[rowCounter + 0] = [];
            result[rowCounter + 1] = [];
            result[rowCounter + 2] = [];
        }
        // too lazy to write a loop
        result[rowCounter + 0 - currentColumnIndex][currentColumnIndex] = eachRow[0];
        result[rowCounter + 1 - currentColumnIndex][currentColumnIndex] = eachRow[1];
        result[rowCounter + 2 - currentColumnIndex][currentColumnIndex] = eachRow[2];
        rowCounter = rowCounter + 1;
        currentColumnIndex = (currentColumnIndex + 1) % 3;
    }
    return result;
};

const isValidTriangle = ([a, b, c]) => {
    const sumOfAllSides = a + b + c;
    const longestSide = Math.max(Math.max(a, b), c);
    return sumOfAllSides - longestSide > longestSide;
};

const countValidTriangles = (input, createTriangles: any = parseInput) => {
    return createTriangles(input).filter(isValidTriangle).length;
};

assert(countValidTriangles(inputSets.ip0301), 869, "Day 3 - Set 1");
// option 1
assert(countValidTriangles(inputSets.ip0301, parseColsAsRows), 1544, "Day 3 - Set 2, Approach 1");
// option 2
assert(countValidTriangles(inputSets.ip0301, convertColumnsToRows), 1544, "Day 3 - Set 2, Approach 2");
