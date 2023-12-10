import { mapLine, Grid, gridBoundChecker, GridLocation, Map } from './util';

type Area = Grid<string>;
type Direction = 'N' | 'E' | 'W' | 'S';
type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F';
const getPipe = (a: Area, [r, c]: GridLocation) => a[r][c] as Pipe;
const locationToKey = ([r, c]: GridLocation) => `${r}:${c}`;
const start = [
    // Facing North
    { r: -1, c: 0, pipe: ['|', '7', 'F'], facing: 'N' },
    // Facing East
    { r: 0, c: 1, pipe: ['-', '7', 'J'], facing: 'E' },
    // Facing West
    { r: 0, c: -1, pipe: ['-', 'L', 'F'], facing: 'W' },
    // Facing South
    { r: 1, c: 0, pipe: ['|', 'L', 'J'], facing: 'S' },
];
const navigator = {
    '|': (f: Direction) => f,
    '-': (f: Direction) => f,
    L: (f: Direction) => (f === 'S' ? 'E' : 'N') as Direction,
    J: (f: Direction) => (f === 'S' ? 'W' : 'N') as Direction,
    '7': (f: Direction) => (f === 'N' ? 'W' : 'S') as Direction,
    F: (f: Direction) => (f === 'N' ? 'E' : 'S') as Direction,
};
const pipeType: Map<string> = {
    NS: '|',
    EW: '-',
    NE: 'L',
    NW: 'J',
    WS: '7',
    ES: 'F',
};
const nextLocation = {
    N: ([r, c]: GridLocation): GridLocation => [r - 1, c],
    E: ([r, c]: GridLocation): GridLocation => [r, c + 1],
    W: ([r, c]: GridLocation): GridLocation => [r, c - 1],
    S: ([r, c]: GridLocation): GridLocation => [r + 1, c],
};
const findStartingLocation = (a: Area) => {
    for (let r = 0; r < a.length; r++) {
        for (let c = 0; c < a[r].length; c++) {
            if (a[r][c] === 'S') {
                return [r, c] as GridLocation;
            }
        }
    }
    return undefined;
};

const solve = (fn: string) => {
    const area: Area = mapLine(fn, l => l.split(''));
    const areaChecker = gridBoundChecker(area);
    const [sr, sc] = findStartingLocation(area)!;
    const pipeEnds = start
        .filter(
            d =>
                areaChecker([sr + d.r, sc + d.c]) &&
                d.pipe.includes(area[sr + d.r][sc + d.c]),
        )
        .map(d => d.facing) as Direction[];
    let meet = false;
    let [a, b] = pipeEnds;
    let aLocation = [sr, sc] as GridLocation;
    let bLocation = [sr, sc] as GridLocation;
    // Update the S
    area[sr][sc] = pipeType[pipeEnds.join('')];
    let steps = 0;
    const visited = new Set();
    visited.add(locationToKey(aLocation));
    while (!meet) {
        steps = steps + 1;
        aLocation = nextLocation[a](aLocation);
        a = navigator[getPipe(area, aLocation)](a);
        bLocation = nextLocation[b](bLocation);
        b = navigator[getPipe(area, bLocation)](b);
        const al = locationToKey(aLocation);
        const bl = locationToKey(bLocation);
        visited.add(al);
        visited.add(bl);
        meet = al === bl;
    }
    const downPipe = new Set(['|', '7', 'F']);
    let counter = 0;
    for (let r = 0; r < area.length; r++) {
        let up = false;
        for (let c = 0; c < area[r].length; c++) {
            const l = [r, c] as GridLocation;
            const pipe = getPipe(area, l);
            const inLoop = visited.has(locationToKey(l));
            if (downPipe.has(pipe) && inLoop) {
                // console.log(`toggled : ${r} ${c} ${pipe} ${up}`);
                up = !up;
            }
            if (up && !inLoop) {
                // console.log(`counted : ${r} ${c} ${pipe}`);
                counter += 1;
            }
        }
    }
    return [steps, counter];
};

test('10', () => {
    expect(solve('10-t1')).toEqual([4, 1]);
    expect(solve('10-t2')).toEqual([8, 1]);
    expect(solve('10-t3')).toEqual([23, 4]);
    expect(solve('10-t4')).toEqual([22, 4]);
    expect(solve('10-t5')).toEqual([70, 8]);
    expect(solve('10-t6')).toEqual([80, 10]);
    expect(solve('10')).toEqual([6927, 467]);
});
