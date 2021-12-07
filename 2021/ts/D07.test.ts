import { mapLineToNumber } from './util';

const calCostAtConstantRate = (positions: number[], anchor: number) =>
    positions.reduce((c, p) => c + Math.abs(p - anchor), 0);

const calCostAtIncreasingRate = (positions: number[], anchor: number) =>
    positions.reduce((c, p) => {
        const diff = Math.abs(p - anchor);
        return c + (diff * (diff + 1)) / 2;
    }, 0);

const calAverage = (ns: number[]) => ns.reduce((a, b) => a + b) / ns.length;

const solve = (fn: string) => {
    const positions = mapLineToNumber(fn, ',').sort((a, b) => a - b);
    const count = positions.length;
    const mi = Math.floor(count / 2);
    const middlePosition =
        count % 2 === 0
            ? (positions[mi - 1] + positions[mi]) / 2
            : positions[mi];
    const fuelAtConstantRate = calCostAtConstantRate(positions, middlePosition);
    const averagePosition = Math.floor(calAverage(positions));
    const fuelAtVaryingRate = Math.min(
        ...[averagePosition - 1, averagePosition, averagePosition + 1].map(p =>
            calCostAtIncreasingRate(positions, p)
        )
    );
    return [fuelAtConstantRate, fuelAtVaryingRate];
};

test('07', () => {
    expect(solve('07-test')).toEqual([37, 168]);
    expect(solve('07')).toEqual([352997, 101571302]);
});
