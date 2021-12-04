import { query as pipe } from 'dotless';
import { mapLine } from './util';

type BitCount = [zeros: number, ones: number];
type BitMuster = BitCount[];
type Bits = number[];
type Numbers = Bits[];
type SegregatedNumbers = [withZero: Numbers, withOne: Numbers];
type Strategy = (sd: SegregatedNumbers) => Numbers;

const getMostCommonBit = ([zeroCount, oneCount]: BitCount) =>
    zeroCount > oneCount ? '0' : '1';

const getLeastCommonBit = ([zeroCount, oneCount]: BitCount) =>
    zeroCount < oneCount ? '0' : '1';

const lineToBits = (l: string) => l.split('').map(b => +b);

const productOfBits = ([a, b]: string[]) => parseInt(a, 2) * parseInt(b, 2);

const oxygen: Strategy = ([zeros, ones]: SegregatedNumbers) =>
    zeros.length <= ones.length ? ones : zeros;

const co2: Strategy = ([zeros, ones]: SegregatedNumbers) =>
    zeros.length <= ones.length ? zeros : ones;

const getEmptyMuster = (length: number): BitMuster =>
    Array.from({ length }, () => [0, 0]);

const countBits = (numbers: Numbers) => {
    const numberOfBits = numbers[0].length;
    const muster: BitMuster = getEmptyMuster(numberOfBits);
    numbers.forEach((bits: Bits) => {
        bits.forEach((b, i) => (muster[i][b] = muster[i][b] + 1));
    });
    return muster;
};

const decodeRates = (muster: BitMuster) =>
    muster.reduce(
        ([gamma, epsilon], count) => [
            gamma + getMostCommonBit(count),
            epsilon + getLeastCommonBit(count),
        ],
        ['', '']
    );

const findProductOfGammaAndEpsilon = (data: Numbers) =>
    pipe(data, countBits, decodeRates, productOfBits);

const segregateByBit = (
    candidates: Numbers,
    position: number
): SegregatedNumbers => {
    const zeros = candidates.filter(l => l[position] === 0);
    const ones = candidates.filter(l => l[position] === 1);
    return [zeros, ones];
};

const selectCandidate = (
    candidates: Numbers,
    selector: Strategy,
    bit = 0
): string => {
    if (candidates.length === 1) {
        return candidates[0].join('');
    }
    const segregatedCandidates = segregateByBit(candidates, bit);
    const selectedCandidates = selector(segregatedCandidates);
    return selectCandidate(selectedCandidates, selector, bit + 1);
};

const findProductOfOxygenAndCo2 = (candidates: Numbers) => {
    const oxygenRating = selectCandidate(candidates, oxygen);
    const carbonRating = selectCandidate(candidates, co2);
    return productOfBits([oxygenRating, carbonRating]);
};

test('03', () => {
    const ti = mapLine('03-test', lineToBits);
    const ai = mapLine('03', lineToBits);
    expect(findProductOfGammaAndEpsilon(ti)).toEqual(198);
    expect(findProductOfGammaAndEpsilon(ai)).toEqual(3885894);
    expect(findProductOfOxygenAndCo2(ti)).toEqual(230);
    expect(findProductOfOxygenAndCo2(ai)).toEqual(4375225);
});
