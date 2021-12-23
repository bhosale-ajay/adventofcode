type Amphipod = {
    type: string;
    energyNeed: number;
};

type Space = {
    occupant: Amphipod | undefined;
    isOutsideRoom: boolean;
    connections: Space[];
};

type Room = {
    target: string;
    spaces: Space[];
};

const getAmphipod = (type: string, energyNeed: number) => ({
    type,
    energyNeed,
});

const AmphipodMap: Record<string, Amphipod> = {
    A: getAmphipod('A', 1),
    B: getAmphipod('B', 10),
    C: getAmphipod('C', 100),
    D: getAmphipod('D', 1000),
};

const getOccupant = (type: string): Amphipod | undefined =>
    type !== undefined ? AmphipodMap[type] : undefined;

const isRoomComplete = (room: Room) =>
    room.spaces.every(
        v => v.occupant !== undefined && v.occupant.type === room.target
    );

const isOrganized = (rooms: Room[]) => rooms.every(isRoomComplete);

const roomCount = (room: Room) =>
    room.spaces.filter(v => v.occupant !== undefined).length;

const push = (room: Room, amphipod: Amphipod) => {
    if (room.target !== amphipod.type) {
        return -1;
    }
    const roomSpaces = room.spaces;
    for (let i = roomSpaces.length - 1; i >= 0; i--) {
        const space = roomSpaces[i];
        if (space.occupant === undefined) {
            space.occupant = amphipod;
            return (i + 1) * amphipod.energyNeed;
        } else if (space.occupant.type !== room.target) {
            return -1;
        }
    }
    return -1;
};

const pop = (room: Room): [Amphipod, number] | undefined => {
    const firstFilled = room.spaces.findIndex(s => s.occupant !== undefined);
    if (firstFilled === -1) {
        return undefined;
    } else {
        const occupant = room.spaces[firstFilled].occupant as Amphipod;
        room.spaces[firstFilled].occupant = undefined;
        return [occupant, (firstFilled + 1) * occupant.energyNeed];
    }
};

const peek = (room: Room): Amphipod | undefined => {
    const firstFilled = room.spaces.findIndex(s => s.occupant !== undefined);
    return firstFilled === -1 ? undefined : room.spaces[firstFilled].occupant;
};

const getSpaces = (
    size: number,
    spacesOutsideRoom: number[],
    roomOccupants: string
): Space[] => {
    const result: Space[] = [];
    for (let i = 0; i < size; i++) {
        result.push({
            occupant: getOccupant(roomOccupants[i]),
            isOutsideRoom: spacesOutsideRoom.includes(i),
            connections: [],
        });
    }
    for (let i = 0; i < size; i++) {
        if (i > 0) {
            result[i].connections.push(result[i - 1]);
        }
        if (i < size) {
            result[i].connections.push(result[i + 1]);
        }
    }
    return result;
};

// #0123456789A#
// #...........#
// ###A#B#C#D###
const buildBurrow = (
    roomOccupants: [string, string, string, string]
): [Space[], Room[]] => {
    const roomConnections = [2, 4, 6, 8];
    const spaces: Space[] = getSpaces(11, roomConnections, '');
    const rooms: Room[] = [];
    const roomTargets = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < roomOccupants.length; i++) {
        const occupants = roomOccupants[i];
        const roomSpaces = getSpaces(occupants.length, [], occupants);
        rooms.push({
            target: roomTargets[i],
            spaces: roomSpaces,
        });
        const hallwayConnection = spaces[roomConnections[i]];
        const roomEntrance = rooms[i].spaces[0];
        roomEntrance.connections.push(hallwayConnection);
        hallwayConnection.connections.push(roomEntrance);
    }
    return [spaces, rooms];
};

const [_spaces, rooms] = buildBurrow(['BA', 'CD', 'BC', 'BA']);
const roomB = rooms[1];
console.log(roomCount(roomB) === 2);
console.log(peek(roomB)?.type === 'C');
const popBResult = pop(roomB);
console.log(popBResult?.[0].type === 'C');
console.log(popBResult?.[1] === 100);
console.log(roomCount(roomB) === 1);
console.log(push(roomB, AmphipodMap['C']) === -1);
console.log(push(roomB, AmphipodMap['B']) === -1);
const popDResult = pop(roomB);
console.log(popDResult?.[0].type === 'D');
console.log(popDResult?.[1] === 2000);
console.log(roomCount(roomB) === 0);
console.log(pop(roomB) === undefined);
console.log(push(roomB, AmphipodMap['B']) === 20);
console.log(roomCount(roomB) === 1);
console.log(push(roomB, AmphipodMap['B']) === 10);
console.log(roomCount(roomB) === 2);
console.log(push(roomB, AmphipodMap['B']) === -1);
console.log(roomCount(roomB) === 2);
console.log(isOrganized([roomB]));
