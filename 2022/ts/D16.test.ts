import { matchesToArray } from 'dotless';
import { mapLine } from './util';

type Valve = {
    flowRate: number;
    leadsTo: string[];
};
type Dictionary<T> = {
    [key: string]: T;
};
type ValveMap = Dictionary<Valve>;
type DistanceMap = Dictionary<number>;
type TimeMap = Dictionary<DistanceMap>;
const exp = /(-?\d+)|([A-Z]{2})/g;
const buildValve = (m: ValveMap, tokens: string[]): ValveMap => {
    const valveName = tokens.shift() as string;
    const flowRate = +(tokens.shift() as string);
    const leadsTo = tokens;
    m[valveName] = { flowRate, leadsTo };
    return m;
};
const parseLine = (l: string) => matchesToArray(l, exp, m => m[0]);
const parse = (fn: string) =>
    mapLine(fn, parseLine).reduce(buildValve, {} as ValveMap);
const buildTimeMap = (m: ValveMap): [TimeMap, string[]] => {
    const timeMap: TimeMap = {};
    const keyValves = Object.keys(m).filter(vn => m[vn].flowRate > 0);
    keyValves.push('AA');
    for (const vn of Object.keys(m)) {
        if (!keyValves.includes(vn)) {
            continue;
        }
        const queue = [vn];
        const distMap: DistanceMap = { [vn]: 0 };
        const visited = new Set<string>().add(vn);
        while (queue.length > 0) {
            const cv = queue.shift() as string;
            for (const nv of m[cv].leadsTo) {
                if (!visited.has(nv)) {
                    visited.add(nv);
                    distMap[nv] = distMap[cv] + 1;
                    queue.push(nv);
                }
            }
        }
        timeMap[vn] = distMap;
    }
    // sorting is key here, otherwise `extendBestFlowMap` has to sort each time
    return [timeMap, keyValves.filter(k => k !== 'AA').sort()];
};
const solve = (fn: string) => {
    const valveMap = parse(fn);
    const [timeMap, valvesWF] = buildTimeMap(valveMap);
    const openValve = (cv: string, time: number, next: string[]) => {
        next = next.filter(n => n !== cv);
        let bestFlow = 0;
        for (const nv of next) {
            const timeLeft = time - timeMap[cv][nv] - 1;
            if (timeLeft > 0) {
                const flow =
                    valveMap[nv].flowRate * timeLeft +
                    openValve(nv, timeLeft, next);
                bestFlow = Math.max(flow, bestFlow);
            }
        }
        return bestFlow;
    };
    const p1 = openValve('AA', 30, valvesWF);
    // part 2 based on solution from User @i_have_no_biscuits
    const bestFlowMap: Dictionary<number> = {};
    const recordPath = (
        cv: string,
        time: number,
        path: string[],
        pathFlow: number
    ) => {
        const next = valvesWF.filter(kv => !path.includes(kv));
        for (const nv of next) {
            const timeLeft = time - timeMap[cv][nv] - 1;
            if (timeLeft > 0) {
                const flow = valveMap[nv].flowRate * timeLeft;
                recordPath(nv, timeLeft, [...path, nv], flow + pathFlow);
            }
        }
        const pathKey = path.sort().join('');
        bestFlowMap[pathKey] = Math.max(bestFlowMap[pathKey] || 0, pathFlow);
    };
    recordPath('AA', 26, [], 0);
    const extendBestFlowMap = (options: string[]) => {
        const pathKey = options.join('');
        if (bestFlowMap[pathKey] === undefined) {
            let bestFlow = 0;
            for (const option of options) {
                const remaining = options.filter(o => o !== option);
                bestFlow = Math.max(extendBestFlowMap(remaining), bestFlow);
            }
            bestFlowMap[pathKey] = bestFlow;
        }
        return bestFlowMap[pathKey];
    };

    extendBestFlowMap(valvesWF);
    let p2 = 0;
    for (const humanWork of Object.keys(bestFlowMap)) {
        const elephantWork = valvesWF.reduce(
            (k, v) => (humanWork.includes(v) ? k : k + v),
            ''
        );
        p2 = Math.max(p2, bestFlowMap[humanWork] + bestFlowMap[elephantWork]);
    }
    return [p1, p2];
};

test('16', () => {
    expect(solve('16-test')).toEqual([1651, 1707]);
    expect(solve('16')).toEqual([1871, 2416]);
});
