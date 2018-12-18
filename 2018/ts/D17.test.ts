import { matchesToArray } from "dotless";
import { Dictionary, getInput } from "./util";

const [CLAY, RESTING, FLOWING] = ["#", "~", "|"];
type Line = ["x" | "y", number, number, number];
type Data = Dictionary<string>;
interface Ground {
    area: Area;
    data: Data;
}
interface Area {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}
const regex = /(\w)=(\d+), (\w)=(\d+)..(\d+)/gm;
const keyMaker = (x: number, y: number) => `${y}_${x}`;
const parse = (ip: string) => {
    const keyProvider = {
        "x" : (a: number, b: number) => keyMaker(a, b),
        "y" : (a: number, b: number) => keyMaker(b, a)
    };
    const groundMinMax = {
        "x" : [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
        "y" : [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    };
    const data: Data = {};
    matchesToArray(getInput(ip), regex, m => ([m[1], +m[2], +m[4], +m[5]] as Line))
        .forEach(([axis, anchor, from, to]) => {
            const thisAxis = groundMinMax[axis];
            const thatAxis = groundMinMax[axis === "x" ? "y" : "x"];
            for (let pointer = from; pointer <= to; pointer++) {
                data[(keyProvider[axis])(anchor, pointer)] = CLAY;
            }
            thisAxis[0] = Math.min(thisAxis[0], anchor);
            thisAxis[1] = Math.max(thisAxis[1], anchor);
            thatAxis[0] = Math.min(thatAxis[0], from);
            thatAxis[1] = Math.max(thatAxis[1], to);
        });
    const area: Area = {
        minX: groundMinMax["x"][0],
        maxX: groundMinMax["x"][1],
        minY: groundMinMax["y"][0] - 1,
        maxY: groundMinMax["y"][1]
    };
    data[keyMaker(500, area.minY)] = "+";
    return { data, area } as Ground;
};
const isEmpty = (data: Data, [x, y]: number[]) => data[keyMaker(x, y)] === undefined;
const isWaterFlowing = (data: Data, [x, y]: number[]) => data[keyMaker(x, y)] === FLOWING;
const isWaterOrClay = (data: Data, [x, y]: number[]) => {
    const content = data[keyMaker(x, y)];
    return content === RESTING || content === CLAY;
};
const isClay = (data: Data, [x, y]: number[]) => data[keyMaker(x, y)] === CLAY;
const waterClogged = (data: Data, [x, y]: number[], direction: -1 | 1) => {
    while (true) {
        if (isClay(data, [x, y])) {
            return true;
        } else if (isWaterFlowing(data, [x, y])) {
            x = x + direction;
        } else {
            return false;
        }
    }
};
const restWater = (data: Data, [x, y]: number[], direction: -1 | 1) => {
    while (true) {
        if (isClay(data, [x, y])) {
            return;
        }
        fill(data, [x, y], RESTING);
        x = x + direction;
    }
};
const fill = (data: Data, [x, y]: number[], content: string) => {
    data[keyMaker(x, y)] = content;
};
const flowWater = (data: Data, maxY: number, current: number[], area: Area, display: boolean) => {
    const [x, y] = current;
    if (y >= maxY) {
        return;
    }
    if (display) {
        draw(data, area);
    }
    const left = [x - 1, y];
    const right = [x + 1, y];
    const down = [x, y + 1];

    if (isEmpty(data, down)) {
        fill(data, down, FLOWING);
        flowWater(data, maxY, down, area, display);
    }

    if (isWaterOrClay(data, down) && isEmpty(data, left)) {
        fill(data, left, FLOWING);
        flowWater(data, maxY, left, area, display);
    }

    if (isWaterOrClay(data, down) && isEmpty(data, right)) {
        fill(data, right, FLOWING);
        flowWater(data, maxY, right, area, display);
    }

    if (isWaterOrClay(data, down) && waterClogged(data, left, -1) && waterClogged(data, right, 1)) {
        restWater(data, left, -1);
        restWater(data, right, 1);
        fill(data, current, RESTING);
    }
};
const draw = (data: Data, area: Area) => {
    let message = "\n";
    for (let y = area.minY; y <= area.maxY; y++) {
        for (let x = area.minX - 1; x <= area.maxX; x++) {
            let content = data[keyMaker(x, y)];
            if (content === RESTING) {
                content = "\u001b[32m~\u001b[39m";
            } else if (content === FLOWING) {
                content = "\u001b[93m|\u001b[39m";
            }
            message = message + (content !== undefined ? content : " ");
        }
        message = message + "\n";
    }
    console.clear();
    console.log(message);
    for (let i = 0; i < 10000; i++) {
        for (let j = 0; j < 10000; j++) {
            if (i === j) {
                j = (2 * i) - j;
            }
        }
    }
};
const solve = (ip: string, display = false) => {
    const { data, area } = parse(ip);
    flowWater(data, area.maxY, [500, area.minY], area, display);
    if (display) {
        draw(data, area);
    }
    return Object.values(data).reduce(([water, resting], content) => {
        water = water + ((content === FLOWING || content === RESTING) ? 1 : 0);
        resting = resting + (content === RESTING ? 1 : 0);
        return [water, resting];
    }, [0, 0]);
};

test("17", () => {
    expect(solve("17-test1")).toEqual([57, 29]);
    expect(solve("17")).toEqual([31038, 25250]);
});

// solve("17-test1", true);
