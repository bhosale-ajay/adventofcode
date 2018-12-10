import { matchesToArray } from "dotless";
import { Dictionary, getInput } from "./util";

type Point = [number, number, number, number];
const [X_AXIS, Y_AXIS]  = [0, 1];
const re = /position=<\s*(-*\d+),\s*(-*\d+)>\svelocity=<\s*(-*\d+),\s*(-*\d+)/g;
const parse = (ip: string) => matchesToArray(getInput(ip), re, m => [+m[1], +m[2], +m[3], +m[4]]) as Point[];

const findCorners = (ps: Point[]) => ps.reduce(([leftMost, topMost, rightMost, bottomMost], p) => ([
    leftMost[0] < p[0] ? leftMost : p,
    topMost[1] < p[1] ? topMost : p,
    rightMost[0] > p[0] ? rightMost : p,
    bottomMost[1] > p[1] ? bottomMost : p
]), [ps[0], ps[0], ps[0], ps[0]]);

const positionAfterN = (p: Point, n: number) => [p[0] + (n * p[2]), p[1] + (n * p[3])];

const renderScreen = (points: Point[], [x1, y1, x2, y2]: number[], current: number, to: number) => {
    const pointPositions = points.map(p => positionAfterN(p, current)).reduce((pp, [px, py]) => {
        pp[`${px}_${py}`] = true;
        return pp;
    }, {} as Dictionary<boolean>);
    let message = `After ${current} seconds:\n`;
    for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
            message = message + (pointPositions[`${x}_${y}`] ? "#" : ".");
        }
        message = message + "\n";
    }
    console.clear();
    console.log(message);
    if (current < to) {
        setTimeout(_ => renderScreen(points, [x1, y1, x2, y2], current + 1, to), 800);
    }
};

const findSecondsToCross = (axis: number, p1: Point, p2: Point) => Math.ceil((p1[axis] - p2[axis]) / ( p2[axis + 2] - p1[axis + 2]));

const findMessage = (ip: string) => {
    const points = parse(ip);
    const [leftMost, topMost, rightMost, bottomMost] = findCorners(points);
    const secondsX = findSecondsToCross(X_AXIS, leftMost, rightMost);
    const secondsY = findSecondsToCross(Y_AXIS, topMost, bottomMost);
    const p1 = positionAfterN(leftMost, secondsX);
    const p2 = positionAfterN(topMost, secondsY);
    const areaOfInterest = [ p1[0] - 40, p2[1] - 10,
                             p1[0] + 40, p2[1] + 10];
    const to = Math.min(secondsX, secondsY);
    const from = Math.max(to - 10, 0);
    renderScreen(points, areaOfInterest, from, to);
};

findMessage("10");
