type Player = {
    position: number;
    score: number;
};
const getPlayer = (position: number) => ({ position, score: 0 });
const play = (p1p: number, p2p: number): number => {
    const players: Player[] = [getPlayer(p1p), getPlayer(p2p)];
    let rolls = 0;
    let firstPlayer = true;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const currentP = players[firstPlayer ? 0 : 1];
        const otherP = players[firstPlayer ? 1 : 0];
        for (let i = 0; i < 3; i++) {
            rolls = rolls + 1;
            currentP.position = (currentP.position + rolls) % 10;
        }
        currentP.score = currentP.score + currentP.position + 1;
        if (currentP.score >= 1000) {
            return otherP.score * rolls;
        }
        firstPlayer = !firstPlayer;
    }
};

const buildDiracDice = (): [number, number, number][] => {
    const result: [number, number, number][] = [];
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
                result.push([i, j, k]);
            }
        }
    }
    return result;
};

const diracDice = buildDiracDice();
type TakeTurn = (
    a: number,
    b: number,
    c: number,
    d: number
) => [number, number];
const cached = (action: TakeTurn): TakeTurn => {
    const cache: Record<string, [number, number]> = {};
    return (p1: number, p2: number, s1: number, s2: number) => {
        const cacheKey = `${p1}:${p2}:${s1}:${s2}`;
        if (cache[cacheKey] !== undefined) {
            return cache[cacheKey];
        }
        const result = action(p1, p2, s1, s2);
        cache[cacheKey] = result;
        return result;
    };
};

const playWithDiracDice = cached(
    (p1: number, p2: number, s1: number, s2: number) => {
        if (s1 >= 21) return [1, 0];
        if (s2 >= 21) return [0, 1];
        let totalP1Wins = 0;
        let totalP2Wins = 0;
        for (const [r1, r2, r3] of diracDice) {
            const p = (p1 + r1 + r2 + r3) % 10;
            const s = s1 + p + 1;
            const [p2Wins, p1Wins] = playWithDiracDice(p2, p, s2, s);
            totalP1Wins = totalP1Wins + p1Wins;
            totalP2Wins = totalP2Wins + p2Wins;
        }
        return [totalP1Wins, totalP2Wins];
    }
);

const solve = (p1: number, p2: number): [number, number] => {
    const r1 = play(p1 - 1, p2 - 1);
    const r2 = playWithDiracDice(p1 - 1, p2 - 1, 0, 0);
    return [r1, Math.max(...r2)];
};

test('21', () => {
    expect(solve(4, 8)).toEqual([739785, 444356092776315]);
    expect(solve(6, 1)).toEqual([929625, 175731756652760]);
});
