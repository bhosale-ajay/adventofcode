type TargetRange = [minX: number, maxX: number, minY: number, maxY: number];

const calculateHighestYPosition = ([, , yMin]: TargetRange) => {
    const dy = yMin * -1;
    return (dy * (dy - 1)) / 2;
};

const check = (
    vx: number,
    vy: number,
    [minX, maxX, minY, maxY]: TargetRange
): boolean => {
    let x = 0;
    let y = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        x = x + vx;
        y = y + vy;
        vx = vx > 0 ? vx - 1 : vx < 0 ? vx + 1 : 0;
        vy = vy - 1;
        if (minX <= x && x <= maxX && minY <= y && y <= maxY) {
            return true;
        } else if (maxX < x || y < minY) {
            return false;
        }
    }
};

const countDistinctVelocities = ([minX, maxX, minY, maxY]: TargetRange) => {
    let count = 0;
    for (let vx = Math.ceil(Math.sqrt(minX)); vx <= maxX; vx++) {
        for (let vy = minY; vy <= minY * -1; vy++) {
            if (check(vx, vy, [minX, maxX, minY, maxY])) {
                count++;
            }
        }
    }
    return count;
};

test('17', () => {
    // target area: x=20..30, y=-10..-5
    const ti = [20, 30, -10, -5] as TargetRange;
    // target area: x=117..164, y=-140..-89
    const ai = [117, 164, -140, -89] as TargetRange;
    expect(calculateHighestYPosition(ti)).toEqual(45);
    expect(calculateHighestYPosition(ai)).toEqual(9730);
    expect(countDistinctVelocities(ti)).toEqual(112);
    expect(countDistinctVelocities(ai)).toEqual(4110);
});
