import { mapLine } from './util';

type Lines = [number, number][][];
const buildNorthSouthLines = (rc: number, cc: number): Lines => {
    const result: [number, number][][] = [];
    for (let c = 0; c < cc; c++) {
        const section: [number, number][] = [];
        for (let r = 0; r < rc; r++) {
            section.push([r, c]);
        }
        result.push(section);
    }
    return result;
};

const buildEastWestLines = (rc: number, cc: number): Lines => {
    const result: [number, number][][] = [];
    for (let r = 0; r < rc; r++) {
        const section: [number, number][] = [];
        for (let c = 0; c < cc; c++) {
            section.push([r, c]);
        }
        result.push(section);
    }
    return result;
};

const tilt = (platform: string[][], lines: Lines, direction: boolean) => {
    for (const line of lines) {
        const splits: any[] = [];
        let space = 0;
        let rocks = 0;
        for (const [r, c] of line) {
            if (platform[r][c] === '.') {
                space = space + 1;
            }
            if (platform[r][c] === 'O') {
                rocks = rocks + 1;
            }
            if (platform[r][c] === '#') {
                splits.push([space, '.', rocks, 'O']);
                space = 0;
                rocks = 0;
            }
        }
        if (space !== 0 || rocks !== 0) {
            splits.push([space, '.', rocks, 'O']);
        }
        let counter = 0;
        for (const split of splits) {
            (direction ? [2, 0] : [0, 2]).forEach((t: number) => {
                for (let i = 0; i < split[t]; i++) {
                    const [r, c] = line[counter];
                    platform[r][c] = split[t + 1];
                    counter = counter + 1;
                }
            });
            // Skip the #
            counter = counter + 1;
        }
    }
};

const cycle = (platform: string[][], ew: Lines, ns: Lines) => {
    tilt(platform, ns, true);
    tilt(platform, ew, true);
    tilt(platform, ns, false);
    tilt(platform, ew, false);
};

const calculateLoad = (platform: string[][], lines: Lines) => {
    let load = 0;
    for (const line of lines) {
        const ll = line.length;
        for (const [r, c] of line) {
            if (platform[r][c] === 'O') {
                load = load + (ll - r);
            }
        }
    }
    return load;
};

const solve = (fn: string) => {
    const platform = mapLine(fn, l => l.split(''));
    const ew = buildEastWestLines(platform.length, platform[0].length);
    const ns = buildNorthSouthLines(platform.length, platform[0].length);
    const totalCycles = 1000000000;
    const seen: any = {};
    const loads: number[] = [];
    let seenAt: number | undefined = undefined;
    let cycleIndex = 0;
    while (seenAt === undefined) {
        cycle(platform, ew, ns);
        const platformHash = platform.map(l => l.join('')).join('');
        seenAt = seen[platformHash];
        if (seenAt === undefined) {
            cycleIndex = cycleIndex + 1;
            seen[platformHash] = cycleIndex;
            loads[cycleIndex] = calculateLoad(platform, ns);
        }
    }
    cycleIndex = cycleIndex + 1;
    const loadIndex = ((totalCycles - seenAt) % (cycleIndex - seenAt)) + seenAt;
    return loads[loadIndex];
};

test('14-P2', () => {
    expect(solve('14-t1')).toEqual(64);
    expect(solve('14')).toEqual(94876);
});
