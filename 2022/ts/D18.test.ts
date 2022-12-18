import { mapLine } from './util';

type Cube = [number, number, number];
const dirs = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
];
const cubeKey = (d: number[]) => d.join();
const isAdjacent = (a: Cube, b: Cube) =>
    1 == b.reduce((acc, v, d) => acc + Math.abs(a[d] - v), 0);
const MAX = Number.MAX_SAFE_INTEGER;
const solve = (fn: string) => {
    const cubes = mapLine(fn, l => l.split(',').map(Number)) as Cube[];
    let sidesNotVisible = 0;
    let max = [0, 0, 0];
    let min = [MAX, MAX, MAX];
    const surface = new Set<string>();
    for (let i = 0; i < cubes.length; i++) {
        const a = cubes[i];
        surface.add(cubeKey(a));
        max = max.map((v, d) => Math.max(v, a[d] + 1));
        min = min.map((v, d) => Math.min(v, a[d] - 1));
        for (let j = i + 1; j < cubes.length; j++) {
            if (isAdjacent(a, cubes[j])) {
                sidesNotVisible = sidesNotVisible + 2;
            }
        }
    }
    const waterCubes: Cube[] = [];
    const inRange = (cube: Cube) =>
        cube.every((v, i) => v >= min[i] && v <= max[i]);
    const addCube = (c1: Cube, c2: Cube) => c1.map((v, i) => v + c2[i]) as Cube;
    const spread = (current: Cube) => {
        surface.add(cubeKey(current));
        waterCubes.push(current);
        for (let i = 0; i < dirs.length; i++) {
            const targetCube = addCube(current, dirs[i] as Cube);
            if (inRange(targetCube) && !surface.has(cubeKey(targetCube))) {
                spread(targetCube);
            }
        }
    };
    spread(min as Cube);
    const p1 = cubes.length * 6 - sidesNotVisible;
    const p2 = waterCubes.reduce(
        (acc, wc) => acc + cubes.filter(c => isAdjacent(c, wc)).length,
        0
    );
    return [p1, p2];
};

test('18', () => {
    expect(solve('18-test')).toEqual([64, 58]);
    // expect(solve('18')).toEqual([3530, 2000]);
});
