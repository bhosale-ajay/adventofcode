import { mapLine } from './util';

type ShapeChoice = 'Rock' | 'Paper' | 'Scissor';
type OppChoice = 'A' | 'B' | 'C';
type MyChoice = 'X' | 'Y' | 'Z';
type Line = [OppChoice, MyChoice];
const parseLine = (l: string) => l.split(' ') as Line;
const shapeScore: Record<ShapeChoice, number> = {
    Rock: 1,
    Paper: 2,
    Scissor: 3,
};
const DRAW_SCORE = 3;
const WINNER_SCORE = 6;
const oppChoiceMapping: Record<OppChoice, ShapeChoice> = {
    A: 'Rock',
    B: 'Paper',
    C: 'Scissor',
};
const myChoiceMapping: Record<MyChoice, ShapeChoice> = {
    X: 'Rock',
    Y: 'Paper',
    Z: 'Scissor',
};
const shapeWinsAgainst: Record<ShapeChoice, ShapeChoice> = {
    Rock: 'Scissor',
    Paper: 'Rock',
    Scissor: 'Paper',
};
const shapeLoseAgainst: Record<ShapeChoice, ShapeChoice> = {
    Rock: 'Paper',
    Paper: 'Scissor',
    Scissor: 'Rock',
};
const myChoiceMappingP2: Record<MyChoice, (s: ShapeChoice) => number> = {
    X: (oc: ShapeChoice) => shapeScore[shapeWinsAgainst[oc]],
    Y: (oc: ShapeChoice) => shapeScore[oc] + DRAW_SCORE,
    Z: (oc: ShapeChoice) => shapeScore[shapeLoseAgainst[oc]] + WINNER_SCORE,
};
const lineToScore = (l: string) => {
    const [oc, mc] = parseLine(l);
    const oppShapeChoice = oppChoiceMapping[oc];
    const myShapeChoice = myChoiceMapping[mc];
    const p1 =
        shapeScore[myShapeChoice] +
        (oppShapeChoice === myShapeChoice
            ? DRAW_SCORE
            : oppShapeChoice === shapeWinsAgainst[myShapeChoice]
            ? WINNER_SCORE
            : 0);
    const p2 = myChoiceMappingP2[mc](oppShapeChoice);
    return [p1, p2];
};
const solve = (ip: string) =>
    mapLine(ip, lineToScore).reduce(([a1, a2], [l1, l2]) => [a1 + l1, a2 + l2]);

test('02', () => {
    const t = solve('02-test');
    const a = solve('02');
    expect(t).toEqual([15, 12]);
    expect(a).toEqual([12855, 13726]);
});
