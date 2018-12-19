import { Dictionary, getInput } from "./util";

type Item = "." | "|" | "#";
const [OPEN, TREES, LUMBERYARD]: Item[] = [".", "|", "#"];
type Landscape  = Item[][];
type Adjacent = Dictionary<number>;
type State = [Landscape, string, number];
const parse = (ip: string): State => {
    const l: Landscape = [];
    let [countOfTrees, countOfLumberyards, key] = [0, 0, ""];
    getInput(ip).split("\n").forEach((line: string, y: number) => {
        l[y] = l[y] === undefined ? [] : l[y];
        line.split("").forEach((item: string, x: number) => {
            l[y][x] = item as Item;
            key = key + item;
            countOfTrees = countOfTrees + (item === TREES ? 1 : 0);
            countOfLumberyards = countOfLumberyards + (item === LUMBERYARD ? 1 : 0);
        });
    });
    return [l, key, countOfTrees * countOfLumberyards];
};
const draw = (landscape: Landscape) => {
    let message = "\n";
    for (const line of landscape) {
        for (const item of line) {
            if (item === TREES) {
                message = message + `\u001b[32m${TREES}\u001b[39m`;
            } else if (item === LUMBERYARD) {
                message = message + `\u001b[93m${LUMBERYARD}\u001b[39m`;
            } else {
                message = message + item;
            }
        }
        message = message + "\n";
    }
    console.log(message);
};
const getAdjacent = (l: Landscape, x: number, y: number) => {
    const items = l.length;
    const result: Adjacent = {};
    for (let ny = y - 1; ny <= y + 1; ny++) {
        for (let nx = x - 1; nx <= x + 1; nx++) {
            if ((ny === y && nx === x) || ny < 0 || nx < 0 || ny === items || nx === items) {
                continue;
            }
            const item = l[ny][nx];
            result[item] = (result[item] === undefined ? 0 : result[item]) + 1;
        }
    }
    return result;
};
const openTransformer = (ads: Adjacent) => ads[TREES] >= 3 ? TREES : OPEN;
const treeTransformer = (ads: Adjacent) => ads[LUMBERYARD] >= 3 ? LUMBERYARD : TREES;
const lumberTransformer = (ads: Adjacent) => ads[LUMBERYARD] >= 1 && ads[TREES] >= 1 ? LUMBERYARD : OPEN;
const transformers = { [TREES] : treeTransformer, [OPEN]: openTransformer, [LUMBERYARD] : lumberTransformer};
const transform = (landscape: Landscape): State => {
    const updated: Landscape = [];
    let [countOfTrees, countOfLumberyards, key] = [0, 0, ""];
    for (let y = 0; y < landscape.length; y++) {
        updated[y] = updated[y] === undefined ? [] : updated[y];
        for (let x = 0; x < landscape[y].length; x++) {
            const adjacent = getAdjacent(landscape, x, y);
            const item = transformers[landscape[y][x]](adjacent);
            key = key + item;
            updated[y][x] = item;
            countOfTrees = countOfTrees + (item === TREES ? 1 : 0);
            countOfLumberyards = countOfLumberyards + (item === LUMBERYARD ? 1 : 0);
        }
    }
    return [updated, key, countOfTrees * countOfLumberyards];
};
const solve = (ip: string, iterations: number, display = false) => {
    let [landscape, key, value] = parse(ip);
    const keyHistory: Dictionary<number> = { [key] : 0 };
    const valueHistory: Dictionary<number> = { "0" : value };
    let counter = 1;
    while (counter <= iterations) {
        [landscape, key, value] = transform(landscape);
        if (keyHistory[key] !== undefined) {
            const loopStart = keyHistory[key];
            return valueHistory[loopStart + ((iterations - loopStart) % (counter - loopStart))];
        }
        keyHistory[key] = counter;
        valueHistory[counter] = value;
        counter = counter + 1;
    }
    if (display) {
        draw(landscape);
    }
    return value;
};

test("18", () => {
    expect(solve("18-test1", 10, false)).toBe(1147);
    expect(solve("18", 10, false)).toBe(646437);
    expect(solve("18", 1000000000, false)).toBe(208080);
});
