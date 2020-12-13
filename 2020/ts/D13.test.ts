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

export const winGoldCoin = (buses: Bus[]): number => {
    let time = buses[0][0],
        step = buses[0][0];
    for (let n = 1; n < buses.length; n++) {
        const [busId, index] = buses[n];
        while ((time + index) % busId !== 0) {
            time += step;
        }
        step = step * busId;
    }
    return time;
};

test('13', () => {
    const t = parse('13-test');
    const i = parse('13');
    expect(findEarliestBus(t)).toEqual(295);
    expect(findEarliestBus(i)).toEqual(174);
    expect(winGoldCoin(t[1])).toEqual(1068781);
    expect(winGoldCoin(i[1])).toEqual(780601154795940);
    expect(winGoldCoin(parseBuses('3,5,7'))).toEqual(54);
    expect(winGoldCoin(parseBuses('17,x,13,19'))).toEqual(3417);
    expect(winGoldCoin(parseBuses('67,7,59,61'))).toEqual(754018);
    expect(winGoldCoin(parseBuses('67,x,7,59,61'))).toEqual(779210);
    expect(winGoldCoin(parseBuses('67,7,x,59,61'))).toEqual(1261476);
    expect(winGoldCoin(parseBuses('1789,37,47,1889'))).toEqual(1202161486);
});
