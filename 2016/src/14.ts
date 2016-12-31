import { assert } from "./util";
declare var require: any;

// tslint:disable-next-line:no-var-requires
const md5 = require("./../lib/md5");
const findIndex = (salt, stretchingCount = 0) => {
    const contenders = [];
    const winners = [];
    const hashHistory = [];
    let index = 0;
    while (winners.length < 64) {
        let hash = md5(salt + index);
        for (let stretchingCounter = 0; stretchingCounter < stretchingCount; stretchingCounter++ ) {
            hash = md5(hash);
        }
        hashHistory[index] = hash;
        const match = hash.match(/(\w)\1{2,2}/g);
        if (match) {
            contenders[index] = { index, key : match[0][1] };
        }
        index = index + 1;
        const contender = contenders[index - 1000];
        if (contender) {
            const regExp = new RegExp(`${contender.key}{5}`);
            const isWinner = hashHistory.slice(index - 999).some(h => regExp.test(h));
            if (isWinner) {
                winners.push(contender.index);
            }
        }
    }
    return winners[63];
};
assert(findIndex("abc"), 22728, "Day 14 - Set 1, Sample Input");
assert(findIndex("ngcjuoqr"), 18626, "Day 14 - Set 1, Actual Input");
// Slow - Uncomment to run part 2
// assert(findIndex("abc", 2016), 22551, "Day 14 - Set 2, Sample Input");
// assert(findIndex("ngcjuoqr", 2016), 20092, "Day 14 - Set 2, Actual Input");
