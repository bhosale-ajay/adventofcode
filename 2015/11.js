function infiniteSequence(items, onReset, startPosition) {
    var index = items.indexOf(startPosition);
    if (index == -1) {
        index = 0;
    }
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

function* createSetOfSequences(items, seed, convertor) {
    var seqs = [];
    var done = false;
    var count = seed.length;
    var baseItertor;

    if (count == 0) {
        return;
    }

    function getResetHandler(index) {
        return function () {
            if (index == 0) {
                done = true;
            }
            else {
                seqs[index - 1].moveNext();
            }
        };
    }

    for (var seqCounter = 0; seqCounter < count; seqCounter++) {
        baseItertor = seqs[seqCounter] = infiniteSequence(items, getResetHandler(seqCounter), seed[seqCounter]);
    }

    while (!done) {
        yield convertor(seqs.map(s => s.value()));
        baseItertor.moveNext();
    }
}

function* getPossiblePasswords(currentPassword) {
    var items = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    yield* createSetOfSequences(items, currentPassword, arr => arr.join(''));
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

function take(count) {
    return function* (source) {
        var returned = 0;
        for (var item of source) {
            yield item;
            returned = returned + 1;
            if (returned == count) {
                break;
            }
        }
    };
}

function query(chain) {
    return chain.reduce((a, f) => f(a));
}

function hasIncreasingStraight(password) {
    function isAdjacent(current, next) {
        return current.charCodeAt(0) + 1 == next.charCodeAt(0);
    }
    for (var charIndex = 0; charIndex <= password.length - 3; charIndex++) {
        var current = password[charIndex];
        var next = password[charIndex + 1];
        var nextToNext = password[charIndex + 2];
        if (isAdjacent(current, next) && isAdjacent(next, nextToNext)) {
            return true;
        }
    }
    return false;
}

function doesNotContainConfusingChar(password) {
    return password.indexOf('i') == -1 &&
        password.indexOf('o') == -1 &&
        password.indexOf('l') == -1;
}

function containsMinTwoDifferentNonOverlappingPairs(password) {
    var pairMap = {};
    var pairCount = 0;

    for (var index = 1; index < password.length; index++) {
        var currentChar = password[index];
        var previousChar = password[index - 1];

        if (previousChar == currentChar && !pairMap[currentChar]) {
            pairMap[currentChar] = true;
            pairCount = pairCount + 1;
            if (pairCount == 2) {
                return true;
            }
        }
    }
    return false;
}

function getNextPassword(currentPassword) {
    var passwords = query([
        currentPassword,
        getPossiblePasswords,
        where(doesNotContainConfusingChar),
        where(containsMinTwoDifferentNonOverlappingPairs),
        where(hasIncreasingStraight),
        take(2)
    ]);

    for (var password of passwords) {
        console.log(password);
    }
}

//hepxxyzz
//heqaabcc
getNextPassword('hepxcrrq');