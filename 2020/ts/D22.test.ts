import { getInput } from './util';

type Deck = number[];

const parseDeck = (ls: string): Deck =>
    ls
        .split(':\n')[1]
        .split('\n')
        .map(n => +n);

const getDecks = (ip: string) =>
    getInput(ip).split('\n\n').map(parseDeck) as [Deck, Deck];

const combat = (d1: Deck, d2: Deck): Deck => {
    while (d1.length > 0 && d2.length > 0) {
        const c1 = d1.shift() as number;
        const c2 = d2.shift() as number;
        if (c1 > c2) {
            d1.push(c1);
            d1.push(c2);
        } else {
            d2.push(c2);
            d2.push(c1);
        }
    }
    return d1.length ? d1 : d2;
};

const deckScore = (d: Deck) => d.reduce((s, c, i) => s + c * (d.length - i), 0);

const simpleWinner = (ip: string) => deckScore(combat(...getDecks(ip)));
const recursiveCombat = (d1: Deck, d2: Deck): [number, Deck] => {
    const seen = new Set();
    while (d1.length > 0 && d2.length > 0) {
        const state = `${d1}:${d2}`;
        if (seen.has(state)) {
            return [1, d1];
        }
        seen.add(state);

        const c1 = d1.shift() as number;
        const c2 = d2.shift() as number;

        let winner;
        if (d1.length >= c1 && d2.length >= c2) {
            winner = recursiveCombat(d1.slice(0, c1), d2.slice(0, c2))[0];
        } else {
            winner = c1 > c2 ? 1 : 2;
        }

        if (winner == 1) {
            d1.push(c1);
            d1.push(c2);
        } else {
            d2.push(c2);
            d2.push(c1);
        }
    }

    return [d1.length > 0 ? 1 : 2, d1.length > 0 ? d1 : d2];
};

const recursiveWinner = (ip: string) =>
    deckScore(recursiveCombat(...getDecks(ip))[1]);

test('22', () => {
    expect(simpleWinner('22-test')).toEqual(306);
    expect(simpleWinner('22')).toEqual(31781);
    expect(recursiveWinner('22-test')).toEqual(291);
    expect(recursiveWinner('22')).toEqual(35154);
});
