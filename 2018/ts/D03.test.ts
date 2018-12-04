import { matchesToArray } from "dotless";
import { getInput } from "./util";

interface Dictionary<T> {
    [key: string]: T;
}

interface Claim {
    id: number;
    squares: string[];
}

const parse = (s: string) => s.split("\n")
        .map(l => matchesToArray(l, /\d+/g, m => +m[0]))
        .map(ns => ({ id: ns[0], squares: getSquares(ns)}));

const getSquares = ([_, tx, ty, width, height]: number[]) => {
    const result = [];
    for (let x = tx; x < tx + width; x++) {
        for (let y = ty; y < ty + height; y++) {
            result.push(`S${x}_${y}`);
        }
    }
    return result;
};

const claimSquares = ([fabric, disputed, candidates]: [Dictionary<number>, number, Claim[]], claim: Claim) => {
    let hasClaimForAllSquares = true;
    claim.squares.forEach(s => {
        const currentClaims = (fabric[s] | 0);
        if (currentClaims === 1) {
            disputed = disputed + 1;
            hasClaimForAllSquares = false;
        }
        fabric[s] = currentClaims + 1;
    });
    if (hasClaimForAllSquares) {
        candidates.push(claim);
    }
    return [fabric, disputed, candidates];
};

const sliceIt = (claims: Claim[]) => {
    const [fabric, disputed, candidates] = claims.reduce(claimSquares, [{}, 0, []]) as [Dictionary<number>, number, Claim[]];
    const undisputedClaim = candidates.find(c => c.squares.every(s => fabric[s] === 1));
    return [ disputed, undisputedClaim ? undisputedClaim.id : null ];
};

test("03", () => {
    const test01 = parse(`#1 @ 1,3: 4x4\n#2 @ 3,1: 4x4\n#3 @ 5,5: 2x2`);
    const puzzleInput = parse(getInput("03"));
    expect(sliceIt(test01)).toEqual([4, 3]);
    expect(sliceIt(puzzleInput)).toEqual([119572, 775]);
});
