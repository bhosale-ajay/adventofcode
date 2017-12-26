import * as inputSets from "./04-input";
import { any, findPairs, query } from "./linq";
import { assert } from "./util";

const parseInput = input => input.split("\n").map(line => line.split(" "));
const duplicate = (a, b) => a === b;
const anagram = (a, b) => a.split("").sort().join("") === b.split("").sort().join("");
const apartFrom = predicate => pharse => query([pharse, findPairs(predicate), any()]) === false;
const findValidPassphrases = (input, predicate) => parseInput(input).filter(apartFrom(predicate)).length;

assert(findValidPassphrases(inputSets.ip0401, duplicate),   2, "04.1, Test 01");
assert(findValidPassphrases(inputSets.ip0402, duplicate), 383, "04.1");
assert(findValidPassphrases(inputSets.ip0403, anagram),     3, "04.2, Test 01");
assert(findValidPassphrases(inputSets.ip0402, anagram),   265, "04.2");
