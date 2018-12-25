import { matchesToArray } from "dotless";
import { getInput } from "./util";

const calculateDistance = ([x1, y1, z1, t1]: number[], [x2, y2, z2, t2]: number[]) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2) + Math.abs(t1 - t2);
};
const regex = /([-\d]*),([-\d]*),([-\d]*),([-\d]*)/g;
const findNumberOfConstellations = (ip: string) => {
    const points = matchesToArray(getInput(ip), regex, m => ([+m[1], +m[2], +m[3], +m[4]]));
    const constellations: number[][] = [];
    let pointIndex = 0;
    for (const point of points) {
        const partOf = [];
        let constellationIndex = 0;
        for (const constellation of constellations) {
            for (const other of constellation) {
                if (calculateDistance(points[other], point) <= 3) {
                    partOf.push(constellationIndex);
                    break;
                }
            }
            constellationIndex = constellationIndex + 1;
        }
        if (partOf.length > 0) {
            const root = partOf[0];
            constellations[root].push(pointIndex);
            for (let i = partOf.length - 1; i > 0; i--) {
                const part = partOf[i];
                constellations[root] = constellations[root].concat(constellations[part]);
                constellations.splice(part, 1);
            }
        } else {
            constellations.push([pointIndex]);
        }
        pointIndex = pointIndex + 1;
    }
    return constellations.length;
};

test("25", () => {
    expect(findNumberOfConstellations("25-test1")).toEqual(2);
    expect(findNumberOfConstellations("25-test2")).toEqual(4);
    expect(findNumberOfConstellations("25-test3")).toEqual(3);
    expect(findNumberOfConstellations("25-test4")).toEqual(8);
    expect(findNumberOfConstellations("25")).toEqual(394);
});
