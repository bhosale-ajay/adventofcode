import { getInput } from "./util";

interface Area {
    name: number;
    x: number;
    y: number;
    size: number;
    onEdge: boolean;
}

const [MAX, NONE, MANY] = [Number.MAX_SAFE_INTEGER, -1, -1];

const parse = (s: string) => getInput(s).split("\n").map((l, name) => {
    const [x, y] = l.split(",").map(c => +c);
    return { name, x, y, size: 0, onEdge: false } as Area;
});

const findGridDimensions = (areas: Area[]) => areas.reduce(([minX, minY, maxX, maxY], {x, y}) => ([
    Math.min(minX, x), Math.min(minY, y), Math.max(maxX, x), Math.max(maxY, y)
]), [MAX, MAX, 0, 0]);

const solveChronalCoordinates = (ip: string, distanceCriteria: number) => {
    const areas = parse(ip);
    const [minX, minY, maxX, maxY] = findGridDimensions(areas);
    let reachable = 0;
    for (let lx = minX; lx <= maxX; lx++) {
        for (let ly = minY; ly <= maxY; ly++) {
            let [totalDistance, claimedDistance, closedTo] = [0, MAX, NONE];
            for (const {name, x, y} of areas) {
                const distance = Math.abs(lx - x) + Math.abs(ly - y);
                totalDistance = totalDistance + distance;
                if (distance < claimedDistance) {
                    claimedDistance = distance;
                    closedTo = name;
                } else if (distance === claimedDistance) {
                    closedTo = MANY;
                }
            }
            if (closedTo !== MANY) {
                areas[closedTo].size = areas[closedTo].size + 1;
                const onEdge = (lx === minX) || (ly === minY) || (lx === maxX) || (ly === maxY);
                areas[closedTo].onEdge = areas[closedTo].onEdge || onEdge;
            }
            if (totalDistance < distanceCriteria) {
                reachable = reachable + 1;
            }
        }
    }
    return [areas.filter(a => !a.onEdge).reduce((m, a) => Math.max(m, a.size), 0), reachable];
};

test("06", () => {
    expect(solveChronalCoordinates("06-test", 32)).toEqual([17, 16]);
    expect(solveChronalCoordinates("06", 10000)).toEqual([4976, 46462]);
});
