import { matchesToArray } from 'dotless';
import { mapLine } from './util';

const exp = /-?\d+/g;
const [ORE_ROBOT, CLAY_ROBOT, OBSIDIAN_ROBOT, GEODE_ROBOT] = [0, 1, 2, 3];
const ROBOT_TYPES = [ORE_ROBOT, CLAY_ROBOT, OBSIDIAN_ROBOT, GEODE_ROBOT];
type Cost = [number, number, number];
type Blueprint = {
    costs: [Cost, Cost, Cost, Cost];
    robotLimit: [number, number, number];
};
type State = {
    timer: number;
    inventory: number[];
    bots: number[];
    geodes: number;
};

const initialState = (timer: number): State => ({
    timer,
    inventory: [0, 0, 0],
    bots: [1, 0, 0],
    geodes: 0,
});

const toBlueprint = ([
    _,
    oreO,
    clayO,
    obsO,
    obsC,
    geoO,
    geoOb,
]: number[]): Blueprint => ({
    costs: [
        [oreO, 0, 0],
        [clayO, 0, 0],
        [obsO, obsC, 0],
        [geoO, 0, geoOb],
    ],
    robotLimit: [Math.max(oreO, clayO, obsO, geoO), obsC, geoOb],
});

const parseLine = (l: string) =>
    toBlueprint(matchesToArray(l, exp, m => +m[0]));

const parse = (fn: string) => mapLine(fn, parseLine);

const canMake = (state: State, blueprint: Blueprint, type: number) => {
    return blueprint.costs[type].every((c, i) => c <= state.inventory[i]);
};

const makeRobot = (state: State, blueprint: Blueprint, type: number) => {
    const temp: State = {
        timer: state.timer,
        inventory: [...state.inventory],
        bots: [...state.bots],
        geodes: state.geodes,
    };
    while (!canMake(temp, blueprint, type) && 1 < temp.timer) {
        temp.inventory = temp.inventory.map((i, ii) => i + temp.bots[ii]);
        temp.timer = temp.timer - 1;
    }
    temp.timer = temp.timer - 1;
    const cost = blueprint.costs[type];
    temp.inventory = temp.inventory.map(
        (i, ii) => i - cost[ii] + temp.bots[ii]
    );
    if (type === GEODE_ROBOT) {
        temp.geodes = temp.geodes + temp.timer;
    } else {
        temp.bots[type] = temp.bots[type] + 1;
    }
    return temp;
};

const findMaxGeodes = (
    state: State,
    blueprint: Blueprint,
    limits: number[]
): number => {
    if (state.timer === 1) {
        return state.geodes;
    }
    let best = state.geodes;
    for (const type of ROBOT_TYPES) {
        if (
            state.timer < limits[type] ||
            (type === ORE_ROBOT && state.bots[CLAY_ROBOT] > 1) ||
            blueprint.robotLimit[type] < state.bots[type]
        ) {
            continue;
        }
        const nextState = makeRobot(state, blueprint, type);
        if (nextState.timer === 0) {
            continue;
        }
        const score = findMaxGeodes(nextState, blueprint, limits);
        best = Math.max(best, score);
    }
    return best;
};

const solve = (fn: string) => {
    const blueprints = parse(fn);
    let [p1, p2] = [0, 1];
    for (let i = 0; i < blueprints.length; i++) {
        const score = findMaxGeodes(
            initialState(24),
            blueprints[i],
            [16, 6, 3, 2]
        );
        p1 = p1 + score * (i + 1);
    }
    for (let i = 0; i < blueprints.length && i < 3; i++) {
        const score = findMaxGeodes(
            initialState(32),
            blueprints[i],
            [24, 12, 8, 2]
        );
        p2 = p2 * score;
    }
    return [p1, p2];
};

test('19', () => {
    expect(solve('19-test')).toEqual([33, 3472]);
    expect(solve('19')).toEqual([1650, 5824]);
});
