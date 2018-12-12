import { Dictionary, getInput } from "./util";

const parse = (ip: string) => {
    const lines = getInput(ip).split("\n");
    const [ , initialState] = lines[0].split(": ");
    lines.shift();
    lines.shift();
    const combinations = lines.map(l => l.split(" => ")).reduce((acc, [c, r]) => {
        acc[c] = r;
        return acc;
    }, {} as Dictionary<string>);
    return { initialState, combinations};
};

const growPlants = (ip: string, generationsToWatch: number) => {
    const { initialState, combinations } = parse(ip);
    let [pots, grownPots] = [initialState, ""];
    let [generation, sum, lastSum, lastDiff, streak] = [0, 0, 0, 0, 0];
    while (generation < generationsToWatch) {
        generation = generation + 1;
        pots = "...." + pots + "....";
        grownPots = "";
        sum = 0;
        for (let i = 2; i <= pots.length - 3; i++) {
            const pot = combinations[pots.substr(i - 2, 5)];
            if (pot === "#") {
                sum = sum + i + ((generation * -2) - 2);
            }
            grownPots = grownPots + pot;
        }
        pots = grownPots;
        if (sum - lastSum === lastDiff) {
            streak = streak + 1;
            if (streak === 3) {
                return (generationsToWatch - generation) * lastDiff + sum;
            }
        } else {
            lastDiff = sum - lastSum;
            streak = 0;
        }
        lastSum = sum;
    }
    return sum;
};

test("12", () => {
    expect(growPlants("12", 20)).toEqual(2542);
    expect(growPlants("12", 50000000000)).toEqual(2550000000883);
});
