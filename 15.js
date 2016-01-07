var testInput = `Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`;
var mainInput = `Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
Butterscotch: capacity 0, durability 5, flavor -3, texture 0, calories 3
Chocolate: capacity 0, durability 0, flavor 5, texture -1, calories 8
Candy: capacity 0, durability -1, flavor 0, texture 5, calories 8`;

function map(convertor) {
    return function* (source) {
        for (var item of source) {
            yield convertor(item);
        }
    }
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

function each(action) {
    return function* (source) {
        for (var item of source) {
            action(item);
            yield item;
        }
    };
}

function query(chain) {
    return chain.reduce((a, f) => f(a));
}

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

function* getPossibleMix(totalTeaspoons, ingredientCount) {
    var max = totalTeaspoons - ingredientCount + 1;
    var min = 1;
    var items = [];
    var seed = [];

    for (var ingredientCounter = 0; ingredientCounter < ingredientCount; ingredientCounter++) {
        seed.push(min);
    }

    for (var item = min; item <= max; item++) {
        items.push(item);
    }
    yield* createSetOfSequences(items, seed, x => x);
}

function Ingredient(name, capacity, durability, flavor, texture, calories) {
    return {
        name, capacity, durability, flavor, texture, calories
    };
}

function sumofIngredientsIs(desired) {
    return function (row) {
        return desired == row.reduce((a, r) => a + r, 0);
    }
}

function parseInput(input) {
    var expression = /([a-z]*): capacity (\-?\d+), durability (\-?\d+), flavor (\-?\d+), texture (\-?\d+), calories (\-?\d+)/ig;
    var result = [];
    var line;
    while ((line = expression.exec(input)) !== null) {
        result.push(Ingredient(line[1], parseInt(line[2]), parseInt(line[3]), parseInt(line[4]), parseInt(line[5]), parseInt(line[6])));
    }
    return result;
}

function productOfAttributesSum(ingredients) {
    return function (possibleMix) {
        var capacity = 0, durability = 0, flavor = 0, texture = 0;
        for (var ingredientsCounter = 0; ingredientsCounter < ingredients.length; ingredientsCounter++) {
            var currentIngredient = ingredients[ingredientsCounter];
            var quantity = possibleMix[ingredientsCounter];
            capacity += quantity * currentIngredient.capacity;
            durability += quantity * currentIngredient.durability;
            flavor += quantity * currentIngredient.flavor;
            texture += quantity * currentIngredient.texture;
        }
        return Math.max(capacity, 0)
            *
            Math.max(durability, 0)
            *
            Math.max(flavor, 0)
            *
            Math.max(texture, 0);
    }
}

function max(source) {
    var max = 0;
    for (var product of source) {
        if (product > max) {
            max = product;
        }
    }
    return max;
}

function highestScore(input) {
    var totalTeaspoons = 100;
    var ingredients = parseInput(input);
    var bestScore = query([
        getPossibleMix(totalTeaspoons, ingredients.length),
        where(sumofIngredientsIs(totalTeaspoons)),
        map(productOfAttributesSum(ingredients)),
        max
    ]);
    return bestScore;
}

function sumOfCalariesIs(ingredients, calorieCount) {
    return possibleMix => calorieCount == ingredients.reduce((acc, ing, index) => acc + (ing.calories * possibleMix[index]), 0);
}

function highestScoreFor500Cal(input) {
    var totalTeaspoons = 100;
    var ingredients = parseInput(input);
    var bestScore = query([
        getPossibleMix(totalTeaspoons, ingredients.length),
        where(sumofIngredientsIs(totalTeaspoons)),
        where(sumOfCalariesIs(ingredients, 500)),
        map(productOfAttributesSum(ingredients)),
        max
    ]);
    return bestScore;
}

//console.log(highestScore(testInput));
//console.log(highestScoreFor500Cal(testInput));

//21367368
console.log(highestScore(mainInput));
//1766400
console.log(highestScoreFor500Cal(mainInput));