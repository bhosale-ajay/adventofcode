function* takeDuplicates(source) {
    var currentLocation = 0;
    var sourceLength = source.Length;
    var result = [];
    while (currentLocation < source.length) {
        var item = source[currentLocation];
        result.push(item);
        currentLocation = currentLocation + 1;
        if (currentLocation == sourceLength || item != source[currentLocation]) {
            yield result;
            result = [];
        }
    }
}

function lookAndSay(source) {
    var result = [];
    for (var dc of takeDuplicates(source.split(""))) {
        result.push(dc.length);
        result.push(dc[0]);
    }
    return result.join("");
}

function repeatLookAndSay(input, times) {
    var result = input;
    for (var counter = 0; counter < times; counter++) {
        result = lookAndSay(result);
    }
    return result;
}

//360154
var after40Times = repeatLookAndSay("1113122113", 40);
console.log(after40Times.length);
//5103798
var after50Times = repeatLookAndSay(after40Times, 10);
console.log(after50Times.length);