import { ascendingBy, matchesToArray, query, reduce, sort } from "dotless";
import { Dictionary, getInput, getValue } from "./util";

interface LogEntry {
    timeStamp: string;
    min: number;
    action: string;
    guard: string;
}
interface GuardLog {
    total: number;
    mostSleptMin: number;
    sleepLog: Dictionary<number>;
}
interface LogProcessData {
    lastGuard: string;
    fallAt: number;
    lazyGuard: string | null;
    logs: Dictionary<GuardLog>;
}
const regex = /\[(\d+-\d+-\d+\s\d+:(\d+))]\s(falls|wakes|Guard #(\d+))/gm;
const parseLine = (m: RegExpExecArray): LogEntry => ({timeStamp: m[1], min: +m[2], action: m[3], guard: m[4]});
const prepareLogs = ({lastGuard, fallAt, lazyGuard, logs}: LogProcessData,
                     {min, action, guard}: LogEntry): LogProcessData => {
    if (action === "falls") {
        return {lastGuard, fallAt: min, lazyGuard, logs};
    } else if (action === "wakes") {
        const guardLogs = getValue<GuardLog>(logs, lastGuard, { total : 0, mostSleptMin : 0, sleepLog: {} });
        guardLogs.total = guardLogs.total + min - fallAt;
        for (let time = fallAt; time < min; time++) {
            guardLogs.sleepLog[time] = (guardLogs.sleepLog[time] | 0) + 1;
            if (guardLogs.sleepLog[time] > (guardLogs.sleepLog[guardLogs.mostSleptMin] | 0)) {
                guardLogs.mostSleptMin = time;
            }
        }
        if (lazyGuard === null) {
            lazyGuard = lastGuard;
        } else if (logs[lazyGuard].total < guardLogs.total) {
            lazyGuard = lastGuard;
        }
        return {lastGuard, fallAt, lazyGuard, logs};
    } else {
        return {lastGuard: guard, fallAt , lazyGuard, logs};
    }
};

const findResponseRecord = (s: string) => {
    const { lazyGuard, logs } = query(
        matchesToArray(s, regex, parseLine),
        sort(ascendingBy(x => x.timeStamp)),
        reduce(prepareLogs, { lastGuard : "", fallAt : 0, lazyGuard : null, logs: {} }),
    );
    let [mostSleptMin, mostSlept, mostSleptGuard] = [0, 0, ""];
    Object.keys(logs).forEach(guard => {
        const guardMostSleptMin = logs[guard].mostSleptMin;
        const guardMostSlept = logs[guard].sleepLog[guardMostSleptMin];
        if (guardMostSlept > mostSlept) {
            mostSlept = guardMostSlept;
            mostSleptMin = guardMostSleptMin;
            mostSleptGuard = guard;
        }
    });
    return [
        lazyGuard !== null ? +lazyGuard * logs[lazyGuard].mostSleptMin : 0,
        +mostSleptMin * +mostSleptGuard
    ];
};

test("04", () => {
    expect(findResponseRecord(getInput("04-test"))).toEqual([240, 4455]);
    expect(findResponseRecord(getInput("04"))).toEqual([138280, 89347]);
});
