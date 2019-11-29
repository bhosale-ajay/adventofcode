import { ascendingBy, countBy, matchesToArray, query, reduce, sort } from "dotless";
import { Dictionary, getInput, getValue } from "./util";

interface LogEntry {
    timeStamp: string;
    min: number;
    action: string;
    guard: string;
}
interface LogProcessData {
    lastGuard: string;
    fallAt: number;
    logs: Dictionary<number[]>;
}
const regex = /\[(\d+-\d+-\d+\s\d+:(\d+))]\s(falls|wakes|Guard #(\d+))/gm;
const parseLine = (m: RegExpExecArray): LogEntry => ({timeStamp: m[1], min: +m[2], action: m[3], guard: m[4]});
const prepareLogs = ({lastGuard, fallAt, logs}: LogProcessData, {min, action, guard}: LogEntry) => {
    if (action === "falls") {
        return {lastGuard, fallAt: min, logs};
    } else if (action === "wakes") {
        const guardLogs = getValue<number[]>(logs, lastGuard, []);
        for (let time = fallAt; time < min; time++) {
            guardLogs.push(time);
        }
        return {lastGuard, fallAt, logs};
    } else {
        return {lastGuard: guard, fallAt , logs};
    }
};
const sleepSummary = (sleepRecords: number[]) => query(
    sleepRecords,
    countBy(),
    cs => Object.keys(cs).reduce(([m, sd], k) => cs[k] > sd ? [k, cs[k]] : [m, sd], ([0, 0])),
);
const findMax = (r: [number[]], f: number) => query(
    r.reduce((acc, gr) => gr[f] > acc[f] ? gr : acc),
    g => g[0] * g[2]
);
const findResponseRecord = (s: string) => query(
    matchesToArray(s, regex, parseLine),
    sort(ascendingBy("timeStamp")),
    reduce(prepareLogs, { lastGuard : "", fallAt : 0, logs: ({} as Dictionary<number[]>) }),
    ({ logs }) => Object.keys(logs).map(g => ([+g, logs[g].length, ...sleepSummary(logs[g])])) as [number[]],
    r => [findMax(r, 1), findMax(r, 3)]
);
test("04", () => {
    expect(findResponseRecord(getInput("04-test"))).toEqual([240, 4455]);
    expect(findResponseRecord(getInput("04"))).toEqual([138280, 89347]);
});
