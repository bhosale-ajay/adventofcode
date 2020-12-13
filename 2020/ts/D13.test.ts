import { getLines } from './util';

type Bus = [busId: number, busIndex: number];
type Input = [ts: number, buses: Bus[]];
const MAX = Number.MAX_SAFE_INTEGER;

const parseBuses = (l: string) =>
    l
        .split(',')
        .map((b, bi) => [+b, bi] as Bus)
        .filter(([b]) => !isNaN(b));

const parse = (ip: string): [number, Bus[]] => {
    const [ts, bl] = getLines(ip);
    return [+ts, parseBuses(bl)];
};

const findEarliestBus = ([ts, buses]: Input) => {
    const [earliestBus, waitTime] = buses.reduce(
        ([selected, minWaitTime], [busId]) => {
            const interval = ts % busId;
            const waitTimeForBus = interval > 0 ? busId - interval : 0;
            return minWaitTime > waitTimeForBus
                ? [busId, waitTimeForBus]
                : [selected, minWaitTime];
        },
        [0, MAX]
    );
    return earliestBus * waitTime;
};

// solution from @caderek
// https://github.com/caderek/aoc2020/blob/main/src/day13/index.ts
const gcd = (a: bigint, b: bigint) => {
    let x = 1n,
        y = 0n,
        r = 0n,
        s = 1n;

    while (b !== 0n) {
        const c = a % b;
        const q = a / b;
        a = b;
        b = c;

        const rPrim = r;
        const sPrim = s;
        r = x - q * r;
        s = y - q * s;
        x = rPrim;
        y = sPrim;
    }
    return x;
};

const mod = (a: bigint, b: bigint) => {
    const x = a % b;
    return x < 0n ? x + b : x;
};

const convertToBigNum = ([busId, busIndex]: Bus): [bigint, bigint] => {
    const b = BigInt(busId);
    return [BigInt(b), b - (BigInt(busIndex) % b)];
};

const winGoldCoin = (buses: Bus[]) => {
    const bigBuses = buses.map(convertToBigNum);
    const product = bigBuses.reduce((acc, [b]) => acc * b, 1n);
    const factor = bigBuses
        .map(([busId, busIndex]) => {
            const N = product / busId;
            const M = gcd(N, busId);
            return busIndex * N * M;
        })
        .reduce((a, b) => a + b);
    return mod(factor, product);
};

test('13', () => {
    const t = parse('13-test');
    const i = parse('13');
    expect(findEarliestBus(t)).toEqual(295);
    expect(findEarliestBus(i)).toEqual(174);
    expect(winGoldCoin(t[1])).toEqual(1068781n);
    expect(winGoldCoin(i[1])).toEqual(780601154795940n);
    expect(winGoldCoin(parseBuses('3,5,7'))).toEqual(54n);
    expect(winGoldCoin(parseBuses('17,x,13,19'))).toEqual(3417n);
    expect(winGoldCoin(parseBuses('67,7,59,61'))).toEqual(754018n);
    expect(winGoldCoin(parseBuses('67,x,7,59,61'))).toEqual(779210n);
    expect(winGoldCoin(parseBuses('67,7,x,59,61'))).toEqual(1261476n);
    expect(winGoldCoin(parseBuses('1789,37,47,1889'))).toEqual(1202161486n);
});
