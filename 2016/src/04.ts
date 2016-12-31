import * as inputSets from "./04-input";
import { ascendingBy, descendingBy, mapObjectPropertiesToArray, query, reduce, sortBy, take, toArray, where } from "./linq";
import { assert, matches } from "./util";

const regex = /([a-z\-]+)(\d+)\[([a-z]+)/g;
const parseResult = m => [m[1].replace(/\-/g, ""), +(m[2]), m[3]];
const recordCharacter = (summary, char) => { summary[char] = (summary[char] | 0) + 1; return summary; };
const computeChecksum = (name) => query([
                    name.split(""),
                    reduce(recordCharacter, {}),
                    mapObjectPropertiesToArray((count, char) => ({count, char})),
                    sortBy([descendingBy("count"), ascendingBy("char")]),
                    take(5),
                    reduce((acc, charSummary) => acc + charSummary.char, "")
                ]);
const validChecksum = ([name, , checksum]) => checksum === computeChecksum(name);
const sumSectorIds = (acc, [, sectorId, ]) => acc + sectorId;
const computeSumOfSectorIds = (input) => query([
                matches(input, regex, parseResult),
                where(validChecksum),
                reduce(sumSectorIds, 0)]);
// Part 2
const z = "z".charCodeAt(0);
const decryptChar = (char, salt) => {
    const decryptedCharCode = char.charCodeAt(0) + salt;
    return String.fromCharCode(decryptedCharCode > z ?
                    decryptedCharCode - 26 :
                    decryptedCharCode);
};
const decryptName = (name, sectorId) => name.split("").map(char => decryptChar(char, sectorId % 26)).join("");
const findNorthPoleObjectStorageRoom = (input) => query([
                matches(input, regex, parseResult),
                where(([name, sectorId]) => decryptName(name, sectorId) === "northpoleobjectstorage"),
                take(1),
                toArray,
                ip => ip[0][1]
            ]);
assert(computeSumOfSectorIds(inputSets.ip0401), 1514, "Day 4 - Set 1, Sample input");
assert(computeSumOfSectorIds(inputSets.ip0402), 409147, "Day 4 - Set 1, Actual input");
assert(findNorthPoleObjectStorageRoom(inputSets.ip0402), 991, "Day 4 - Set 2");
