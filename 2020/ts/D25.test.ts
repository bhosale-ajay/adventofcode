import { assert } from 'console';

// https://stackoverflow.com/questions/5989429/pow-and-mod-function-optimization/5989549
function pow(base: number, exp: number, mod: number): number {
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        return Math.pow(pow(base, exp / 2, mod), 2) % mod;
    } else {
        return (base * pow(base, exp - 1, mod)) % mod;
    }
}

const MAGIC_NUMBER = 20201227;
const findLoopSize = (key: number, startAt: number) => {
    for (let i = startAt; i < 10000000; i++) {
        if (pow(7, i, MAGIC_NUMBER) === key) {
            return i;
        }
    }
    assert('This should not happen');
    return 0;
};

// Change start at if it is not working for you
const solve = (cardPK: number, doorPK: number, startAt = 1500000) => {
    const ek1 = pow(doorPK, findLoopSize(cardPK, startAt), MAGIC_NUMBER);
    const ek2 = pow(cardPK, findLoopSize(doorPK, startAt), MAGIC_NUMBER);
    assert(ek1 === ek2);
    return ek1;
};

test('25', () => {
    expect(solve(5764801, 17807724, 0)).toEqual(14897079);
    expect(solve(13135480, 8821721)).toEqual(8329514);
});
