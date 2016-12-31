var maxPresents = 36000000;
var maxPossibleHouseNumber = maxPresents / 35;
var maxVisits = 50;

function getHouseNumber() {
    var presents = [];
    for (var elevesCounter = 1; elevesCounter < maxPossibleHouseNumber; elevesCounter++) {
        for (var currentHouseNumber = elevesCounter; currentHouseNumber < maxPossibleHouseNumber; currentHouseNumber = currentHouseNumber + elevesCounter) {
            if (!presents[currentHouseNumber]) {
                presents[currentHouseNumber] = 0;
            }
            presents[currentHouseNumber] += elevesCounter * 10;
            if (presents[currentHouseNumber] > maxPresents && currentHouseNumber == elevesCounter) {
                return currentHouseNumber;
            }
        }
    }
    return -1;
}

function getHouseNumberPart2() {
    var presents = [];
    var visits = 0;
    for (var elevesCounter = 1; elevesCounter < maxPossibleHouseNumber; elevesCounter++) {
        visits = 0;
        for (var currentHouseNumber = elevesCounter; currentHouseNumber < maxPossibleHouseNumber; currentHouseNumber = currentHouseNumber + elevesCounter) {
            if (!presents[currentHouseNumber]) {
                presents[currentHouseNumber] = 0;
            }
            presents[currentHouseNumber] += elevesCounter * 11;
            if (presents[currentHouseNumber] > maxPresents && currentHouseNumber == elevesCounter) {
                return currentHouseNumber;
            }
            visits = visits + 1;
            if (visits == 50) {
                break;
            }
        }
    }
    //increase the maxPossibleHouseNumber
    return -1;
}

//831600
console.log(getHouseNumber());
//884520
console.log(getHouseNumberPart2());