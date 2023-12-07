import { mapLine, toNumber } from './util';

type Race = {
    time: number;
    distance: number;
};

const findWinningWays = (r: Race): number => {
    let winningWays = 0;
    for (let t = 1; t < r.time; t++) {
        const speed = t;
        const timeRemaining = r.time - t;
        const distance = speed * timeRemaining;
        if (distance > r.distance) {
            winningWays++;
        }
    }
    return winningWays;
};

const parse = (fn: string): Race[] => {
    const [fl, sl] = mapLine(fn, l => l.split(/\s+/).slice(1).map(toNumber));
    return fl.map((t, ti) => ({ time: t, distance: sl[ti] }));
};

const solve = (fn: string): [number, number] => {
    const races = parse(fn);
    const p1 = races.map(findWinningWays).reduce((acc, wc) => acc * wc);
    const [ct, cd] = races
        .reduce(
            ([t, d], r) => [t + r.time.toString(), d + r.distance.toString()],
            ['', ''],
        )
        .map(toNumber);
    const sqrt = Math.sqrt(ct ** 2 - 4 * cd);
    const p2 = Math.ceil((ct + sqrt) / 2) - Math.floor((ct - sqrt) / 2) - 1;
    return [p1, p2];
};

test('06', () => {
    expect(solve('06-t1')).toEqual([288, 71503]);
    expect(solve('06')).toEqual([293046, 35150181]);
});
