var testInput = `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`;

var masterInput = `Faerun to Tristram = 65
Faerun to Tambi = 129
Faerun to Norrath = 144
Faerun to Snowdin = 71
Faerun to Straylight = 137
Faerun to AlphaCentauri = 3
Faerun to Arbre = 149
Tristram to Tambi = 63
Tristram to Norrath = 4
Tristram to Snowdin = 105
Tristram to Straylight = 125
Tristram to AlphaCentauri = 55
Tristram to Arbre = 14
Tambi to Norrath = 68
Tambi to Snowdin = 52
Tambi to Straylight = 65
Tambi to AlphaCentauri = 22
Tambi to Arbre = 143
Norrath to Snowdin = 8
Norrath to Straylight = 23
Norrath to AlphaCentauri = 136
Norrath to Arbre = 115
Snowdin to Straylight = 101
Snowdin to AlphaCentauri = 84
Snowdin to Arbre = 96
Straylight to AlphaCentauri = 107
Straylight to Arbre = 14
AlphaCentauri to Arbre = 46`;

function where(predicate) {
    return function* (source) {
        for (var item of source) {
            if (predicate(item)) {
                yield item;
            }
        }
    }
}

function select(convertor) {
    return function* (source) {
        for (var item of source) {
            yield convertor(item);
        }
    }
}

function toArray() {
    return function (source) {
        var result = [];
        for (var item of source) {
            result.push(item);
        }
        return result;
    }
}

function query(chain) {
    return chain.reduce((a, f) => f(a));
}

function infiniteSequence(items, onReset) {
    var index = 0;
    return {
        moveNext: function () {
            index = index + 1;
            if (index == items.length) {
                onReset();
                index = 0;
            }
        },
        value: function () {
            return items[index];
        }
    };
}

function* createSetOfSequences(n) {
    var seqs = [];
    var items = [];
    var done = false;

    function getResetHandler(index) {
        return function () {
            if (index + 1 == n) {
                done = true;
            }
            else {
                seqs[index + 1].moveNext();
            }
        }
    }

    for (var itemCounter = 1; itemCounter <= n; itemCounter++) {
        items.push(itemCounter);
    }

    for (var seqCounter = 0; seqCounter < n; seqCounter++) {
        seqs[seqCounter] = infiniteSequence(items, getResetHandler(seqCounter));
    }
    var sequenceRoot = seqs[0];

    while (!done) {
        yield seqs.map(s => s.value());
        sequenceRoot.moveNext();
    }
}

function noDuplicateStops(input) {
    if (input.length == 0) {
        return true;
    }
    var map = 1 << input[0];
    for (var counter = 1; counter < input.length; counter++) {
        var current = 1 << input[counter];
        if ((map & current) !== 0) {
            return false;
        }
        map = map | current;
    }
    return true;
}

function getAliases(route) {
    return [route.toString(), route.slice(0).reverse().toString()];
}

function isNewRoute() {
    var routes = [];
    return function (route) {
        var aliases = getAliases(route);
        var found = aliases.findIndex(a => routes.indexOf(a) > 0);
        if (found > -1) {
            return false;
        }
        else {
            routes = routes.concat(aliases);
            return true;
        }
    }
}

function getRouteIndex(routes, route) {
    var index = routes.indexOf(route);
    if (index > -1) {
        return index + 1;
    }
    else {
        routes.push(route);
        return routes.length;
    }
}

function getDistanceKey(from, to) {
    return 'F_' + from + '_' + to;
}

function getDistance(distanceMap, totalDist, lastStopId, stopId) {
    if (lastStopId == 0) {
        return 0;
    }
    else {
        return distanceMap[getDistanceKey(lastStopId, stopId)] + totalDist;
    }
}

function getTotalRouteDistance(route, distanceMap) {
    var distInfo = route.reduce((acc, stopId) => {
        return {
            lastStopId: stopId,
            totalDist: getDistance(distanceMap, acc.totalDist, acc.lastStopId, stopId)
        };
    }, { lastStopId: 0, totalDist: 0 });
    return distInfo.totalDist;
}

function getRouteName(route, routes) {
    return route.reduce((acc, stopId) => acc + routes[stopId - 1] + " -> ", "");
}

function parseRouteData(input) {
    var expression = /([a-z]*)\sto\s([a-z]*)\s=\s(\d*)/gi;
    var routes = [];
    var distanceMap = {};
    var line;

    while ((line = expression.exec(input)) !== null) {
        var from = getRouteIndex(routes, line[1]);
        var to = getRouteIndex(routes, line[2]);
        var distance = parseInt(line[3]);

        distanceMap[getDistanceKey(from, to)] = distance;
        distanceMap[getDistanceKey(to, from)] = distance;
    }

    var distances = query([
        createSetOfSequences(routes.length),
        where(noDuplicateStops),
        where(isNewRoute()),
        select(r => getTotalRouteDistance(r, distanceMap)),
        toArray()
    ]);

    //117
    console.log(distances.reduce((acc, dist) => acc > dist ? dist : acc));
    //909
    console.log(distances.reduce((acc, dist) => acc < dist ? dist : acc));
}

parseRouteData(masterInput);