//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var loggingOn = true;
function log(message) {
    if (loggingOn) {
        console.log(message);
    }
}

function randomSpellProvider() {
    var spells = ["spellShield", "spellRecharge", "spellPoison", "spellDrain", "spellMagicMissile"];
    return function () {
        return shuffleArray(spells);
    }
}

function randomSpellProviderForHardMode() {
    var spells = [
        "spellShield",
        "spellRecharge",
        "spellPoison",
        "spellMagicMissile",
        "spellDrain"];

    var boostSpells = ["spellPoison", "spellRecharge", "spellShield", "spellPoison"];

    var calls = 0;
    return function () {
        if (calls < boostSpells.length) {
            calls += 1;
            return boostSpells;
        }
        else {
            return shuffleArray(spells);
        }
    }
}

function testProvider(spells) {
    var index = 0;
    return function () {
        if (index == spells.length) {
            throw Error("Invalid Call");
        }
        var result = spells[index];
        index = index + 1;
        return [result];
    }
}

function spellMagicMissile(spellActions) {
    var cost = 53;
    var instantDamage = 4;

    return {
        get cost() {
            return cost;
        },
        get effectsOver() {
            return true;
        },
        process() {
            spellActions.deductCost(cost);
            spellActions.hitBoss(instantDamage);
            log(`Player casts Magic Missile, dealing ${instantDamage} damage.`);
        },
        processEffect() {
        }
    }
}

function spellDrain(spellActions) {
    var cost = 73;
    var instantDamage = 2;
    var healsBy = 2;

    return {
        get cost() {
            return cost;
        },
        get effectsOver() {
            return true;
        },
        process() {
            spellActions.deductCost(cost);
            spellActions.hitBoss(instantDamage);
            spellActions.healPlayer(healsBy);
            log(`Player casts Drain, dealing ${instantDamage} damage, and healing ${healsBy} hit points.`);
        },
        processEffect() {
        }
    }
}

function spellShield(spellActions) {
    var cost = 113;
    var timer = 6;
    var armor = 7;

    return {
        get cost() {
            return cost;
        },
        get effectsOver() {
            return timer == 0;
        },
        process() {
            spellActions.deductCost(cost);
            spellActions.addArmor(armor);
            log(`Player casts Shield, increasing armor by ${armor}.`);
        },
        processEffect() {
            if (timer == 0) {
                return;
            }
            timer = timer - 1;
            if (timer > 0) {
                log(`Shield's timer is now ${timer}.`);
            }
            else {
                spellActions.reduceArmor(armor);
                log(`Shield's timer is now 0.`);
                log(`Shield wears off, decreasing armor by ${armor}.`);
            }
        }
    }
}

function spellPoison(spellActions) {
    var cost = 173;
    var timer = 6;
    var damage = 3;

    return {
        get cost() {
            return cost;
        },
        get effectsOver() {
            return timer == 0;
        },
        process() {
            spellActions.deductCost(cost);
            log('Player casts Poison.');
        },
        processEffect() {
            if (timer == 0) {
                return;
            }
            timer = timer - 1;
            spellActions.hitBoss(damage);
            log(`Poison deals ${damage} damage; its timer is now ${timer}.`);
            if (timer == 0) {
                log(`Poison wears off.`);
            }
        }
    }
}

function spellRecharge(spellActions) {
    var cost = 229;
    var timer = 5;
    var mana = 101;

    return {
        get cost() {
            return cost;
        },
        get effectsOver() {
            return timer == 0;
        },
        process() {
            spellActions.deductCost(cost);
            log('Player casts Recharge.');
        },
        processEffect() {
            if (timer == 0) {
                return;
            }
            timer = timer - 1;
            spellActions.recharge(mana);
            log(`Recharge provides ${mana} mana; its timer is now ${timer}.`);
            if (timer == 0) {
                log(`Recharge wears off.`);
            }
        }
    }
}

function Game(seedPlayerHit, seedPlayerMana, seedBossHit, seedBossDamage, spellGenerator, currentMin, mode) {
    var playerHit = seedPlayerHit;
    var playerMana = seedPlayerMana;
    var playerArmor = 0;
    var bossHit = seedBossHit;
    var bossDamage = seedBossDamage;

    var totalSpend = 0;
    var playersTurn = true;
    var activeSpells = {};

    var spellActions = {
        addArmor(armor) {
            playerArmor += armor;
        },
        reduceArmor(armor) {
            playerArmor -= armor;
        },
        deductCost(mana) {
            playerMana -= mana;
            totalSpend += mana;
        },
        recharge(mana) {
            playerMana += mana;
        },
        healPlayer(healBy) {
            playerHit += healBy;
        },
        hitBoss(hitBy) {
            bossHit -= hitBy;
        }
    }

    function processActiveSpells() {
        for (var spellName in activeSpells) {
            var spell = activeSpells[spellName];
            if (spell) {
                spell.processEffect();
                if (spell.effectsOver) {
                    activeSpells[spellName] = null;
                }
            }
        }
    }

    function playersAct() {
        if (mode) {
            playerHit -= 1;
            if (playerHit < 1) {
                return;
            }
        }

        processActiveSpells();

        invokeNewSpell();
    }

    function invokeNewSpell() {
        var spellInvoked = false;
        for (var spellName of spellGenerator()) {
            if (activeSpells[spellName]) {
                continue;
            }

            var spell = eval(spellName)(spellActions);
            if (spell.cost > playerMana) {
                continue;
            }
            spellInvoked = true;
            spell.process();
            if (!spell.effectsOver) {
                activeSpells[spellName] = spell;
            }
            break;
        }
        if (!spellInvoked) {
            playerHit = 0;
        }
    }

    function bosssAct() {
        processActiveSpells();
        if (bossHit > 0) {
            log(`Boss attacks for ${bossDamage} damage.`);
            playerHit = playerHit - Math.max(bossDamage - playerArmor, 1);
        }
    }

    while (playerHit > 0 && bossHit > 0) {
        log(`-- ${playersTurn ? 'Player' : 'Boss'} turn --`);
        log(`- Player has ${playerHit} hit points, ${playerArmor} armor, ${playerMana} mana`);
        log(`- Boss has ${bossHit} hit points`);
        if (playersTurn) {
            playersAct();
        }
        else {
            bosssAct();
        }
        playersTurn = !playersTurn;
        log('');

        if (currentMin < totalSpend) {
            return {
                playerWon: false
            }
        }
    }

    return {
        playerWon: playerHit > 0,
        totalSpend,
    };
}

function tryAndGetLowest(mode, attempts) {
    var currentMin = 10000;

    loggingOn = false;
    for (var counter = 0; counter < attempts; counter++) {
        var result = Game(50, 500, 51, 9, mode ? randomSpellProviderForHardMode() : randomSpellProvider(), currentMin, mode);
        if (result.playerWon && result.totalSpend < currentMin) {
            currentMin = result.totalSpend;
        }
    }
    loggingOn = true;

    if (currentMin < 10000) {
        log(currentMin);
    }
    else {
        log("No lowest commbination found");
    }
}

var result, spellProvider;
/*
spellProvider = testProvider([
    "spellPoison", "spellMagicMissile"]);
result = Game(10, 250, 13, 8, spellProvider, 2000, false);
console.log(result.totalSpend);
*/

/*
spellProvider = testProvider([
    "spellRecharge", "spellShield", "spellDrain",
    "spellPoison", "spellMagicMissile"]);
result = Game(10, 250, 13, 8, spellProvider, 2000, false);
console.log(result.totalSpend);
*/

//900
//Run it multiple times and check the output
//tryAndGetLowest(false, 2000);

//Tally for 900
/*
spellProvider = testProvider([
    "spellRecharge", "spellPoison", "spellShield",
    "spellMagicMissile", "spellPoison", "spellMagicMissile",
    "spellMagicMissile", "spellMagicMissile"]);
result = Game(50, 500, 51, 9, spellProvider, 2000, false);
console.log(result.totalSpend);
*/

//1216
//Run it multiple times and check the output
tryAndGetLowest(true, 1000);

//Tally for 1216
/*
spellProvider = testProvider([
    "spellPoison", "spellRecharge", "spellShield", 
    "spellPoison", "spellRecharge", "spellDrain", 
    "spellPoison", "spellMagicMissile"]);
result = Game(50, 500, 51, 9, spellProvider, 2000, true);
console.log(result.totalSpend);
*/