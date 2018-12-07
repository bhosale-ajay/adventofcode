import { matchesToArray } from "dotless";
import { Dictionary, getInput } from "./util";

type Requirement = [Dictionary<string[]>, Dictionary<number>];

const regex = /Step (\w) must be finished before step (\w) can begin./gm;
const parse = (ip: string) => matchesToArray(getInput(ip), regex, m => ([m[1], m[2]]))
                                .reduce(recordRequirements, [{}, {}] as Requirement);

const recordRequirements = ([nodes, dependency]: Requirement, [parent, child]: [string, string]) => {
    nodes[parent] = nodes[parent] !== undefined ? nodes[parent] : [];
    nodes[child] = nodes[child] !== undefined ? nodes[child] : [];
    dependency[parent] = dependency[parent] | 0;
    dependency[child] = dependency[child] | 0;
    nodes[parent].push(child);
    dependency[child] = dependency[child] + 1;
    return [nodes, dependency] as Requirement;
};

const getNextNodes = (childNodes: string[], dependency: Dictionary<number>) => {
    const result = [];
    for (const childNode of childNodes) {
        dependency[childNode] = dependency[childNode] - 1;
        if (dependency[childNode] === 0) {
            result.push(childNode);
        }
    }
    return result;
};

const determineOrder = (input: string) => {
    const [nodes, dependency] = parse(input);
    const nodesToProcess = Object.keys(dependency).filter(n => dependency[n] === 0).sort();
    let path = "";
    while (nodesToProcess.length > 0) {
        const node = nodesToProcess.shift();
        if (node === undefined) {
            break;
        }
        path = path + node;
        nodesToProcess.push(...getNextNodes(nodes[node], dependency));
        nodesToProcess.sort();
    }
    return path;
};

class Worker {
    public task: string = ".";
    public lastTask: string = "";
    private counter: number = 0;

    constructor(private base: number) {
    }

    public assign(task: string) {
        this.task = task;
        this.counter = this.base + task.charCodeAt(0) - 64;
    }

    public work() {
        this.counter = this.counter - 1;
        if (this.counter === 0) {
            this.lastTask = this.task;
            this.task = ".";
        }
    }

    public get isBusy() {
        return this.counter > 0;
    }

    public get isFree() {
        return this.counter < 1;
    }

    public get justFinished() {
        return this.counter === 0;
    }
}

const findTimeToComplete = (input: string, numberOfWorkers: number, base: number) => {
    const [nodes, dependency] = parse(input);
    const workers: Worker[] = [];
    for (let i = 0; i < numberOfWorkers; i++) {
        workers.push(new Worker(base));
    }
    const nodesToProcess = Object.keys(dependency).filter(n => dependency[n] === 0).sort();
    let workInProgress = true;
    let timeTaken = 0;
    while (workInProgress || nodesToProcess.length > 0) {
        for (const freeWorker of workers.filter(w => w.isFree)) {
            const node = nodesToProcess.shift();
            if (node === undefined) {
                break;
            }
            freeWorker.assign(node);
        }
        workers.forEach(w => w.work());
        for (const worker of workers.filter(w => w.justFinished)) {
            nodesToProcess.push(...getNextNodes(nodes[worker.lastTask], dependency));
        }
        nodesToProcess.sort();
        workInProgress = workers.filter(w => w.isBusy).length > 0;
        timeTaken = timeTaken + 1;
    }
    return timeTaken;
};

test("07", () => {
    expect(determineOrder("07-test")).toEqual("CABDFE");
    expect(determineOrder("07")).toEqual("BDHNEGOLQASVWYPXUMZJIKRTFC");
    expect(findTimeToComplete("07-test", 2, 0)).toEqual(15);
    expect(findTimeToComplete("07", 5, 60)).toEqual(1107);
});
