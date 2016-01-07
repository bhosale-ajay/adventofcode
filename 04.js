//http://www.myersdaily.org/joseph/javascript/md5.js

var input = 'yzbqklnj';

function findNumber(input) {
    for (var number = 999999; number < 9999999; number++) {
        var hash = md5(input + number);
        if (hash.startsWith("000000")) {
            console.log(number);
            break;
        }
    }
}

findNumber('yzbqklnj');