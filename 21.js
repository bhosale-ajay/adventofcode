var bossHit = 109;
var bossDamage = 8;
var bossArmor = 2;

var damageStoreData = `Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0`;

var armorStoreData = `Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5`;

var ringStoreData = `DamageO    25     1       0
DamageT    50     2       0
DamageTH   100     3       0
DefenseO   20     0       1
DefenseT   40     0       2
DefenseTH   80     0       3`;

function parseStoreData(input) {
    var expression = /([a-z]*)\s+(\d+)\s+(\d+)\s+(\d+)/ig;
    var result = [];
    var line;

    while ((line = expression.exec(input)) !== null) {
        result.push({ n: line[1], c: parseInt(line[2]), d: parseInt(line[3]), a: parseInt(line[4]) });
    }

    return result;
}

function getDealsForWeapons(weapons, rings, selector, onlyRingAllowed) {
    var quantity;
    var deals = [];
    deals[0] = 0;

    var maxQuantity = weapons.reduce((currentMax, w) => Math.max(currentMax, w[selector]), 0);

    var minQuantity = weapons.reduce((currentMin, w) => Math.min(currentMin, w[selector]), maxQuantity);

    var maxRingPower = rings.reduce((currentMax, r) => Math.max(currentMax, r[selector]), 0);

    var minRingPower = rings.reduce((currentMin, r) => Math.min(currentMin, r[selector]), maxRingPower);

    if (onlyRingAllowed) {
        minQuantity = Math.min(minRingPower, minQuantity);
    }

    maxQuantity = maxQuantity + maxRingPower;

    for (quantity = minQuantity; quantity <= maxQuantity; quantity++) {
        var possibleCosts = [];

        var directOption = weapons.find(w => w[selector] == quantity);
        if (directOption) {
            possibleCosts.push(directOption.c);
        }

        if (onlyRingAllowed) {
            var ring = rings.find(r => r[selector] == quantity);
            if (ring) {
                possibleCosts.push(ring.c);
            }
        }

        for (var subQuantity = minQuantity; subQuantity < quantity; subQuantity++) {
            rings.filter(r => r[selector] + subQuantity == quantity).forEach(r => {
                var subOption = weapons.find(w => w[selector] == subQuantity);
                if (subOption) {
                    possibleCosts.push(subOption.c + r.c);
                }
            });
        }

        var bestCost = possibleCosts.reduce((acc, c) => acc < c ? acc : c);
        var worstCost = possibleCosts.reduce((acc, c) => acc > c ? acc : c);

        deals[quantity] = {
            bestCost,
            worstCost
        };
    }

    return {
        minQuantity,
        maxQuantity,
        deals,
    }
}

function getDeals() {
    var rings = parseStoreData(ringStoreData);
    var damages = getDealsForWeapons(parseStoreData(damageStoreData), rings.filter(r => r.d > 0), 'd', false);
    var armors = getDealsForWeapons(parseStoreData(armorStoreData), rings.filter(r => r.a > 0), 'a', true);

    return {
        armors,
        damages
    };
}

function attack(att, def) {
    def.hit = def.hit - Math.max(att.damage - def.armor, 1);
}

function isWinningCombination(p) {
    var b = {
        hit: bossHit,
        damage: bossDamage,
        armor: bossArmor,
        name: 'boss'
    };

    var att = p;
    var def = b;

    while (p.hit > 0 && b.hit > 0) {
        attack(att, def);
        if (p.hit < 1) {
            return false;
        }
        if (b.hit < 1) {
            return true;
        }
        var temp = def;
        def = att;
        att = temp;
    }
}

function getPossiblePlayerCombinations(armorDeals, damageDeals) {
    var result = [];
    for (var damage = damageDeals.minQuantity; damage <= damageDeals.maxQuantity; damage++) {
        for (var armor = armorDeals.minQuantity; armor <= armorDeals.maxQuantity; armor++) {
            result.push({
                name: 'player',
                hit: 100,
                damage,
                armor
            });
        }
    }
    return result;
}

function isLosingCombination(p) {
    return !isWinningCombination(p);
}

function getLowestGoldToWin() {
    var deals = getDeals();
    var armorDeals = deals.armors;
    var damageDeals = deals.damages;

    return getPossiblePlayerCombinations(armorDeals, damageDeals)
        .filter(isWinningCombination)
        .map(wc => armorDeals.deals[wc.armor].bestCost + damageDeals.deals[wc.damage].bestCost)
        .reduce((minGold, gold) => minGold < gold ? minGold : gold);
}

function getHighestGoldToLose() {
    var deals = getDeals();
    var armorDeals = deals.armors;
    var damageDeals = deals.damages;

    return getPossiblePlayerCombinations(armorDeals, damageDeals)
        .filter(isLosingCombination)
        .map(wc => armorDeals.deals[wc.armor].worstCost + damageDeals.deals[wc.damage].worstCost)
        .reduce((maxGold, gold) => maxGold > gold ? maxGold : gold);
}

//111
console.log(getLowestGoldToWin());
//188
console.log(getHighestGoldToLose());