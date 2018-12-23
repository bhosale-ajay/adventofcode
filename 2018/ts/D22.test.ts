import { Dictionary } from "./util";
const [T, C, N] = [0, 1, 2];
const TOOLS = [[C, T], [C, N], [T, N]];
const graphKeyMaker = (x: number, y: number, tool: any) => `${y}_${x}_${tool}`;

const add = (set: Set<string>, key: string) => {
    if (set.has(key)) {
        return false;
    } else {
        set.add(key);
        return true;
    }
};

export const solve = (depth: number, tx: number, ty: number) => {
    const erosionLevels: Dictionary<number> = {};
    const getType = (x: number, y: number) => getErosionLevel(x, y) % 3;
    const getErosionLevel = (x: number, y: number): number => {
        const key = `${x}_${y}`;
        if (erosionLevels[key] !== undefined) {
            return erosionLevels[key];
        }
        const geologicIndex = ((x === 0 && y === 0) || (x === tx && y === ty)) ? 0 :
                    (y === 0) ? (16807 * x) :
                    (x === 0) ? (48271 * y) :
                    getErosionLevel(x, y - 1) * getErosionLevel(x - 1, y);
        const erosionLevel = (geologicIndex + depth) % 20183;
        erosionLevels[key] = erosionLevel;
        return erosionLevel;
    };
    let risk = 0;
    for (let y = 0; y <= ty; y++) {
        for (let x = 0; x <= tx; x++) {
            risk = risk + getType(x, y);
        }
    }
    const getAllowedTools = (x: number, y: number) => TOOLS[getType(x, y)];
    const queue: number[][] = [];
    const visited = new Set<string>();
    queue.push([0, 0, T, 0, 0]);
    visited.add(graphKeyMaker(0, 0, T));
    while (queue.length > 0) {
        const [x, y, tool, minutes, waitPeriod] = queue.shift() as number[];
        const visitKey = graphKeyMaker(x, y, tool);
        if (waitPeriod > 0) {
            if (waitPeriod !== 1 || add(visited, visitKey)) {
                queue.push([x, y, tool, minutes + 1, waitPeriod - 1]);
            }
            continue;
        }
        if (tx === x && ty === y && tool === T) {
            return [risk, minutes];
        }
        for (const [nx, ny] of [[x - 1, y], [x,  y + 1], [x + 1, y], [x, y - 1]]) {
            if (nx < 0 || ny < 0) {
                continue;
            }
            if (getAllowedTools(nx, ny).includes(tool) && add(visited, graphKeyMaker(nx, ny, tool))) {
                queue.push([nx, ny, tool, minutes + 1, 0]);
            }
        }
        const otherTool = getAllowedTools(x, y).filter(t => t !== tool)[0];
        queue.push([x, y, otherTool, minutes + 1, 6]);
    }
    return [risk, -1];
};

test("22", () => {
    expect(solve(510, 10, 10)).toEqual([114, 45]);
    expect(solve(7863, 14, 760)).toEqual([11462, 1054]);
});
