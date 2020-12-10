import { ascendingBy } from 'dotless';
import { mapLineToNumber } from './util';

const getProduct = (adapters: number[]) => {
    let oneJoltDiff = 0,
        threeJoltDiff = 1;
    for (let i = 0; i < adapters.length; i++) {
        const diff = i > 0 ? adapters[i] - adapters[i - 1] : adapters[i];
        if (diff === 1) {
            oneJoltDiff = oneJoltDiff + 1;
        } else if (diff === 3) {
            threeJoltDiff = threeJoltDiff + 1;
        }
    }
    return oneJoltDiff * threeJoltDiff;
};

const countArrangements = (adapters: number[]) => {
    const arrangements = new Map<number, number>();
    const lastAdapterIndex = adapters.length - 1;
    const lastAdapter = adapters[lastAdapterIndex];
    const reducer = (s: number, i: number) => s + (arrangements.get(i) || 0);
    const sumOf = (c: number) => [c + 1, c + 2, c + 3].reduce(reducer, 0);
    arrangements.set(lastAdapter, 1);
    for (let ai = lastAdapterIndex - 1; ai >= 0; ai--) {
        arrangements.set(adapters[ai], sumOf(adapters[ai]));
    }
    return sumOf(0);
};

const parse = (ip: string) => mapLineToNumber(ip).sort(ascendingBy());

test('10', () => {
    const testInput01 = parse('10-test-01');
    const testInput02 = parse('10-test-02');
    const input = parse('10');

    expect(getProduct(testInput01)).toEqual(35);
    expect(getProduct(testInput02)).toEqual(220);
    expect(getProduct(input)).toEqual(2516);
    expect(countArrangements(testInput01)).toEqual(8);
    expect(countArrangements(testInput02)).toEqual(19208);
    expect(countArrangements(input)).toEqual(296196766695424);
});
