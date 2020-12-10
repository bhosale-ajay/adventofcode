import { mapLineToNumber } from './util';

const findInvalidNumber = (input: number[], setSize: number) => {
    toNextItem: for (let i = setSize; i < input.length; i++) {
        const lb = i - setSize,
            ub = i - 1,
            current = input[i];
        for (let si = lb; si < ub; si++) {
            const match = current - input[si];
            if (match < 0) {
                continue;
            }
            for (let mi = si + 1; mi <= ub; mi++) {
                if (input[mi] === match) continue toNextItem;
            }
        }
        return current;
    }
    return -1;
};

const findWeakness = (ip: string, setSize: number) => {
    const input = mapLineToNumber(ip);
    const invalidNumber = findInvalidNumber(input, setSize);
    if (invalidNumber === -1) {
        return [0, 0];
    }
    let startIndex = 0,
        endIndex = 1,
        blockSum = input[0] + input[1];
    while (blockSum !== invalidNumber && endIndex < input.length) {
        endIndex = endIndex + 1;
        blockSum = blockSum + input[endIndex];
        while (blockSum > invalidNumber && endIndex - startIndex > 1) {
            blockSum = blockSum - input[startIndex];
            startIndex = startIndex + 1;
        }
    }
    if (blockSum !== invalidNumber) {
        return [invalidNumber, 0];
    }
    const block = input.slice(startIndex, endIndex + 1);
    return [invalidNumber, Math.min(...block) + Math.max(...block)];
};

test('09', () => {
    expect(findWeakness('09-test', 5)).toEqual([127, 62]);
    expect(findWeakness('09', 25)).toEqual([32321523, 4794981]);
});
