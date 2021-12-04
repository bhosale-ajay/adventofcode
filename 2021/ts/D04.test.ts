import { getLines } from './util';

type Draw = number[];
type Line = number[];
type Board = [lines: Line[], isComplete: boolean];

const transpose = (m: number[][]) => m[0].map((x, i) => m.map(x => x[i]));

const parseInput = (fn: string): [Draw, Board[]] => {
    const lines = getLines(fn);
    const draw = lines[0].split(',').map(n => +n);
    const boards: Board[] = [];
    let rowInput: number[][] = [];
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') {
            const colInput = transpose(rowInput);
            boards.push([rowInput.concat(colInput), false]);
            rowInput = [];
        } else {
            rowInput.push(
                line
                    .trim()
                    .split(/\s+/)
                    .map(n => +n)
            );
        }
    }
    return [draw, boards];
};

const play = ([draw, boards]: [Draw, Board[]]): [number, number] => {
    const scores: number[] = [];
    for (const d of draw) {
        for (let bi = 0; bi < boards.length; bi++) {
            const [board, isComplete] = boards[bi];
            if (isComplete) {
                continue;
            }
            for (let li = 0; li < board.length; li++) {
                const markIndex = board[li].indexOf(d);
                if (markIndex > -1) {
                    board[li].splice(markIndex, 1);
                }
            }
            if (board.some(line => line.length === 0)) {
                let sumOfUnmarkedNumbers = 0;
                for (let li = 0; li < 5; li++) {
                    sumOfUnmarkedNumbers =
                        sumOfUnmarkedNumbers +
                        board[li].reduce((acc, n) => acc + n, 0);
                }
                scores.push(sumOfUnmarkedNumbers * d);
                boards[bi][1] = true;
            }
        }
        // All boards are complete
        if (scores.length === boards.length) {
            break;
        }
    }
    return [scores[0], scores[scores.length - 1]];
};

test('04', () => {
    const ti = parseInput('04-test');
    const ai = parseInput('04');
    expect(play(ti)).toEqual([4512, 1924]);
    expect(play(ai)).toEqual([44736, 1827]);
});
