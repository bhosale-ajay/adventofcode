declare var require: any;
// tslint:disable-next-line:no-var-requires
const md5 = require("./../lib/md5");
const doorId = "ojvtpuvg";

// tslint:disable-next-line:no-unused-variable
function creackFirstDoorPassword() {
    let password = "";
    let counter = 0;
    while (password.length < 8) {
        const hash = md5(doorId + counter);
        if (hash.startsWith("00000")) {
            password += hash[5];
        }
        counter = counter + 1;
    }
    return password;
}

// tslint:disable-next-line:no-unused-variable
function creackSecondDoorPassword() {
    let password = [ -1, -1, -1, -1, -1, -1, -1, -1];
    let characterPlaced = 0;
    // copied from first door numbers
    let cheatSheet = [1469591, 1925351, 4310992, 4851204, 6610226, 6840976, 9504234, 10320588];
    let cheatSheetIndex = 0;
    let counter = 0;
    while (characterPlaced < 8) {
        counter = counter + 1;
        if (cheatSheetIndex < cheatSheet.length) {
            counter = cheatSheet[cheatSheetIndex];
            cheatSheetIndex = cheatSheetIndex + 1;
        }
        const hash = md5(doorId + counter);
        if (hash.startsWith("00000")) {
            const position = hash[5];
            if (position < 8 && (password[position] === -1)) {
                password[position] = hash[6];
                characterPlaced = characterPlaced + 1;
            }
        }
    }
    return password.join("");
}
// uncomment to run
// console.log(creackFirstDoorPassword());  // 4543c154
// console.log(creackSecondDoorPassword()); // 1050cbbd
