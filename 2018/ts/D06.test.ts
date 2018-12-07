import { each, generate, getInput, nestedEach } from "./util";

interface Location {
    x: number;
    y: number;
    onEdge: boolean;
    closeTo: number;
    distance: number;
    totalDistance: number;
}

interface Area {
    name: number;
    x: number;
    y: number;
    size: number;
    isInfinite: boolean;
}

const [MAX, NONE, MANY] = [Number.MAX_SAFE_INTEGER, -1, -1];

const parse = (s: string) => getInput(s).split("\n").map((l, name) => {
    const [x, y] = l.split(",").map(c => +c);
    return { name, x, y, size : 0, isInfinite : false } as Area;
});

const findGridDimensions = (areas: Area[]) => areas.reduce(([minX, minY, maxX, maxY], {x, y}) => ([
    Math.min(minX, x),
    Math.min(minY, y),
    Math.max(maxX, x),
    Math.max(maxY, y),
]), [MAX, MAX, 0, 0]);

const getLocations = ([minX, minY, maxX, maxY]: number[]) => generate(minX, maxX, minY, maxY, (x, y) => ({
    x, y, closeTo: NONE, distance: MAX, totalDistance: 0,
    onEdge : (x === minX) || (y === minY) || (x === maxX) || (y === maxY),
}));

const claimLocation = ({name, x, y}: Area, l: Location) => {
    const distance = Math.abs(x - l.x) + Math.abs(y - l.y);
    l.totalDistance = l.totalDistance + distance;
    if (distance < l.distance) {
        l.distance = distance;
        l.closeTo = name;
    } else if (distance === l.distance) {
        l.closeTo = MANY;
    }
};

const updateSize = (areas: Area[], location: Location) => {
    if (location.closeTo !== MANY) {
        const area = areas[location.closeTo];
        area.size = area.size + 1;
        area.isInfinite = area.isInfinite || location.onEdge;
    }
};

const solveChronalCoordinates = (ip: string, totalDistance: number) => {
    const areas = parse(ip);
    const locations = getLocations(findGridDimensions(areas));
    nestedEach(areas, locations, claimLocation);
    each(locations, l => updateSize(areas, l));
    return [
        areas.filter(a => !a.isInfinite).reduce((ms, a) => Math.max(a.size, ms), 0),
        locations.filter(l => l.totalDistance < totalDistance).length
    ];
};

test("06", () => {
    expect(solveChronalCoordinates("06-test", 32)).toEqual([17, 16]);
    expect(solveChronalCoordinates("06", 10000)).toEqual([4976, 46462]);
});
