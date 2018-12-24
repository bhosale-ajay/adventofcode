import { descendingBy, first, matchesToArray, query, sort } from "dotless";
import { getInput } from "./util";
interface Group {
    units: number;
    hitPoints: number;
    weakTo: string[];
    immuneTo: string[];
    attack: number;
    damage: string;
    initiative: number;
    claimed: boolean;
    target: Group | null;
    enemy: Group[];
}
const regex = /(\d+) units each with (\d+) hit points\s*(\([^\)]*\)|\s)\s*with an attack that does (\d+) (\w+) damage at initiative (\d+)/g;
const iRegex = /immune to ([\w\s,]*)/g;
const wRegex = /weak to ([\w\s,]*)/g;
const parse = (ip: string) => {
    const parts = getInput(ip).split(":");
    const immuneGroups = matchesToArray(parts[1], regex, m => createGroup(+m[1], +m[2], m[3], +m[4], m[5], +m[6]));
    const infectionGroups = matchesToArray(parts[2], regex, m => createGroup(+m[1], +m[2], m[3].trim(), +m[4], m[5], +m[6]));
    return [immuneGroups, infectionGroups];
};
const createGroup = (units: number, hitPoints: number, weakImmune: string, attack: number, damage: string, initiative: number) => {
    let immuneTo: string[] = [];
    let weakTo: string[] = [];
    if (weakImmune !== "") {
        immuneTo = matchesToArray(weakImmune, iRegex, m => m[1].split(", "))[0];
        immuneTo = immuneTo === undefined ? [] : immuneTo;
        weakTo = matchesToArray(weakImmune, wRegex, m => m[1].split(", "))[0];
        weakTo = weakTo === undefined ? [] : weakTo;
    }
    const claimed = false;
    const target = null;
    return { units, hitPoints, attack, damage, initiative, immuneTo, weakTo, claimed, target } as Group;
};
const possibleDamage = (attacker: Group, target: Group) => (attacker.attack * attacker.units) * (target.weakTo.includes(attacker.damage) ? 2 : 1);
const isAlive = (g: Group) => g.units > 0;
const clear = (group: Group, enemy: Group[]) => {
    group.claimed = false;
    group.target = null;
    group.enemy = enemy;
};
const setTarget = (attacker: Group) => {
    const target = query(attacker.enemy.filter(e => !e.immuneTo.includes(attacker.damage) && !e.claimed),
                        sort<Group>(
                            descendingBy(e => possibleDamage(attacker, e)),
                            descendingBy(e => e.attack * e.units),
                            descendingBy(e => e.initiative),
                        ),
                        first());
    if (target !== null) {
        target.claimed = true;
    }
    attacker.target = target;
    return attacker;
};
const targetSelectionSorter = (groups: Group[]) => sort<Group>(descendingBy(g => g.attack * g.units), descendingBy(g => g.initiative))(groups);
const attackSelectionSorter = (groups: Group[]) => sort<Group>(descendingBy(g => g.initiative))(groups);
const attackEnemy = (unitsKilled: number, attacker: Group) => {
    const target = attacker.target;
    if (attacker.units <= 0 || target === null) {
        return unitsKilled;
    }
    const killed = Math.min(Math.floor(possibleDamage(attacker, target) / target.hitPoints), target.units);
    target.units = target.units - killed;
    return unitsKilled + killed;
};
const simulate = (ip: string, boost: number = 0) => {
    const [immuneGroups, infectionGroups] = parse(ip);
    if (boost > 0) {
        immuneGroups.forEach(g => g.attack = g.attack + boost);
    }
    let aliveImmuneGroups = immuneGroups.filter(isAlive);
    let aliveInfectionGroups = infectionGroups.filter(isAlive);
    while (aliveImmuneGroups.length > 0 && aliveInfectionGroups.length > 0) {
        aliveImmuneGroups.forEach(g => clear(g, aliveInfectionGroups));
        infectionGroups.forEach(g => clear(g, aliveImmuneGroups));
        const everyone = targetSelectionSorter([...aliveImmuneGroups, ...aliveInfectionGroups]).map(setTarget);
        const killed = attackSelectionSorter(everyone).reduce(attackEnemy, 0);
        if (killed === 0) {
            return [0, 0];
        }
        aliveImmuneGroups = aliveImmuneGroups.filter(isAlive);
        aliveInfectionGroups = aliveInfectionGroups.filter(isAlive);
    }
    if (aliveImmuneGroups.length > 0) {
        return [1, aliveImmuneGroups.reduce((au, g) => g.units + au, 0)];
    } else {
        return [2, aliveInfectionGroups.reduce((au, g) => g.units + au, 0)];
    }
};
const findBoostToWin = (ip: string) => {
    let boost = 1;
    while (true) {
        const [winner, units] = simulate(ip, boost);
        if (winner === 1) {
            return [boost, units];
        }
        boost = boost + 1;
    }
};
test("24", () => {
    expect(simulate("24-test1")).toEqual([2, 5216]);
    expect(simulate("24")).toEqual([2, 33551]);
    expect(findBoostToWin("24-test1")).toEqual([1570, 51]);
    expect(findBoostToWin("24")).toEqual([77, 760]);
});
