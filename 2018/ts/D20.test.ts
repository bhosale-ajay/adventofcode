import { Dictionary, getInput } from "./util";
const [WALL, N, E, W, S] = [null, "N", "E", "W", "S"];
type Direction = "N" | "E" | "W" | "S";
const xFactor = {N :  0, E : 1, W : -1, S: 0};
const yFactor = {N : -1, E : 0, W :  0, S: 1};
const OppDirection = {N : S, E : W, W : E, S: N};
interface Room {
    x: number;
    y: number;
    key: string;
    N: Room | null;
    E: Room | null;
    W: Room | null;
    S: Room | null;
}
type Area = Dictionary<Room>;
const keyMaker = (x: number, y: number) => `${y}_${x}`;
const createRoom = (x: number, y: number): Room => ({ x, y, key: keyMaker(x, y), N: WALL, E: WALL, W: WALL, S: WALL });
const createConnection = (room: Room, direction: Direction, area: Area) => {
    const x = room.x + xFactor[direction];
    const y = room.y + yFactor[direction];
    const key = keyMaker(x, y);
    const oppDirection = OppDirection[direction] as Direction;
    if (area[key] === undefined) {
        area[key] = createRoom(x, y);
    }
    const otherRoom = area[key];
    room[direction] = otherRoom;
    otherRoom[oppDirection] = room;
    return otherRoom;
};
const parseMap = (ip: string) => {
    let room = createRoom(0, 0);
    const area: Area = { [keyMaker(0, 0)]: room };
    const stack: Room[] = [];
    for (const i of getInput(ip).split("")) {
        if (i === N || i === E || i === W || i === S) {
            room = createConnection(room, i as Direction, area);
        } else if (i === "(") {
            stack.push(room);
        } else if (i === ")") {
            room = stack.pop() as Room;
        } else if (i === "|") {
            room = stack[stack.length - 1];
        }
    }
    return area[keyMaker(0, 0)];
};
const findFurthestRoom = (ip: string) => {
    const root = parseMap(ip);
    const queue: Array<[Room, number]> = [[root, 0]];
    const visited = new Set<string>();
    let [maxDistance, count] = [0, 0];
    while (queue.length > 0) {
        const [current, distance] = queue.shift() as [Room, number];
        visited.add(current.key);
        maxDistance = distance;
        if (1000 <= distance) {
            count = count + 1;
        }
        for (const d of [N, E, W, S]) {
            const nextRoom = current[d as Direction];
            if (nextRoom !== null && !visited.has(nextRoom.key)) {
                queue.push([nextRoom, distance + 1]);
            }
        }
    }
    return [maxDistance, count];
};

test("20", () => {
    expect(findFurthestRoom("20-test1")).toEqual([3, 0]);
    expect(findFurthestRoom("20-test2")).toEqual([10, 0]);
    expect(findFurthestRoom("20-test3")).toEqual([18, 0]);
    expect(findFurthestRoom("20-test4")).toEqual([23, 0]);
    expect(findFurthestRoom("20-test5")).toEqual([31, 0]);
    expect(findFurthestRoom("20")).toEqual([3527, 8420]);
});
