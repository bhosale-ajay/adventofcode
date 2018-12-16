import { ascendingBy, filter, first, query, sort, toArray } from "dotless";
import { Dictionary, getInput } from "./util";

const [E, G, OPEN] = ["E", "G", "."];
type Cave = string[][];
type Breaker = (ku: string | null) => boolean;
interface Unit {
    power: number;
    hit: number;
    x: number;
    y: number;
    type: string;
    alive: boolean;
}

const pathKey = (x: number, y: number) => `${x}_${y}`;
const parse = (ip: string) => getInput(ip).split("\n")
        .reduce(([cave, units], l, y) => {
            const [alive, power, hit] = [true, 3, 200];
            cave[y] = cave[y] === undefined ? [] : cave[y];
            l.split("").forEach((indicator, x) => {
                cave[y][x] = indicator;
                if (indicator === E || indicator === G) {
                    units.push({power, hit, x, y, type: indicator, alive});
                }
            });
            return [cave, units];
        }, [[], []] as [Cave, Unit[]]) as [Cave, Unit[]];
const sortUnits = sort<Unit>(ascendingBy("y"), ascendingBy("x"));
const getPlacesToMove = (cave: Cave, fx: number, fy: number, visited: Dictionary<boolean>, opponent: string) => {
    const result = [[fx, fy - 1], [fx - 1, fy], [fx + 1, fy], [fx, fy + 1]];
    return result.filter(([x, y]) => visited[pathKey(x, y)] !== true &&
                              (cave[y][x] === OPEN || cave[y][x] === opponent));
};
const move = (cave: Cave, unit: Unit) => {
    const queue = [[unit.x, unit.y, unit.x, unit.y]];
    const opponent = unit.type === E ? G : E;
    const visited: Dictionary<boolean> = {[pathKey(unit.x, unit.y)]: true};
    let firstPlace = true;
    while (true) {
        const current = queue.shift();
        if (current === undefined) {
            return true;
        }
        for (const [nx, ny] of getPlacesToMove(cave, current[0], current[1], visited, opponent)) {
            if (cave[ny][nx] === opponent) {
                const toX = current[2];
                const toY = current[3];
                if (toX === unit.x && toY === unit.y) {
                    return true;
                }
                cave[unit.y][unit.x] = ".";
                cave[toY][toX] = unit.type;
                unit.x = toX;
                unit.y = toY;
                return true;
            }
            visited[pathKey(nx, ny)] = true;
            queue.push([nx, ny,
                firstPlace ? nx : current[2],
                firstPlace ? ny : current[3]]);
        }
        firstPlace = false;
    }
};
const attack = (cave: Cave, units: Unit[], {x, y, type, power }: Unit) => {
    const opponentType = type === E ? G : E;
    const coords = [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]];
    const opponent = query(
        units,
        filter(u => u.alive && u.type === opponentType && coords.findIndex(([cx, cy]) => u.x === cx && u.y === cy) > -1),
        toArray,
        sort<Unit>(ascendingBy("hit"), ascendingBy("y"), ascendingBy("x")),
        first()
    );
    if (opponent != null) {
        opponent.hit = opponent.hit - power;
        if (opponent.hit < 1) {
            opponent.alive = false;
            cave[opponent.y][opponent.x] = ".";
            opponent.x = -1;
            opponent.y = -1;
            return opponentType;
        }
    }
    return null;
};
const draw = (roundCounter: number, cave: Cave, units: Unit[], power: number) => {
    let m = `\n After ${roundCounter} rounds, power ${power}:\n`;
    for (let y = 0; y < cave.length; y++) {
        let pm = "";
        for (let x = 0; x < cave[y].length; x++) {
            let char = " ";
            if (cave[y][x] === "E") {
                char = "\u001b[32mE\u001b[39m";
            } else if (cave[y][x] === "G") {
                char = "\u001b[33mG\u001b[39m";
            } else if (cave[y][x] === "#") {
                char = "#";
            }
            m = m + char;
            if (cave[y][x] === E || cave[y][x] === G) {
                pm = pm + cave[y][x] + "(" + (units.find(u => u.x === x && u.y === y) as any).hit + ") ";
            }
        }
        m = m + "\t" + pm + "\n";
    }
    console.clear();
    console.log(m);
    // to add delay to capture the video
    for (let i = 0; i < 10000; i++) {
        for (let j = 0; j < 10000; j++) {
            if (i === j) {
                j = i - j + j;
            }
        }
    }
};
const noOpponents = (units: Unit[], unit: Unit) => units.filter(u => u.alive && u.type !== unit.type).length === 0;
const simulate = (ip: string, display: boolean = false, breaker: Breaker = _ => false, power = 3) => {
    const [cave, units] = parse(ip);
    units.filter(u => u.type === E).forEach(u => u.power = power);
    let roundCounter = 0;
    rounds:
    while (true) {
        sortUnits(units);
        for (const unit of units) {
            if (!unit.alive) {
                continue;
            }
            if (noOpponents(units, unit)) {
                break rounds;
            }
            move(cave, unit);
            const killedUnitType = attack(cave, units, unit);
            if (breaker(killedUnitType)) {
                return [roundCounter, 0, 0, power, ""];
            }
        }
        roundCounter = roundCounter + 1;
        if (display) {
            draw(roundCounter, cave, units, power);
        }
    }
    if (display) {
        draw(roundCounter, cave, units, power);
    }
    const [sumOfUnits, winner] = units.filter(u => u.alive).reduce(([s, _], u) => [s + u.hit, u.type], [0, ""] as [number, string]);
    return [roundCounter, sumOfUnits, roundCounter * +sumOfUnits, power, winner];
};
const findOptimalPower = (ip: string, display: boolean = false) => {
    let optimalPower = 4;
    const breaker = (ku: string | null) => ku === E;
    while (true) {
        const [ , , outcome, power, winner] = simulate(ip, display, breaker, optimalPower);
        if (winner === E) {
            return [outcome, power];
        }
        optimalPower = optimalPower + 1;
    }
};

test("15 - Part 1", () => {
    expect(simulate("15-test1")).toEqual([47, 590, 27730, 3, G]);
    expect(simulate("15-test2")).toEqual([37, 982, 36334, 3, E]);
    expect(simulate("15-test3")).toEqual([46, 859, 39514, 3, E]);
    expect(simulate("15-test4")).toEqual([35, 793, 27755, 3, G]);
    expect(simulate("15-test5")).toEqual([54, 536, 28944, 3, G]);
    expect(simulate("15-test6")).toEqual([20, 937, 18740, 3, G]);
    expect(simulate("15")).toEqual([77, 2543, 195811, 3, G]);
});

test("15 - Part 2", () => {
    expect(findOptimalPower("15-test1")).toEqual([4988, 15]);
    expect(findOptimalPower("15-test3")).toEqual([31284, 4]);
    expect(findOptimalPower("15-test4")).toEqual([3478, 15]);
    expect(findOptimalPower("15-test5")).toEqual([6474, 12]);
    expect(findOptimalPower("15-test6")).toEqual([1140, 34]);
    expect(findOptimalPower("15")).toEqual([69867, 10]);
});

// console.log(findOptimalPower("15-test7", true));
