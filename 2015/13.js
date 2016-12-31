var testData = `Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.`;

var happinessData = `Alice would lose 2 happiness units by sitting next to Bob.
Alice would lose 62 happiness units by sitting next to Carol.
Alice would gain 65 happiness units by sitting next to David.
Alice would gain 21 happiness units by sitting next to Eric.
Alice would lose 81 happiness units by sitting next to Frank.
Alice would lose 4 happiness units by sitting next to George.
Alice would lose 80 happiness units by sitting next to Mallory.
Bob would gain 93 happiness units by sitting next to Alice.
Bob would gain 19 happiness units by sitting next to Carol.
Bob would gain 5 happiness units by sitting next to David.
Bob would gain 49 happiness units by sitting next to Eric.
Bob would gain 68 happiness units by sitting next to Frank.
Bob would gain 23 happiness units by sitting next to George.
Bob would gain 29 happiness units by sitting next to Mallory.
Carol would lose 54 happiness units by sitting next to Alice.
Carol would lose 70 happiness units by sitting next to Bob.
Carol would lose 37 happiness units by sitting next to David.
Carol would lose 46 happiness units by sitting next to Eric.
Carol would gain 33 happiness units by sitting next to Frank.
Carol would lose 35 happiness units by sitting next to George.
Carol would gain 10 happiness units by sitting next to Mallory.
David would gain 43 happiness units by sitting next to Alice.
David would lose 96 happiness units by sitting next to Bob.
David would lose 53 happiness units by sitting next to Carol.
David would lose 30 happiness units by sitting next to Eric.
David would lose 12 happiness units by sitting next to Frank.
David would gain 75 happiness units by sitting next to George.
David would lose 20 happiness units by sitting next to Mallory.
Eric would gain 8 happiness units by sitting next to Alice.
Eric would lose 89 happiness units by sitting next to Bob.
Eric would lose 69 happiness units by sitting next to Carol.
Eric would lose 34 happiness units by sitting next to David.
Eric would gain 95 happiness units by sitting next to Frank.
Eric would gain 34 happiness units by sitting next to George.
Eric would lose 99 happiness units by sitting next to Mallory.
Frank would lose 97 happiness units by sitting next to Alice.
Frank would gain 6 happiness units by sitting next to Bob.
Frank would lose 9 happiness units by sitting next to Carol.
Frank would gain 56 happiness units by sitting next to David.
Frank would lose 17 happiness units by sitting next to Eric.
Frank would gain 18 happiness units by sitting next to George.
Frank would lose 56 happiness units by sitting next to Mallory.
George would gain 45 happiness units by sitting next to Alice.
George would gain 76 happiness units by sitting next to Bob.
George would gain 63 happiness units by sitting next to Carol.
George would gain 54 happiness units by sitting next to David.
George would gain 54 happiness units by sitting next to Eric.
George would gain 30 happiness units by sitting next to Frank.
George would gain 7 happiness units by sitting next to Mallory.
Mallory would gain 31 happiness units by sitting next to Alice.
Mallory would lose 32 happiness units by sitting next to Bob.
Mallory would gain 95 happiness units by sitting next to Carol.
Mallory would gain 91 happiness units by sitting next to David.
Mallory would lose 66 happiness units by sitting next to Eric.
Mallory would lose 75 happiness units by sitting next to Frank.
Mallory would lose 99 happiness units by sitting next to George.`;

//http://stackoverflow.com/a/20871714
function getSettingPermutations(inputArr) {
    var results = [];

    function permute(arr, memo) {
        var cur, memo = memo || [];

        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(cur));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
        }

        return results;
    }

    return permute(inputArr);
}

function buildHappinessMap(input) {
    var expression = /([a-z]*)\swould\s(lose|gain)\s(\d*)\shappiness units by sitting next to ([a-z]*)/ig;
    var result = {};
    var line;

    while ((line = expression.exec(input)) !== null) {
        var thisPerson = line[1];
        var thatPerson = line[4];
        var impact = parseInt(line[3]) * (line[2] == "gain" ? 1 : -1);

        if (!result[thisPerson]) {
            result[thisPerson] = {};
        }
        result[thisPerson][thatPerson] = impact;
    }

    return result;
}

function getOptimalHappiness(happinessData, addMe) {
    var happinessMap = buildHappinessMap(happinessData);
    var persons = [];
    for (var person in happinessMap) {
        persons.push(person);
    }
    if (addMe) {
        persons.push("_");
    }

    function getNextPerson(arrangment, index) {
        var nextIndex = index + 1;
        if (nextIndex == arrangment.length) {
            nextIndex = 0;
        }
        return arrangment[nextIndex];
    }

    function getPrevPerson(arrangment, index) {
        var prevIndex = index - 1;
        if (prevIndex < 0) {
            prevIndex = arrangment.length - 1;
        }
        return arrangment[prevIndex];
    }

    function getHappinessIndexForAPerson(arrangment, index) {
        var person = happinessMap[arrangment[index]];
        if (!person) {
            return 0;
        }
        return (person[getPrevPerson(arrangment, index)] || 0) + (person[getNextPerson(arrangment, index)] || 0);
    }

    return getSettingPermutations(persons)
        .map(arrangment => arrangment.reduce((acc, person, index) => acc + getHappinessIndexForAPerson(arrangment, index), 0))
        .reduce((acc, hI) => hI > acc ? hI : acc, 0);
}

//664
console.log(getOptimalHappiness(happinessData, false));
//640
console.log(getOptimalHappiness(happinessData, true));