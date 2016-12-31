import { assert } from "./util";

const areOfSameType = (a, b) => a[2] === b[2];

const areConnected = (a, b) => a[0] === b[0] && a[1] === b[1];

function* combinationsToRemove(floor) {
    for (let thisCounter = 0; thisCounter < floor.length; thisCounter++) {
        const thisItem = floor[thisCounter];
        for (let thatCounter = thisCounter + 1; thatCounter < floor.length; thatCounter++) {
            const otherItem = floor[thatCounter];
            if (
                areOfSameType(thisItem, otherItem)
                    ||
                areConnected(thisItem, otherItem)
                ) {
                yield [thisItem, otherItem];
            }
        }
        yield [thisItem];
    }
};

const isSafe = (floor) => {
    const generators = floor.filter(i => i[2] === "G");
    const microchips = floor.filter(i => i[2] === "M");
    const totalGenerators = generators.length;
    const totalMicrochips = microchips.length;
    const connected = generators.filter(gen => microchips.some(chip => areConnected(gen, chip))).length;
    const unconnectedGenerators = totalGenerators - connected;
    const unpoweredMicrohips = totalMicrochips - connected;

    if ((totalGenerators === 0 && totalMicrochips === 0)
        ||
        (totalGenerators > 0 && totalMicrochips === 0)
        ||
        (totalGenerators === 0 && totalMicrochips > 0)
        ||
        ((connected > 0 || unconnectedGenerators > 0) && unpoweredMicrohips === 0)) {
        return true;
    } else {
        return false;
    }
};

function* getNextElevatorStops(elevatorAt, floors) {
    switch (elevatorAt) {
        case 3:
            yield 2;
            break;
        case 2:
            yield 3;
            if (!(floors[0].length === 0 && floors[1].length === 0)) {
                yield 1;
            }
            break;
        case 1:
            yield 2;
            if (floors[0].length > 0) {
                yield 0;
            }
            break;
        default:
            yield 1;
    }
};

const computeStateHash = (floors, elevatorAt) => {
    return floors.reduce((acc, floor, index) => {
        const generators = floor.filter(i => i[2] === "G");
        const microchips = floor.filter(i => i[2] === "M");
        const totalGenerators = generators.length;
        const totalMicrochips = microchips.length;
        const connected = generators.filter(gen => microchips.some(chip => areConnected(gen, chip))).length;
        const unconnectedGenerators = totalGenerators - connected;
        const unpoweredMicrohips = totalMicrochips - connected;
        return acc + "." + connected + "." + unconnectedGenerators + "." + unpoweredMicrohips;
    }, elevatorAt);
};

function* getNextStates(floors, elevatorAt, visited) {
    const currentFloor = floors[elevatorAt];
    for (const itemsToRemove of combinationsToRemove(currentFloor)) {
        const updatedCurrentFloor = currentFloor.filter(i => itemsToRemove.indexOf(i) === -1);
        if (isSafe(updatedCurrentFloor)) {
            for (const nextElevatorStop of getNextElevatorStops(elevatorAt, floors)) {
                const updatedNextFloor = (floors[nextElevatorStop]).concat(itemsToRemove);
                if (isSafe(updatedNextFloor)) {
                    const updatedFloors = [];
                    for (let floorCounter = 0; floorCounter < floors.length; floorCounter++) {
                        if (floorCounter === elevatorAt) {
                            updatedFloors[floorCounter] = updatedCurrentFloor;
                        } else if (floorCounter === nextElevatorStop) {
                            updatedFloors[floorCounter] = updatedNextFloor;
                        } else {
                            updatedFloors[floorCounter] = floors[floorCounter].slice(0);
                        }
                    }
                    const stateHash = computeStateHash(updatedFloors, nextElevatorStop);
                    if (visited.indexOf(stateHash) === -1) {
                        visited.push(stateHash);
                        yield({ floors : updatedFloors, elevatorAt : nextElevatorStop, parent : null});
                    }
                }
            }
        }
    }
};

const solve = (initialState) => {
    const floors = initialState.split("\n").map(line => line.split(",").filter(i => i.length > 0));
    const lastFloor = floors.length - 1;
    const count = floors.reduce((acc, f) => acc + f.length, 0);
    const visited = [computeStateHash(floors, 0)];
    const quque = [{floors, elevatorAt : 0, parent : null}];
    let current;

    whileloop:
    while (quque.length) {
        current = quque.shift();
        for (const nextState of getNextStates(current.floors, current.elevatorAt, visited)) {
            nextState.parent = current;
            if (nextState.floors[lastFloor].length === count) {
                current = nextState;
                break whileloop;
            } else {
                quque.push(nextState);
            }
        }
    }

    let stepsTaken = 0;
    while (current.parent) {
        current = current.parent;
        stepsTaken += 1;
    }
    return stepsTaken;
};
assert(solve("HIM,LIM\nHIG\nLIG\n"), 11, "Day 11 - Set 1, Sample Input");
assert(solve("PRG,PRM\nCOG,CUG,RUG,PLG\nCOM,CUM,RUM,PLM\n"), 33, "Day 11 - Set 2");
// assert(solve("ELG,ELM,DIG,DIM,PRG,PRM\nCOG,CUG,RUG,PLG\nCOM,CUM,RUM,PLM\n"), 57, "Day 11 - Set 2");
