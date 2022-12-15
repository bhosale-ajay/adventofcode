import { matchesToArray } from 'dotless';
import { mapLine } from './util';

type Location = [number, number];
type SensorInfo = [Location, Location, number];
const distance = ([ax, ay]: Location, [bx, by]: Location) =>
    Math.abs(ax - bx) + Math.abs(ay - by);
const exp = /-?\d+/g;
const toSensorInfo = (ns: number[]): SensorInfo => {
    const sl = [ns[0], ns[1]] as Location;
    const bl = [ns[2], ns[3]] as Location;
    return [sl, bl, distance(sl, bl)];
};
const parseLine = (l: string) =>
    toSensorInfo(matchesToArray(l, exp, m => +m[0]));
const parse = (fn: string) => mapLine(fn, parseLine);
const closerToRow =
    (row: number) =>
    ([[, sy], , d]: SensorInfo) =>
        Math.abs(row - sy) < d;
const coverageAtRow =
    (row: number) =>
    ([[sx, sy], , d]: SensorInfo) => {
        const r = Math.abs(d - Math.abs(row - sy));
        return [sx - r, sx + r];
    };
const maxCoverageAtRow =
    (max: number, row: number) =>
    ([[sx, sy], , d]: SensorInfo) => {
        const r = Math.abs(d - Math.abs(row - sy));
        return [Math.max(0, sx - r), Math.min(max, sx + r)];
    };

// Based on https://stackoverflow.com/a/26391774/655085
const merge = (ranges: number[][]) =>
    ranges
        .sort((a, b) => a[0] - b[0] || a[1] - b[1])
        .reduce((r, a) => {
            if (r.length > 0) {
                const last = r[r.length - 1];
                if (a[0] <= last[1] + 1) {
                    if (last[1] < a[1]) {
                        last[1] = a[1];
                    }
                    return r;
                }
            }
            r.push(a);
            return r;
        }, [] as number[][]);

const sumRanges = (acc: number, [s, e]: number[]) => acc + Math.abs(e + 1 - s);
const beaconsAtRow =
    (row: number) =>
    ([, [, by]]: SensorInfo) =>
        by === row;
const takeBeaconX = ([, [bx]]: SensorInfo) => bx;
const countUniqueX = (xs: number[]) => new Set(xs).size;
const solveP1 = (data: SensorInfo[], row: number) => {
    const sensorsCoveringRow = data.filter(closerToRow(row));
    const coverage = sensorsCoveringRow.map(coverageAtRow(row));
    const merged = merge(coverage);
    const notCovered = merged.reduce(sumRanges, 0);
    const beaconCount = countUniqueX(
        data.filter(beaconsAtRow(row)).map(takeBeaconX)
    );
    return notCovered - beaconCount;
};
const solveP2 = (data: SensorInfo[], max: number) => {
    let x = max + 1;
    let y = -1;
    while (x-- > 0) {
        const sensorsCoveringRow = data.filter(closerToRow(x));
        const coverage = sensorsCoveringRow.map(maxCoverageAtRow(max, x));
        const merged = merge(coverage);
        if (merged.length > 1) {
            y = merged[0][1];
            break;
        }
    }
    return (y + 1) * 4000000 + x;
};

test('15', () => {
    const td = parse('15-test');
    const ad = parse('15');
    expect(solveP1(td, 10)).toEqual(26);
    expect(solveP1(ad, 2000000)).toEqual(5832528);
    expect(solveP2(td, 20)).toEqual(56000011);
    expect(solveP2(ad, 4000000)).toEqual(13360899249595);
});
