import { countBy, filter, query } from "dotless";
import { generate, getInput } from "./util";

interface Location {
    onEdge: boolean;
    closeTo: number;
    distance: number;
    totalDistance: number;
}

interface Area {
    name: number;
    x: number;
    y: number;
}

const [MAX, NONE, MANY] = [Number.MAX_SAFE_INTEGER, -1, -1];

const parse = (s: string) => getInput(s).split("\n").map((l, name) => {
    const [x, y] = l.split(",").map(c => +c);
    return { name, x, y } as Area;
});

const findGridDimensions = (areas: Area[]) => areas.reduce(([minX, minY, maxX, maxY], {x, y}) => ([
    Math.min(minX, x), Math.min(minY, y), Math.max(maxX, x), Math.max(maxY, y)
]), [MAX, MAX, 0, 0]);

const getLocations = (areas: Area[]) => {
    const [minX, minY, maxX, maxY] = findGridDimensions(areas);
    return generate<Location>(minX, maxX, minY, maxY, (lx, ly) => {
        const l = {
            closeTo: NONE,
            distance: MAX,
            totalDistance: 0,
            onEdge: (lx === minX) || (ly === minY) || (lx === maxX) || (ly === maxY),
        };
        for (const {name, x, y} of areas) {
            const distance = Math.abs(x - lx) + Math.abs(y - ly);
            l.totalDistance = l.totalDistance + distance;
            if (distance < l.distance) {
                l.distance = distance;
                l.closeTo = name;
            } else if (distance === l.distance) {
                l.closeTo = MANY;
            }
        }
        return l;
    });
};

const solveChronalCoordinates = (ip: string, totalDistance: number) => {
    const areas = parse(ip);
    const locations = getLocations(areas);
    const infiniteAreas = query(locations,
        filter(l => l.onEdge === true),
        countBy("closeTo"),
        cs => Object.keys(cs).map(k => +k)
    );
    const isFinite = (id: number) => !infiniteAreas.some(ia => ia === id);
    return [
        query(locations,
            filter(l => l.closeTo !== MANY && isFinite(l.closeTo)),
            countBy("closeTo"),
            cs => Object.keys(cs).reduce((acc, k) => Math.max(acc, cs[k]), 0)
        ),
        locations.filter(l => l.totalDistance < totalDistance).length
    ];
};

test("06", () => {
    expect(solveChronalCoordinates("06-test", 32)).toEqual([17, 16]);
    expect(solveChronalCoordinates("06", 10000)).toEqual([4976, 46462]);
});
