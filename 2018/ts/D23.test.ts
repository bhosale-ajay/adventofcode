import { matchesToArray } from "dotless";
import { getInput } from "./util";
const [MIN, MAX] = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
const distanceTo0 = ([x, y, z]: number[]) => Math.abs(x) + Math.abs(y) + Math.abs(z);
const calculateDistance = ([x1, y1, z1]: number[], [x2, y2, z2]: number[]) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
};
const regex = /pos=<([-\d]*),([-\d]*),([-\d]*)>,\sr=([-\d]*)/g;
const solve = (ip: string) => {
    const bots = matchesToArray(getInput(ip), regex, m => ([+m[1], +m[2], +m[3], +m[4]]));
    let [minX, minY, minZ, maxX, maxY, maxZ] = [MAX, MAX, MAX, MIN, MIN, MIN];
    const maxRadiusBot = bots.reduce((maxB, b) => b[3] > maxB[3] ? b : maxB);
    const withinRadiusOfMax = bots.reduce((s, b) => s + (calculateDistance(b, maxRadiusBot) <= maxRadiusBot[3] ? 1 : 0), 0);
    bots.forEach(([bx, by, bz]) => {
        minX = Math.min(bx, minX);
        maxX = Math.max(bx, maxX);
        minY = Math.min(by, minY);
        maxY = Math.max(by, maxY);
        minZ = Math.min(bz, minZ);
        maxZ = Math.max(bz, maxZ);
    });
    let step = 1;
    // Ported python solution from skgsergio to TypeScript
    while (step < maxX - minX) {
        step *= 2;
    }
    let center = [];
    while (true) {
        center = [0, 0, 0, 0];
        for (let z = minZ; z <= maxZ + 1; z = z + step) {
            for (let y = minY; y <= maxY + 1; y = y + step) {
                for (let x = minX; x <= maxX + 1; x = x + step) {
                    const point = [x, y, z];
                    const countInRange = bots.reduce((sum, b) => {
                        return sum + ((calculateDistance(point, b) - b[3]) < step ? 1 : 0);
                    }, 0);
                    if (countInRange < center[3]
                        ||
                        // break if walking away, center must be closer to zero
                        (countInRange === center[3] && distanceTo0(point) > distanceTo0(center))) {
                        continue;
                    }
                    center = [x, y, z, countInRange];
                }
            }
        }

        if (step === 1) {
            break;
        } else {
            minX = center[0] - step;
            minY = center[1] - step;
            minZ = center[2] - step;
            maxX = center[0] + step;
            maxY = center[1] + step;
            maxZ = center[2] + step;
            step = ~~(step / 2);
        }
    }
    return [withinRadiusOfMax, distanceTo0(center)];
};

test("23", () => {
    expect(solve("23-test1")).toEqual([ 7, 1 ]);
    expect(solve("23-test2")).toEqual([ 6, 36 ]);
    expect(solve("23")).toEqual([ 613, 101599540 ]);
});
