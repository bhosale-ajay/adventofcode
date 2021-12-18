import { mapLine } from './util';

type PairData = [left: number | PairData, right: number | PairData];
type NumberInPair = [value: number, depth: number];
type Pair = NumberInPair[];

const flattenThePair = (pairData: PairData, depth = 1): Pair => {
    let result: NumberInPair[] = [];
    pairData.forEach((part: number | PairData) => {
        if (typeof part == 'number') {
            result.push([part, depth]);
        } else {
            result = result.concat(flattenThePair(part, depth + 1));
        }
    });
    return result;
};

const lineToNumberInPairs = (l: string) =>
    flattenThePair(JSON.parse(l) as PairData);

const explode = (pair: Pair, index: number) => {
    if (index === pair.length - 1) {
        console.log(`problem at ${index}`);
        console.log(`${pair}`);
    }
    const [[fv, fd], [sv, _sd]] = pair.slice(index, index + 2);
    if (index > 0) {
        pair[index - 1][0] += fv;
    }
    if (index < pair.length - 2) {
        pair[index + 2][0] += sv;
    }
    pair.splice(index, 1);
    pair[index] = [0, fd - 1];
};

const split = (pair: Pair, index: number) => {
    const [v, d] = pair[index];
    const fv = Math.floor(v / 2);
    const sv = Math.ceil(v / 2);
    pair[index] = [fv, d + 1];
    pair.splice(index + 1, 0, [sv, d + 1]);
};

const add = (a: Pair, b: Pair) => {
    const result = a
        .map(([v, d]) => [v, d + 1])
        .concat(b.map(([v, d]) => [v, d + 1])) as Pair;
    // console.log(`after addition:\t${result}`);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const readyToExplode = result.findIndex(np => np[1] >= 5);
        if (readyToExplode > -1) {
            explode(result, readyToExplode);
            // console.log(`after explode:\t${result}`);
            continue;
        }
        const readyToSplit = result.findIndex(np => np[0] >= 10);
        if (readyToSplit > -1) {
            split(result, readyToSplit);
            // console.log(`after split:\t${result}`);
            continue;
        }
        break;
    }
    return result;
};

const calculateMagnitude = (pair: Pair) => {
    while (pair.length > 1) {
        const length = pair.length;
        const firstPairIndex = pair.findIndex(
            (np, i) => np[1] == pair[i + 1][1] && i < length - 1
        );
        if (firstPairIndex === -1) {
            break;
        }
        const [fv, fd] = pair[firstPairIndex];
        const [sv, _sd] = pair[firstPairIndex + 1];
        pair.splice(firstPairIndex, 1);
        pair[firstPairIndex] = [fv * 3 + sv * 2, fd - 1];
    }
    return pair[0][0];
};

const solve = (fn: string) => {
    const lines = mapLine(fn, lineToNumberInPairs);
    const magnitudeOfSum = calculateMagnitude(lines.reduce(add));
    let largestMagnitude = 0;
    for (let l1 = 0; l1 < lines.length; l1++) {
        for (let l2 = 0; l2 < lines.length; l2++) {
            if (l1 === l2) {
                continue;
            }
            const mag = calculateMagnitude(add(lines[l1], lines[l2]));
            largestMagnitude = Math.max(largestMagnitude, mag);
        }
    }
    return [magnitudeOfSum, largestMagnitude];
};

test('18', () => {
    expect(solve('18-test')).toEqual([4140, 3993]);
    expect(solve('18')).toEqual([3411, 4680]);
});
