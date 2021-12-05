import { matchesToArray } from 'dotless';
import { getInput } from './util';

type Line = [x1: number, y1: number, x2: number, y2: number];
type Diagram = Map<string, [horizontalAndVertical: number, diagonal: number]>;
const lineRegEx = /(\d+),(\d+) -> (\d+),(\d+)/gm;
const parseLine = (m: RegExpExecArray): Line => [+m[1], +m[2], +m[3], +m[4]];
const getLines = (ip: string) =>
    matchesToArray(getInput(ip), lineRegEx).map(parseLine);

const plotPoints = (d: Diagram, [x1, y1, x2, y2]: Line) => {
    const lineType = x1 == x2 || y1 == y2 ? 0 : 1;
    const xs = x1 < x2 ? 1 : -1;
    const ys = y1 < y2 ? 1 : -1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const p = `${x1}:${y1}`;
        const counts = d.get(p) || [0, 0];
        counts[lineType] = counts[lineType] + 1;
        d.set(p, counts);
        if (x1 === x2 && y1 === y2) {
            break;
        }
        x1 = x1 === x2 ? x1 : x1 + xs;
        y1 = y1 === y2 ? y1 : y1 + ys;
    }
    return d;
};

const solve = (ip: string) => {
    const emptyDiagram = new Map<string, [number, number]>();
    const diagram = getLines(ip).reduce(plotPoints, emptyDiagram);
    let [p1, p2] = [0, 0];
    for (const [hnv, di] of diagram.values()) {
        if (hnv > 1) {
            p1 = p1 + 1;
        }
        if (di + hnv > 1) {
            p2 = p2 + 1;
        }
    }
    return [p1, p2];
};

test('05', () => {
    expect(solve('05-test')).toEqual([5, 12]);
    expect(solve('05')).toEqual([5576, 18144]);
});
