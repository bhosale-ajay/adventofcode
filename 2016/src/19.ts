import { assert, LinkedList } from "./util";

const input = 3014603;
const prepareList = (numberOfElfs) => {
    const list = new LinkedList();
    let target = null;
    const targetIndex = Math.floor(numberOfElfs / 2) + 1;
    for (let index = 1; index <= numberOfElfs; index ++) {
        list.append({index});
        if (index === targetIndex) {
            target = list.firstNode.prev;
        }
    }
    return [list, target];
};
const winnerOfStealFromLeft = (numberOfElfs) => {
    const [list] = prepareList(numberOfElfs);
    let current = list.firstNode;
    while (list.count > 1) {
        let next = current.next;
        list.remove(next);
        current = current.next;
    }
    return list.firstNode.index;
};
const winnerOfStealFromAcross = (numberOfElfs) => {
    let [list, target] = prepareList(numberOfElfs);
    while (list.count > 1) {
        let temp = target.next;
        if (list.count % 2 === 1) {
            temp = temp.next;
        }
        list.remove(target);
        target = temp;
    }
    return list.firstNode.index;
};
assert(winnerOfStealFromLeft(input), 1834903, "Day 19 - Set 1");
assert(winnerOfStealFromAcross(input), 1420280, "Day 19 - Set 2");

// Smart Solution
// Based on - https://www.youtube.com/watch?v=uCsD3ZGzMgE
// Part 1
const stealFromLeftWinner = parseInt(((input).toString(2).substr(1) + "1"), 2);
assert(stealFromLeftWinner, 1834903, "Day 19 - Set 1");
// Part 2
const winnerOfStealFromAcrossSMART = (countOfElfs) => {
    let powerOfThree = 1;
    while (powerOfThree * 3 < countOfElfs) {
        powerOfThree *= 3;
    }
    if (countOfElfs === powerOfThree) {
        return countOfElfs;
    } else {
        return countOfElfs - powerOfThree + Math.max(countOfElfs - 2 * powerOfThree, 0);
    }
};
const expectedResult = [0,
                1,
                1, 3,
                1, 2, 3, 5, 7, 9,
                1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27,
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                   21, 22, 23, 24, 25, 26, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47,
                   49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81];

for (let testInput = 1; testInput <= 81; testInput++) {
   assert(winnerOfStealFromAcross(testInput), expectedResult[testInput], "Day 19 - Set 2 - BF - " + testInput);
   assert(winnerOfStealFromAcrossSMART(testInput), expectedResult[testInput], "Day 19 - Set 2 - Smart - " + testInput);
}
assert(winnerOfStealFromAcrossSMART(input), 1420280, "Day 19 - Set 2");
