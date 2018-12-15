const findScore = (iterations: number) => {
    const recipeBoard = [3, 7];
    let [firstElf, secondElf] = [0, 1];
    while (recipeBoard.length < (iterations + 10)) {
        const firstElfRecipe = recipeBoard[firstElf];
        const secondElfRecipe = recipeBoard[secondElf];
        const newRecipe = firstElfRecipe + secondElfRecipe;
        if ( newRecipe > 9) {
            recipeBoard.push(1);
            recipeBoard.push(newRecipe - 10);
        } else {
            recipeBoard.push(newRecipe);
        }
        firstElf = (firstElf + firstElfRecipe + 1) % recipeBoard.length;
        secondElf = (secondElf + secondElfRecipe + 1) % recipeBoard.length;
    }
    return recipeBoard.slice(iterations, iterations + 10).join("");
};

const findRecipesToSequence = (sequence: string) => {
    const recipeBoard = [3, 7];
    let [firstElf, secondElf, last] = [0, 1, ""];
    while (true) {
        const firstElfRecipe = recipeBoard[firstElf];
        const secondElfRecipe = recipeBoard[secondElf];
        const newRecipe = firstElfRecipe + secondElfRecipe;
        if (newRecipe > 9) {
            recipeBoard.push(1);
            recipeBoard.push(newRecipe - 10);
        } else {
            recipeBoard.push(newRecipe);
        }
        firstElf = (firstElf + firstElfRecipe + 1) % recipeBoard.length;
        secondElf = (secondElf + secondElfRecipe + 1) % recipeBoard.length;

        last = last + newRecipe;
        const foundIndex = last.indexOf(sequence);
        if (foundIndex > -1) {
            return recipeBoard.length - last.length + foundIndex;
        } else if (last.length > sequence.length) {
            last = last.slice(last.length - sequence.length);
        }
    }
};

test("14 - Part 1", () => {
    expect(findScore(9)).toEqual("5158916779");
    expect(findScore(5)).toEqual("0124515891");
    expect(findScore(18)).toEqual("9251071085");
    expect(findScore(2018)).toEqual("5941429882");
    expect(findScore(380621)).toEqual("6985103122");
});

test("14 - Part 2", () => {
    expect(findRecipesToSequence("51589")).toEqual(9);
    expect(findRecipesToSequence("01245")).toEqual(5);
    expect(findRecipesToSequence("92510")).toEqual(18);
    expect(findRecipesToSequence("59414")).toEqual(2018);
    expect(findRecipesToSequence("380621")).toEqual(20182290);
});

// message = message + (counter) + " ";
// for (let i = 0; i < recipeBoard.length; i++) {
//     if (i === firstElf) {
//         message = message + "(" + recipeBoard[i] + ")";
//     } else if (i === secondElf) {
//         message = message + "[" + recipeBoard[i] + "]";
//     } else {
//         message = message + " " + recipeBoard[i] + " ";
//     }
// }
// message = message + "\n";
