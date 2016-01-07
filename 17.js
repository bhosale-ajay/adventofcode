var testInput = `20
15
10
5
5`;
var mainInput = `11
30
47
31
32
36
3
1
5
3
32
36
15
11
46
26
28
1
19
3`;

function map(convertor) {
    return function* (source) {
        for (var item of source) {
            yield convertor(item);
        }
    }
}

function where(predicate) {
    return function* (source) {
        for (var item of source) {
            if (predicate(item)) {
                yield item;
            }
        }
    };
}

function action(action) {
    return function* (source) {
        for (var item of source) {
            action(item);
            yield item;
        }
    };
}

function forEach(action) {
    return function (source) {
        for (var item of source) {
            action(item);
        }
    };
}

function toArray(source) {
    var result = [];
    for (var item of source) {
        result.push(item);
    }
    return result;
}

function count(source) {
    var counter = 0;
    for (var item of source) {
        counter++;
    }
    return counter;
}

function query(chain) {
    return chain.reduce((a, f) => f(a));
}

function getMaxCombination(containers, eggnogToFill) {
    var capacity = 0;
    var maxCombination = 0;
    var containerCount = containers.length;
    for (var i = 0; i < containerCount; i++) {
        capacity += containers[i];
        maxCombination += Math.pow(2, containerCount - i - 1);
        if (capacity > eggnogToFill) {
            break;
        }
    }
    return maxCombination;
}

function getMinCombination(containers, eggnogToFill) {
    var capacity = 0;
    var minCombination = 0;
    var containerCount = containers.length;
    for (var i = containerCount - 1; i >= 0; i--) {
        capacity += containers[i];
        if (capacity > eggnogToFill) {
            break;
        }
        minCombination += Math.pow(2, containerCount - i - 1);
    }
    return minCombination;
}

function* getCombinations(min, max, expectedLength) {
    for (var combination = min; combination < max; combination++) {
        var result = combination.toString(2);
        while (result.length < expectedLength) {
            result = "0" + result;
        }
        yield result;
    }
}

function getCapcityCalculator(containers) {
    return function (containerCombination) {
        var result = 0;
        var containerIndex = 0;
        for (var containerIndicator of containerCombination) {
            if (containerIndicator == "1") {
                result += containers[containerIndex];
            }
            containerIndex = containerIndex + 1;
        }
        return result;
    }
}

function capcityIs(limit, containers) {
    var capcityCalculator = getCapcityCalculator(containers);
    return function (containerCombination) {
        return capcityCalculator(containerCombination) == limit;
    }
}


function findCombinations(containersData, eggnogToFill) {
    var containers = containersData.split(/\r|\n/g).map(c => parseInt(c)).sort((x, y) => x > y ? -1 : 1);
    var maxCombination = getMaxCombination(containers, eggnogToFill);
    var minCombination = getMinCombination(containers, eggnogToFill);

    var result = query([
        getCombinations(minCombination, maxCombination, containers.length),
        where(capcityIs(eggnogToFill, containers)),
        count
    ]);

    return result;
}

function findBestCombinations(containersData, eggnogToFill) {
    var containers = containersData.split(/\r|\n/g).map(c => parseInt(c)).sort((x, y) => x > y ? -1 : 1);
    var maxCombination = getMaxCombination(containers, eggnogToFill);
    var minCombination = getMinCombination(containers, eggnogToFill);

    var containerCounts = query([
        getCombinations(minCombination, maxCombination, containers.length),
        where(capcityIs(eggnogToFill, containers)),
        map(cc => cc.match(/1/g).length),
        toArray
    ]);

    var bestCase = containerCounts.reduce((acc, c) => acc < c ? acc : c);
    var countOfBestCase = containerCounts.reduce((acc, c) => acc + (c == bestCase ? 1 : 0), 0);
    return countOfBestCase;
}

//4372
console.log(findCombinations(mainInput, 150));
//4
console.log(findBestCombinations(mainInput, 150));