import { mapLine } from './util';

const parseNumbers = (nl: string) => nl.split(' ').filter(l => l.length);
const parseLine = (l: string): number => {
    const [winning, candidates] = l.split(':')[1].split('|').map(parseNumbers);
    let hits = 0;
    for (const wn of winning) {
        if (candidates.includes(wn)) {
            hits = hits + 1;
        }
    }
    return hits;
};

const solve = (fn: string): [number, number] => {
    const cards = mapLine(fn, parseLine);
    let p1 = 0;
    const copies = cards.map(_ => 1);
    const cardCount = cards.length;
    for (let i = 0; i < cardCount; i++) {
        const matching = cards[i];
        if (matching > 0) {
            p1 = p1 + Math.pow(2, matching - 1);
        }
        for (let ci = 1; ci <= matching; ci++) {
            copies[i + ci] = copies[i + ci] + copies[i];
        }
    }
    const p2 = copies.reduce((acc, cc) => acc + cc);
    return [p1, p2];
};

test('04', () => {
    expect(solve('04-t1')).toEqual([13, 30]);
    expect(solve('04')).toEqual([24542, 8736438]);
});
