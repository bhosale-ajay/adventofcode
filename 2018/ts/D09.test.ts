import { Dictionary, LinkedList } from "./util";

const playMarbles = (numberOfPlayers: number, marbles: number, factor: number = 1): number => {
    const circle = new LinkedList<number>();
    const playerScores: Dictionary<number> = {};
    let current = circle.init(0);
    let currentPlayer = 1;
    for (let i = 1; i <= numberOfPlayers; i += 1) {
        playerScores[i] = 0;
    }
    for (let marble = 1; marble <= marbles * factor; marble++) {
        if (marble % 23 === 0) {
            const bonus = current.prev.prev.prev.prev.prev.prev.prev;
            current = bonus.next;
            playerScores[currentPlayer] = playerScores[currentPlayer] + marble + bonus.value;
            circle.remove(bonus);
        } else {
            current = circle.insertAfter(current.next, marble);
        }
        currentPlayer = currentPlayer === numberOfPlayers ? 1 : currentPlayer + 1;
    }
    return Math.max(...Object.values(playerScores));
};

test("09", () => {
    expect(playMarbles(9, 25)).toEqual(32);
    expect(playMarbles(10, 1618)).toEqual(8317);
    expect(playMarbles(13, 7999)).toEqual(146373);
    expect(playMarbles(17, 1104)).toEqual(2764);
    expect(playMarbles(21, 6111)).toEqual(54718);
    expect(playMarbles(30, 5807)).toEqual(37305);
    expect(playMarbles(459, 71320, 1)).toEqual(375414);
    expect(playMarbles(459, 71320, 100)).toEqual(3168033673);
});
