//http://www.myersdaily.org/joseph/javascript/md5.js

//Goto page
//http://www.myersdaily.org/joseph/javascript/md5-text.html

var md5 = require("./lib/md5.js");

var input = "yzbqklnj";

function findNumber(input, guessFrom, guessTo, startsWith) {
    var found = false;
    var number = 0;
    for (number = guessFrom; number < guessTo; number++) {
        var hash = md5(input + number);
        if (hash.startsWith(startsWith)) {
            found = true;
            break;
        }
    }
    console.log(found ? number : -1);
}

//282749
findNumber(input, 280000, 320000, "00000");
//9962624
findNumber(input, 8888888, 9999999, "000000");
//if you are getting -1 or an incorrect answer, increase the span of guess