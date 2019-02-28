import { ascendingBy, count, each, matchesToArray, query, sort, take } from "dotless";
import { Dictionary, getInput } from "./util";

const [COMPLETE, PROCESSING, READY, WAITING] = [0, 1, 2, 3];
interface Step {
    name: string;
    children: Step[];
    dependsOn: number;
    status: number; // 0 - Complete, 1 - In Process, 2 - Ready, 3 - Waiting
    cost: number;
}

const regex = /Step (\w) must be finished before step (\w) can begin./gm;
const parse = (ip: string, base: number) => Object.values(matchesToArray(getInput(ip), regex, m => ([m[1], m[2]]))
                                .reduce((steps, si) => recordRequirements(steps, si, base), {} as Dictionary<Step>));

const createStep = (name: string, base: number): Step => {
    return { name, children: [], dependsOn : 0, status : READY, cost : base + name.charCodeAt(0) - 64};
};

const recordRequirements = (steps: Dictionary<Step>, [parent, child]: string[], base: number) => {
    steps[parent] = steps[parent] !== undefined ? steps[parent] : createStep(parent, base);
    steps[child] = steps[child] !== undefined ? steps[child] : createStep(child, base);
    steps[parent].children.push(steps[child]);
    steps[child].dependsOn = steps[child].dependsOn + 1;
    steps[child].status = WAITING;
    return steps;
};

const reduceDependency = (step: Step) => {
    step.dependsOn = step.dependsOn - 1;
    if (step.dependsOn === 0) {
        step.status = READY;
    }
};

const reduceCost = (step: Step) => {
    step.status = PROCESSING;
    step.cost = step.cost - 1;
    if (step.cost === 0) {
        step.status = COMPLETE;
        step.children.forEach(reduceDependency);
    }
};

const findTimeToComplete = (input: string, numberOfWorkers: 2 | 5, base: 0 | 60) => {
    const steps = parse(input, base);
    let [completedSteps, timeTaken] = [0, 0];
    while (completedSteps < steps.length) {
        completedSteps = completedSteps + query(
            // Take all steps which are in processing state or ready state
            steps.filter(s => s.status === PROCESSING || s.status === READY),
            // order them to pick steps in processing first and then ready steps based on name
            sort(ascendingBy("status"), ascendingBy("name")),
            // pick steps for processing based on number of workers
            take(numberOfWorkers),
            // reduce cost, free child nodes
            each(reduceCost),
            // take count of completed during this second
            count(s => s.status === COMPLETE)
        );
        timeTaken = timeTaken + 1;
    }
    return timeTaken;
};

test("07 Part 2, via dotless", () => {
    expect(findTimeToComplete("07-test", 2, 0)).toEqual(15);
    expect(findTimeToComplete("07", 5, 60)).toEqual(1107);
});
