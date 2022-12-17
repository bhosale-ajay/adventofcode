import { getLines } from './util';

const getNext = <T>(input: T[]) => {
    let current = -1;
    return (): T => {
        current = current + 1;
        if (current === input.length) {
            current = 0;
        }
        return input[current];
    };
};
type Dictionary<T> = {
    [key: string]: T;
};
type Tunnel = Dictionary<boolean>;
type Part = [number, number];
type Shape = {
    parts: Part[];
    xp: number;
    eh: number;
};
const spotKey = (x: number, y: number) => `${x}:${y}`;
const makeRockShape = (parts: Part[], xp: number, eh: number): Shape => ({
    parts,
    xp,
    eh,
});
const shapes: Shape[] = [
    // prettier-ignore
    makeRockShape([[0,0],[1,0],[2,0],[3,0]],2,0),
    // prettier-ignore
    makeRockShape([[0,0],[-1,1],[1,1],[0,1],[0,2]],3,2),
    // prettier-ignore
    makeRockShape([[0,0],[1,0],[2,0],[2,1],[2,2]],2,2),
    // prettier-ignore
    makeRockShape([[0, 0],[0, 1],[0, 2],[0, 3]],2,3),
    // prettier-ignore
    makeRockShape([[0, 0],[1, 0],[0, 1],[1, 1]],2,1),
];

const canMove =
    (t: Tunnel, dx: number, dy: number) =>
    (rx: number, ry: number, shape: Shape): [boolean, number, number] => {
        const r = shape.parts.every(([ex, ey]) => {
            const px = ex + dx + rx;
            const py = ey + dy + ry;
            return (
                0 <= px &&
                px <= 6 &&
                0 <= py &&
                t[spotKey(px, py)] === undefined
            );
        });
        return r ? [r, rx + dx, ry + dy] : [r, rx, ry];
    };

// copied from rukke
const findPattern = (arr: number[]) => {
    const dp = arr.map(_ => 0);
    for (let i = 1; i < dp.length; i++) {
        let k = dp[i - 1];
        let done = false;
        while (!done) {
            if (arr[i] === arr[k]) {
                dp[i] = k + 1;
                done = true;
            } else if (k === 0) {
                dp[i] = 0;
                done = true;
            } else {
                k = dp[k - 1];
            }
        }
    }
    return arr.slice(0, arr.length - dp[dp.length - 1]);
};

const findSequence = (arr: number[]): [number[], number] => {
    const dp = Array.from({ length: arr.length + 1 }).map(_ =>
        Array(arr.length + 1).fill(0)
    );
    let seqLength = 0;
    let index = 0;
    arr.forEach((a, i) => {
        for (let j = i + 2; j <= arr.length; j++) {
            if (a === arr[j - 1] && dp[i][j - 1] < j - i) {
                dp[i + 1][j] = dp[i][j - 1] + 1;
                if (dp[i + 1][j] > seqLength) {
                    seqLength = dp[i + 1][j];
                    index = Math.max(i + 1, index);
                }
            } else {
                dp[i + 1][j] = 0;
            }
        }
    });
    return [arr.slice(index - seqLength, index), index - seqLength];
};

const solve = (fn: string, tryFor: number) => {
    const tunnel: Tunnel = {};
    const gasStream = getNext(getLines(fn, ''));
    const getNextShape = getNext(shapes);
    const canMoveLeft = canMove(tunnel, -1, 0);
    const canMoveRight = canMove(tunnel, 1, 0);
    const canMoveDown = canMove(tunnel, 0, -1);
    let height = -1;
    let [p1, p2] = [-1, -1];
    const heightPattern: number[] = [];
    for (let r = 1; r <= tryFor; r++) {
        const shape = getNextShape();
        let [isMP, rx, ry] = [true, shape.xp, height + 4];
        while (isMP) {
            const dir = gasStream();
            const airMovement = dir === '>' ? canMoveRight : canMoveLeft;
            [isMP, rx, ry] = airMovement(rx, ry, shape);
            [isMP, rx, ry] = canMoveDown(rx, ry, shape);
        }
        shape.parts.forEach(([ex, ey]) => {
            const px = ex + rx;
            const py = ey + ry;
            tunnel[spotKey(px, py)] = true;
        });
        const lastHeight = height;
        height = Math.max(height, ry + shape.eh);
        heightPattern.push(height - lastHeight);
        // for(let y = maxY + 3; 0 <= y; y--) {
        //     let line = "|";
        //     for(let x = 0; x <= 6; x++) {
        //         line = line + (tunnel[spotKey(x, y)] ? "#" : ".");
        //     }
        //     console.log(line + "|");
        // }
        // console.log("+-------+\n");
        if (r === 2022) {
            p1 = height + 1;
        }
    }
    const [sequence, seqIndex] = findSequence(heightPattern);
    const pattern = findPattern(sequence);
    const patternHeight = pattern.reduce((s, v) => s + v);
    const count = 1000000000000;
    const repetitions = Math.trunc((count - seqIndex) / pattern.length);
    const rocksPostSeq = (count - seqIndex) % pattern.length;
    const preAndPostSeqHeight = pattern
        .slice(0, rocksPostSeq)
        .concat(heightPattern.slice(0, seqIndex))
        .reduce((s, v) => s + v);
    p2 = preAndPostSeqHeight + repetitions * patternHeight;
    return [p1, p2];
};

test('17', () => {
    expect(solve('17-test', 2022)).toEqual([3068, 1514285714288]);
    expect(solve('17', 4000)).toEqual([3100, 1540634005751]);
});
