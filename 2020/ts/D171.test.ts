import { getGrid } from './util';

const ACTIVE = '#';
type GridState = Map<string, number>;
type Grid = [
    state: GridState,
    xf: number,
    xt: number,
    yf: number,
    yt: number,
    zf: number,
    zt: number
];

const parse = (ip: string): Grid => {
    const slice = getGrid(ip);
    const state = new Map<string, number>();
    const [xf, xt, yf, yt] = [0, slice[0].length - 1, 0, slice.length - 1];
    for (let x = xf; x <= xt; x++) {
        for (let y = yf; y <= yt; y++) {
            state.set(`${x},${y},0`, slice[y][x] === ACTIVE ? 1 : 0);
        }
    }
    return [state, xf, xt, yf, yt, 0, 0];
};

const build3DDelta = () => {
    const result: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                if (x === 0 && y === 0 && z === 0) {
                    continue;
                }
                result.push([x, y, z]);
            }
        }
    }
    return result;
};

const delta = build3DDelta();

const countActiveNeighbors = (state: GridState, cube: string) => {
    const [cx, cy, cz] = cube.split(',').map(n => +n);
    let activeCount = 0;
    for (const [xd, yd, zd] of delta) {
        const nc = `${cx + xd},${cy + yd},${cz + zd}`;
        if (state.get(nc) === 1) {
            activeCount = activeCount + 1;
            if (activeCount === 4) {
                return activeCount;
            }
        }
    }
    return activeCount;
};

const iterate = (current: Grid): Grid => {
    const [state, cxf, cxt, cyf, cyt, czf, czt] = current;
    const [nxf, nxt, nyf, nyt, nzf, nzt] = [
        cxf - 1,
        cxt + 1,
        cyf - 1,
        cyt + 1,
        czf - 1,
        czt + 1,
    ];
    const nextState = new Map<string, number>();
    for (let x = nxf; x <= nxt; x++) {
        for (let y = nyf; y <= nyt; y++) {
            for (let z = nzf; z <= nzt; z++) {
                const cube = `${x},${y},${z}`;
                const cs = state.get(cube) || 0;
                const an = countActiveNeighbors(state, cube);
                let cns = 0;
                if (cs === 1) {
                    cns = an === 2 || an === 3 ? 1 : 0;
                } else {
                    cns = an === 3 ? 1 : 0;
                }
                nextState.set(cube, cns);
            }
        }
    }
    return [nextState, nxf, nxt, nyf, nyt, nzf, nzt];
};

const solve = (ip: string) => {
    let grid = parse(ip);
    for (let i = 0; i < 6; i++) {
        grid = iterate(grid);
    }
    let result = 0;
    grid[0].forEach(v => (result = result + v));
    return result;
};

test('172', () => {
    expect(solve('17-test')).toEqual(112);
    expect(solve('17')).toEqual(333);
});
