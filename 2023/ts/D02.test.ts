import { mapLine } from './util';

const colorIndex: any = { r: 0, g: 1, b: 2 };
type Set = [number, number, number];
type Game = {
    id: number;
    sets: Set[];
};

const parseLine = (l: string): Game => {
    const [_, id, ...setsData] = l.split(' ');
    let set: Set = [0, 0, 0];
    const sets: Set[] = [];
    for (let i = 1; i < setsData.length; i = i + 2) {
        const count = +setsData[i - 1];
        const color = setsData[i][0];
        set[colorIndex[color]] = count;
        if (setsData[i].endsWith(';')) {
            sets.push([...set]);
            set = [0, 0, 0];
        }
    }
    sets.push(set);
    return { id: parseInt(id), sets };
};

const isPossible = (game: Game): boolean => {
    const max = [12, 13, 14];
    return game.sets.every(s => s.every((v, vi) => v <= max[vi]));
};

const getPower = (game: Game): number => {
    return game.sets
        .reduce(([ar, ag, ab], [r, g, b]) => [
            Math.max(ar, r),
            Math.max(ag, g),
            Math.max(ab, b),
        ])
        .reduce((a, c) => a * c);
};

const solve = (fn: string): [number, number] => {
    const games = mapLine(fn, parseLine);
    const p1 = games.filter(isPossible).reduce((acc, g) => acc + g.id, 0);
    const p2 = games.reduce((acc, g) => acc + getPower(g), 0);
    return [p1, p2];
};

test('02', () => {
    expect(solve('02-t1')).toEqual([8, 2286]);
    expect(solve('02')).toEqual([3099, 72970]);
});
