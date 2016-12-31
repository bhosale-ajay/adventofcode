import * as inputSets from "./07-input";
import { any, count, map, query, toArray, where } from "./linq";
import { assert, breakInChunks, flattenArrayOfArray, matchesToArray } from "./util";

const splitOuterAndInner = (acc, part, index) => { acc[index % 2].push(part); return acc; };
const ipAddresses = inputSets.ip0701.split("\n")
                            .map(line => matchesToArray(line, /([a-z]+)+/g, m => m[0]))
                            .map(line => line.reduce(splitOuterAndInner, [[], []]));
const isABBA = a => ((a[0] === a[3]) && (a[1] === a[2]) && (a[0] !== a[1]));
const containsABBA = part => query([breakInChunks(part, 4), any(isABBA)]);
const outsiderHasABBAButInsiderDont = ([o, i]) => o.some(containsABBA) && !i.some(containsABBA);
const countOfTLSSupporters = query([ipAddresses, where(outsiderHasABBAButInsiderDont), count]);
const isABA = a => (a[0] === a[2]) && (a[0] !== a[1]);
const breakPartInABA = p => query([breakInChunks(p, 3), where(isABA), toArray]);
const findABA = parts => query([parts, map(breakPartInABA), toArray, flattenArrayOfArray]);
const mapAddressToABA = ([o, i]) => ([findABA(o), findABA(i)]);
const isABAMatching = (a, b) => (a[0] === b[1] && a[1] === b[0]);
const containsMatchingABA = ([oABAs, iABAs]) => oABAs.some(o => iABAs.some(i => isABAMatching(o, i)));
const countOfSLASupporters = query([ipAddresses, map(mapAddressToABA), where(containsMatchingABA), count]);
assert(countOfTLSSupporters, 105, "Day 7 - Set 1");
assert(countOfSLASupporters, 258, "Day 7 - Set 2");
