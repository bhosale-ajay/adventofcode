import { ascendingBy, first, query } from 'dotless';
import { assertNotNull, mapLineToNumber } from './util';

const hasMatch = () => {
    const candidates = new Set<number>();
    return (candidate: number) => {
        const match = 2020 - candidate;
        if (candidates.has(match)) {
            return true;
        } else {
            candidates.add(candidate);
            return false;
        }
    };
};

const findProductOfMatch = (candidates: number[]) =>
    query(candidates, first(hasMatch()), assertNotNull, x => x * (2020 - x));

const findProductOfTriplets = (candidates: number[]) => {
    candidates.sort(ascendingBy());
    const count = candidates.length;
    const limitA = 2020 / 3;
    const limitB = 2020 / 2;
    for (let i = 0; i < count - 2 && candidates[i] < limitA; i++) {
        for (let j = i + 1; j < count - 1 && candidates[j] < limitB; j++) {
            for (let k = j + 1; k < count; k++) {
                const sum = candidates[i] + candidates[j] + candidates[k];
                if (sum === 2020) {
                    return candidates[i] * candidates[j] * candidates[k];
                }
                if (sum > 2020) {
                    break;
                }
            }
        }
    }
    return -1;
};

test('01', () => {
    const testInput = mapLineToNumber('01-test');
    const puzzleInput = mapLineToNumber('01');
    expect(findProductOfMatch(testInput)).toEqual(514579);
    expect(findProductOfMatch(puzzleInput)).toEqual(788739);
    expect(findProductOfTriplets(testInput)).toEqual(241861950);
    expect(findProductOfTriplets(puzzleInput)).toEqual(178724430);
});
