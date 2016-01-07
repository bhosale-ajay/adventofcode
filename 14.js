var testInput = `Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`;

var masterInput = `Dancer can fly 27 km/s for 5 seconds, but then must rest for 132 seconds.
Cupid can fly 22 km/s for 2 seconds, but then must rest for 41 seconds.
Rudolph can fly 11 km/s for 5 seconds, but then must rest for 48 seconds.
Donner can fly 28 km/s for 5 seconds, but then must rest for 134 seconds.
Dasher can fly 4 km/s for 16 seconds, but then must rest for 55 seconds.
Blitzen can fly 14 km/s for 3 seconds, but then must rest for 38 seconds.
Prancer can fly 3 km/s for 21 seconds, but then must rest for 40 seconds.
Comet can fly 18 km/s for 6 seconds, but then must rest for 103 seconds.
Vixen can fly 18 km/s for 5 seconds, but then must rest for 84 seconds.`;

function Reindeer(name, speed, runningDuration, restDuration) {
    var frameDuration = runningDuration + restDuration;
    var totalPoints = 0;
    var currentDistance = 0;
    return {
        distanceAfter(time) {
            var completeFrameCount = Math.floor(time / frameDuration);
            var incompleteFrameTime = time % frameDuration;
            var runningTimeFromIncompleteFrame = incompleteFrameTime > runningDuration ? runningDuration : incompleteFrameTime;
            currentDistance = ((completeFrameCount * runningDuration) + runningTimeFromIncompleteFrame) * speed;
            return currentDistance;
        },
        rewardIf(distance) {
            if (distance == currentDistance) {
                totalPoints += 1;
            }
        },
        get distance() {
            return currentDistance;
        },
        get points() {
            return totalPoints;
        }
    }
}

function parseData(input) {
    var expression = /([a-z]*)\scan fly (\d*) km\/s for (\d*) seconds, but then must rest for (\d*) seconds./ig;
    var result = [];
    var line;

    while ((line = expression.exec(input)) !== null) {
        result.push(Reindeer(line[1], parseInt(line[2]), parseInt(line[3]), parseInt(line[4])));
    }

    return result;
}

function getTopDistance(input, time) {
    return parseData(input).map(r => r.distanceAfter(time)).reduce((acc, dist) => acc > dist ? acc : dist, 0);
}

function getTopPoints(input, time) {
    var reindeers = parseData(input);
    for (var currentTime = 1; currentTime <= time; currentTime++) {
        reindeers.forEach(r => r.distanceAfter(currentTime));
        var topDistance = reindeers.reduceRight((d, r) => r.distance > d ? r.distance : d, 0);
        reindeers.forEach(r => r.rewardIf(topDistance));
    }
    return reindeers.reduceRight((p, r) => r.points > p ? r.points : p, 0);
}

//console.log(getTopDistance(testInput, 1000));
//console.log(getTopPoints(testInput, 1000));
//2640
console.log(getTopDistance(masterInput, 2503));
//1102
console.log(getTopPoints(masterInput, 2503));