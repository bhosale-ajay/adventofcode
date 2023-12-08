import { Map, mapLine } from './util';
import { ascendingBy, countBy, descendingBy, sort } from 'dotless';
type Hand = {
    cards: string[];
    cardValuesP1: number[];
    cardValuesP2: number[];
    typeP1: string;
    typeP2: string;
    bid: number;
};
const arrayToMap = (acc: Map<number>, n: string, ni: number) => {
    acc[n] = ni;
    return acc;
};
const stringToMap = (s: string) => s.split('').reduce(arrayToMap, {});
const countBySelf = countBy();
const valueMapP1 = stringToMap('23456789TJQKA');
const valueMapP2 = stringToMap('J23456789TQKA');
const getTypeP1 = (cards: string[]) =>
    Object.values(countBySelf(cards)).sort(descendingBy()).slice(0, 2).join('');
const getTypeP2 = (cards: string[]) => {
    const cardOccurrences = countBySelf(cards);
    let jCount = 0;
    if (cardOccurrences['J'] === 5) {
        return '5';
    }
    if (cardOccurrences['J'] > 0) {
        jCount = cardOccurrences['J'];
        delete cardOccurrences['J'];
    }
    const updatedOccurrences =
        Object.values(cardOccurrences).sort(descendingBy());
    updatedOccurrences[0] = updatedOccurrences[0] + jCount;
    return updatedOccurrences.slice(0, 2).join('');
};
const lineToHand = (l: string): Hand => {
    const [cardsPart, bid] = l.split(' ');
    const cards = cardsPart.split('');
    return {
        cards,
        bid: +bid,
        typeP1: getTypeP1(cards),
        cardValuesP1: cards.map(c => valueMapP1[c]),
        typeP2: getTypeP2(cards),
        cardValuesP2: cards.map(c => valueMapP2[c]),
    };
};
const byCardPosition =
    (p: number, prop: 'cardValuesP1' | 'cardValuesP2') => (a: Hand) =>
        a[prop][p];
const handSorterP1 = sort<Hand>(
    ascendingBy('typeP1'),
    ascendingBy(byCardPosition(0, 'cardValuesP1')),
    ascendingBy(byCardPosition(1, 'cardValuesP1')),
    ascendingBy(byCardPosition(2, 'cardValuesP1')),
    ascendingBy(byCardPosition(3, 'cardValuesP1')),
    ascendingBy(byCardPosition(4, 'cardValuesP1')),
);
const handSorterP2 = sort<Hand>(
    ascendingBy('typeP2'),
    ascendingBy(byCardPosition(0, 'cardValuesP2')),
    ascendingBy(byCardPosition(1, 'cardValuesP2')),
    ascendingBy(byCardPosition(2, 'cardValuesP2')),
    ascendingBy(byCardPosition(3, 'cardValuesP2')),
    ascendingBy(byCardPosition(4, 'cardValuesP2')),
);
const calculateTotalWinning = (acc: number, hand: Hand, rank: number) =>
    acc + hand.bid * (rank + 1);

const solve = (fn: string): [number, number] => {
    const hands = mapLine(fn, lineToHand);
    const p1 = handSorterP1(hands).reduce(calculateTotalWinning, 0);
    const p2 = handSorterP2(hands).reduce(calculateTotalWinning, 0);
    return [p1, p2];
};

test('07', () => {
    expect(solve('07-t1')).toEqual([6440, 5905]);
    expect(solve('07')).toEqual([249726565, 251135960]);
});
