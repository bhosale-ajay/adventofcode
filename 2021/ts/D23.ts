import { ascendingBy } from 'dotless';

type Room = {
    target: string;
    start: number;
    end: number;
};

type State = {
    arrangement: string;
    energy: number;
};

const ascendingByEnergy = ascendingBy<State>(s => s.energy);
const sortStates = (states: State[]) => states.sort(ascendingByEnergy);

const smallerRooms: Room[] = [
    { target: 'A', start: 11, end: 12 },
    { target: 'B', start: 13, end: 14 },
    { target: 'C', start: 15, end: 16 },
    { target: 'D', start: 17, end: 18 },
];

const biggerRooms: Room[] = [
    { target: 'A', start: 11, end: 14 },
    { target: 'B', start: 15, end: 18 },
    { target: 'C', start: 19, end: 22 },
    { target: 'D', start: 23, end: 26 },
];

const EMPTY = '.';
const HALLWAY_SIZE = 10;
const energyNeed: Record<string, number> = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
};
const roomInfo: Record<string, [roomIndex: number, connectionAt: number]> = {
    A: [0, 2],
    B: [1, 4],
    C: [2, 6],
    D: [3, 8],
};

const canPush = (room: Room, arrangement: string) => {
    for (let i = room.end; i >= room.start; i--) {
        const occupant = arrangement[i];
        if (occupant === EMPTY) {
            return true;
        } else if (occupant !== room.target) {
            return false;
        }
    }
    return false;
};

const push = (room: Room, arrangement: string, amphipod: string) => {
    for (let i = room.end; i >= room.start; i--) {
        const occupant = arrangement[i];
        if (occupant === EMPTY) {
            return [i, (i - room.start + 1) * energyNeed[amphipod]];
        }
    }
    return undefined;
};

const pop = (
    room: Room,
    arrangement: string
): [string, number, number] | undefined => {
    for (let i = room.start; i <= room.end; i++) {
        const occupant = arrangement[i];
        if (occupant !== EMPTY) {
            return [occupant, i, (i - room.start + 1) * energyNeed[occupant]];
        }
    }
};

const canPop = (room: Room, arrangement: string) => {
    for (let i = room.end; i >= room.start; i--) {
        const occupant = arrangement[i];
        if (occupant !== EMPTY && occupant !== room.target) {
            return true;
        }
    }
    return false;
};

const moveFromRoomToHallway = (
    { arrangement, energy }: State,
    room: Room,
    from: number,
    to: number
): State => {
    const popResult = pop(room, arrangement);
    if (popResult === undefined) {
        throw 'Invalid State, pop result is undefined';
    }
    const [occupant, index, energyNeededToMoveFromRoom] = popResult;
    const updated = arrangement.split('');
    updated[index] = EMPTY;
    updated[to] = occupant;
    const energyNeededToMoveInHallway =
        Math.abs(from - to) * energyNeed[occupant];
    return {
        arrangement: updated.join(''),
        energy:
            energy + energyNeededToMoveFromRoom + energyNeededToMoveInHallway,
    };
};

const getNextStates = ({ arrangement, energy }: State, rooms: Room[]) => {
    const next: State[] = [];
    // Is it possible to move anyone from hall to room
    outer: for (let i = 0; i <= HALLWAY_SIZE; i++) {
        const occupant = arrangement[i];
        if (occupant === EMPTY) {
            continue;
        }
        const [ri, co] = roomInfo[occupant];
        const targetRoom = rooms[ri];
        if (!canPush(targetRoom, arrangement)) {
            continue;
        }
        const direction = i < co ? 1 : -1;
        for (let p = i + direction; p !== co; p = p + direction) {
            if (arrangement[p] !== EMPTY) {
                continue outer;
            }
        }
        const pushResult = push(targetRoom, arrangement, occupant);
        if (pushResult === undefined) {
            throw 'Invalid State, Push result is undefined';
        }
        const [roomLocation, energyNeededToMoveInRoom] = pushResult;
        const updated = arrangement.split('');
        updated[i] = EMPTY;
        updated[roomLocation] = occupant;
        const energyNeededToMoveInHallway =
            Math.abs(i - co) * energyNeed[occupant];
        next.push({
            arrangement: updated.join(''),
            energy:
                energy + energyNeededToMoveInRoom + energyNeededToMoveInHallway,
        });
    }

    if (next.length > 0) {
        return next;
    }

    // try removing from room and putting them in hallway
    for (let ri = 0; ri < rooms.length; ri++) {
        const room = rooms[ri];
        if (!canPop(room, arrangement)) {
            continue;
        }
        const [, co] = roomInfo[room.target];
        // on left side of hallway
        for (let p = co - 1; p >= 0; p--) {
            if (p === 2 || p === 4 || p === 6) {
                continue;
            }
            if (arrangement[p] !== EMPTY) {
                break;
            }
            next.push(
                moveFromRoomToHallway({ arrangement, energy }, room, co, p)
            );
        }
        // on right side of hallway
        for (let p = co + 1; p <= HALLWAY_SIZE; p++) {
            if (p === 4 || p === 6 || p === 8) {
                continue;
            }
            if (arrangement[p] !== EMPTY) {
                break;
            }
            next.push(
                moveFromRoomToHallway({ arrangement, energy }, room, co, p)
            );
        }
    }
    return next;
};

const organize = (
    state: State,
    rooms: Room[],
    limit: number,
    endState: string
) => {
    const queue: State[] = [state];
    const visited = new Set<string>();

    while (queue.length > 0) {
        const current = queue.shift() as State;
        if (visited.has(current.arrangement)) {
            continue;
        }
        visited.add(current.arrangement);
        if (current.arrangement === endState) {
            return current.energy;
        }
        for (const { arrangement, energy } of getNextStates(current, rooms)) {
            if (limit < energy || visited.has(arrangement)) {
                continue;
            }
            queue.push({ arrangement, energy });
        }
        sortStates(queue);
    }
    return -1;
};

const solve = (roomState: string, limit: number) => {
    const hallWay = '...........';
    const arrangement = hallWay + roomState;
    const energy = 0;
    const rooms = roomState.length > 8 ? biggerRooms : smallerRooms;
    const endState =
        hallWay + (roomState.length > 8 ? 'AAAABBBBCCCCDDDD' : 'AABBCCDD');
    return organize({ arrangement, energy }, rooms, limit, endState);
};

console.log(solve('BACDBCDA', 12600) === 12521);
console.log(solve('ADCDBABC', 18200) === 18170);
console.log(solve('BDDACCBDBBACDACA', 44200) === 44169);
console.log(solve('ADDDCCBDBBAABACC', 51210) === 50208);
