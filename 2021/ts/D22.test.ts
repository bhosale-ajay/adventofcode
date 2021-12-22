import { matchesToArray } from 'dotless';
import { mapLine } from './util';

type Grid = Set<string>;
type Step = [boolean, number, number, number, number, number, number];

const on = (grid: Grid, location: string) => grid.add(location);

const off = (grid: Grid, location: string) => grid.delete(location);

const lineToStep = (l: string) =>
    [
        l[1] === 'n' ? true : false,
        ...matchesToArray(l, /-?\d+/gm).map(Number),
    ] as Step;

const parse = (fn: string) => mapLine(fn, lineToStep);

const initialize = (steps: Step[]) => {
    const grid = new Set<string>();
    for (const [action, xf, xt, yf, yt, zf, zt] of steps) {
        for (let x = Math.max(xf, -50); x <= Math.min(xt, 50); x++) {
            for (let y = Math.max(yf, -50); y <= Math.min(yt, 50); y++) {
                for (let z = Math.max(zf, -50); z <= Math.min(zt, 50); z++) {
                    const location = `${x}:${y}:${z}`;
                    (action ? on : off)(grid, location);
                }
            }
        }
    }
    return grid.size;
};

type Range = [from: number, to: number];
const rangeSize = ([f, t]: Range) => t - f + 1;
const isIntersecting = ([af, at]: Range, [bf, bt]: Range): boolean =>
    af <= bt && bf <= at;
const mergerRange = ([af, at]: Range, [bf, bt]: Range) =>
    [Math.max(af, bf), Math.min(at, bt)] as Range;

class Cube {
    private xRange: Range;
    private yRange: Range;
    private zRange: Range;

    constructor(xRange: Range, yRange: Range, zRange: Range) {
        this.xRange = xRange;
        this.yRange = yRange;
        this.zRange = zRange;
    }

    isOverlapping = (other: Cube) =>
        isIntersecting(this.xRange, other.xRange) &&
        isIntersecting(this.yRange, other.yRange) &&
        isIntersecting(this.zRange, other.zRange);

    getOverlap = (other: Cube) =>
        new Cube(
            mergerRange(this.xRange, other.xRange),
            mergerRange(this.yRange, other.yRange),
            mergerRange(this.zRange, other.zRange)
        );

    volume = () =>
        rangeSize(this.xRange) *
        rangeSize(this.yRange) *
        rangeSize(this.zRange);
}

const reboot = (steps: Step[]) => {
    const onCubes: Cube[] = [];
    const allOverLapping: Cube[] = [];
    for (const [action, xf, xt, yf, yt, zf, zt] of steps) {
        const cube = new Cube([xf, xt], [yf, yt], [zf, zt]);
        const overlaps: Cube[] = [];
        const parts: Cube[] = [];
        for (const onc of onCubes)
            if (cube.isOverlapping(onc)) overlaps.push(cube.getOverlap(onc));
        for (const olc of allOverLapping)
            if (cube.isOverlapping(olc)) parts.push(cube.getOverlap(olc));
        onCubes.push(...parts);
        allOverLapping.push(...overlaps);
        if (action) onCubes.push(cube);
    }
    let onCount = BigInt(0);
    for (const c of onCubes) onCount = onCount + BigInt(c.volume());
    for (const c of allOverLapping) onCount = onCount - BigInt(c.volume());
    return onCount;
};

test('22', () => {
    const t0 = parse('22-test-01');
    const t1 = parse('22-test-02');
    const ai = parse('22');
    const t2 = parse('22-test-03');
    expect(initialize(t0)).toEqual(39);
    expect(initialize(t1)).toEqual(590784);
    expect(initialize(ai)).toEqual(551693);
    expect(reboot(t2)).toEqual(BigInt(2758514936282235));
    expect(reboot(ai)).toEqual(BigInt(1165737675582132));
});
