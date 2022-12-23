import { matchesToArray } from 'dotless';
import { getLines } from './util';

const exp = /(\d+)(R|L)?/g;
type Direction = 'L' | 'R';
type Facing = '^' | '<' | '>' | 'v';
type Path = [number, Direction];
type Axis = 0 | 1;
type Road = {
    axis: Axis;
    crossAxis: Axis;
    startAt: number;
    endAt: number;
    line: string;
};
type Side = [rs: number, vs: number];
const navigator: any = [
    {
        '1': { L: -1, R: 1 },
        '-1': { L: 1, R: -1 },
    },
    {
        '1': { L: 1, R: -1 },
        '-1': { L: -1, R: 1 },
    },
];
const facingValueByDirAndChange: any = [
    {
        '1': ['>', 0],
        '-1': ['<', 2],
    },
    {
        '1': ['v', 1],
        '-1': ['^', 3],
    },
];
const directionFacingMap: any = {
    '^': { L: '<', R: '>' },
    '<': { L: 'v', R: '^' },
    '>': { L: '^', R: 'v' },
    v: { L: '>', R: '<' },
};
const facingValue: any = {
    '^': 3,
    '<': 2,
    '>': 0,
    v: 1,
};
const matchToPath = (m: RegExpExecArray) => [+m[1], m[2]] as Path;
const lineToRoad = (axis: Axis, line: string): Road => {
    const length = line.length;
    line = line.trimStart();
    const startAt = length - line.length;
    line = line.trimEnd();
    const endAt = startAt + line.length - 1;
    const crossAxis = axis === 0 ? 1 : 0;
    return { axis, startAt, endAt, line, crossAxis };
};
const deltaMap: any = {
    '^': [-1, 0],
    '<': [0, -1],
    '>': [0, 1],
    v: [1, 0],
};
const changeSideT = (
    maxI: number,
    s: number,
    f: Facing,
    [cr, cc]: [number, number]
): any => {
    if (s === 0 && f === '^') return [1, 'v', [0, maxI - cc]];
    if (s === 0 && f === '<') return [2, 'v', [0, cr]];
    if (s === 0 && f === '>') return [5, '<', [maxI - cr, maxI]];
    if (s === 0 && f === 'v') return [3, 'v', [0, cc]];

    if (s === 1 && f === '^') return [0, 'v', [0, maxI - cr]];
    if (s === 1 && f === '<') return [5, '^', [maxI, maxI - cr]];
    if (s === 1 && f === '>') return [2, '>', [cr, 0]];
    if (s === 1 && f === 'v') return [4, '^', [maxI, maxI - cc]];

    if (s === 2 && f === '^') return [0, '>', [cc, 0]];
    if (s === 2 && f === '<') return [1, '<', [cr, maxI]];
    if (s === 2 && f === '>') return [3, '>', [cr, 0]];
    if (s === 2 && f === 'v') return [4, '>', [maxI - cc, 0]];

    if (s === 3 && f === '^') return [0, '^', [maxI, cc]];
    if (s === 3 && f === '<') return [2, '<', [cr, maxI]];
    if (s === 3 && f === '>') return [5, 'v', [0, maxI - cr]];
    if (s === 3 && f === 'v') return [4, 'v', [0, cc]];

    if (s === 4 && f === '^') return [3, '^', [maxI, cc]];
    if (s === 4 && f === '<') return [2, '^', [maxI, maxI - cr]];
    if (s === 4 && f === '>') return [5, '>', [cr, 0]];
    if (s === 4 && f === 'v') return [1, '^', [maxI, maxI - cc]];

    if (s === 5 && f === '^') return [3, '<', [maxI - cc, maxI]];
    if (s === 5 && f === '<') return [4, '<', [cr, maxI]];
    if (s === 5 && f === '>') return [0, '<', [maxI - cr, maxI]];
    if (s === 5 && f === 'v') return [1, '>', [maxI - cc, 0]];
};
const changeSideA = (
    maxI: number,
    s: number,
    f: Facing,
    [cr, cc]: [number, number]
): any => {
    if (s === 0 && f === '^') return [5, '>', [cc, 0]];
    if (s === 0 && f === '<') return [3, '>', [maxI - cr, 0]];
    if (s === 0 && f === '>') return [1, '>', [cr, 0]];
    if (s === 0 && f === 'v') return [2, 'v', [0, cc]];

    if (s === 1 && f === '^') return [5, '^', [maxI, cc]];
    if (s === 1 && f === '<') return [0, '<', [cr, maxI]];
    if (s === 1 && f === '>') return [4, '<', [maxI - cr, maxI]];
    if (s === 1 && f === 'v') return [2, '<', [cc, maxI]];

    if (s === 2 && f === '^') return [0, '^', [maxI, cc]];
    if (s === 2 && f === '<') return [3, 'v', [0, cr]];
    if (s === 2 && f === '>') return [1, '^', [maxI, cr]];
    if (s === 2 && f === 'v') return [4, 'v', [0, cc]];

    if (s === 3 && f === '^') return [2, '>', [cc, 0]];
    if (s === 3 && f === '<') return [0, '>', [maxI - cr, 0]];
    if (s === 3 && f === '>') return [4, '>', [cr, 0]];
    if (s === 3 && f === 'v') return [5, 'v', [0, cc]];

    if (s === 4 && f === '^') return [2, '^', [maxI, cc]];
    if (s === 4 && f === '<') return [3, '<', [cr, maxI]];
    if (s === 4 && f === '>') return [1, '<', [maxI - cr, maxI]];
    if (s === 4 && f === 'v') return [5, '<', [cc, maxI]];

    if (s === 5 && f === '^') return [3, '^', [maxI, cc]];
    if (s === 5 && f === '<') return [0, 'v', [0, cr]];
    if (s === 5 && f === '>') return [4, '^', [maxI, cr]];
    if (s === 5 && f === 'v') return [1, 'v', [0, cc]];
};
const createSide = ([sh, sv]: number[], sl: number): Side => [sh * sl, sv * sl];
const sidesT = [
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3],
].map(p => createSide(p, 4));
const sidesA = [
    [0, 1],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 1],
    [3, 0],
].map(p => createSide(p, 50));
const solve = (
    fn: string,
    sides = sidesT,
    sl = 4,
    changeSide = changeSideT
) => {
    const lines = getLines(fn);
    const paths = matchesToArray(lines.pop() as string, exp, matchToPath);
    const lineLength = lines.reduce((m, l) => Math.max(m, l.length), 0);
    const verticalLines = Array(lineLength).fill('');
    const horizontalRoads: Road[] = [];
    for (let li = 0; li < lines.length - 1; li++) {
        const line = lines[li].padEnd(lineLength);
        for (let i = 0; i < line.length; i++) {
            verticalLines[i] = verticalLines[i] + line[i];
        }
        horizontalRoads.push(lineToRoad(0, line));
    }
    const verticalRoads = verticalLines.map(l => lineToRoad(1, l));
    const maxI = sl - 1;
    let road = horizontalRoads[0];
    const point1 = [0, road.startAt];
    let change = 1;
    let ct = 0;
    let csi = 0;
    let cf: Facing = '>';
    let point2 = [0, 0];

    for (const [steps, direction] of paths) {
        for (let s = 0; s < steps; s++) {
            ct = point1[road.crossAxis];
            if (change === 1 && road.endAt === ct) {
                ct = road.startAt;
            } else if (change === -1 && road.startAt === ct) {
                ct = road.endAt;
            } else {
                ct = ct + change;
            }
            if (road.line[ct - road.startAt] === '#') {
                break;
            }
            point1[road.crossAxis] = ct;
        }
        for (let s = 0; s < steps; s++) {
            let tsi = csi;
            let tf: Facing = cf;
            const [rd, cd] = deltaMap[cf];
            let [tr, tc] = [point2[0], point2[1]];
            if (
                (rd === 1 && tr === maxI) ||
                (cd === 1 && tc === maxI) ||
                (rd === -1 && tr === 0) ||
                (cd === -1 && tc === 0)
            ) {
                [tsi, tf, [tr, tc]] = changeSide(maxI, tsi, tf, [tr, tc]);
            } else {
                tr = tr + rd;
                tc = tc + cd;
            }
            const [uhs, uvs] = sides[tsi];
            if (lines[uhs + tr][uvs + tc] === '#') {
                break;
            } else {
                point2 = [tr, tc];
                cf = tf;
                csi = tsi;
            }
        }

        if (direction) {
            // p1
            change = navigator[road.axis][change.toString() as any][direction];
            if (road.axis === 0) {
                road = verticalRoads[point1[road.crossAxis]];
            } else {
                road = horizontalRoads[point1[road.crossAxis]];
            }
            // p2
            cf = directionFacingMap[cf][direction];
        }
    }
    const p1 =
        (point1[0] + 1) * 1000 +
        (point1[1] + 1) * 4 +
        facingValueByDirAndChange[road.axis][change][1];
    const [uhs, uvs] = sides[csi];
    const p2 =
        (point2[0] + uhs + 1) * 1000 +
        (point2[1] + uvs + 1) * 4 +
        facingValue[cf];
    return [p1, p2];
};

test('22', () => {
    expect(solve('22-test')).toEqual([6032, 5031]);
    expect(solve('22', sidesA, 50, changeSideA)).toEqual([57350, 104385]);
});
