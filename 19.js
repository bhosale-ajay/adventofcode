var testInput = `HOH`;
var testMoleculeMapData = `H => HO
H => OH
O => HH`;

var mainInput = `ORnPBPMgArCaCaCaSiThCaCaSiThCaCaPBSiRnFArRnFArCaCaSiThCaCaSiThCaCaCaCaCaCaSiRnFYFArSiRnMgArCaSiRnPTiTiBFYPBFArSiRnCaSiRnTiRnFArSiAlArPTiBPTiRnCaSiAlArCaPTiTiBPMgYFArPTiRnFArSiRnCaCaFArRnCaFArCaSiRnSiRnMgArFYCaSiRnMgArCaCaSiThPRnFArPBCaSiRnMgArCaCaSiThCaSiRnTiMgArFArSiThSiThCaCaSiRnMgArCaCaSiRnFArTiBPTiRnCaSiAlArCaPTiRnFArPBPBCaCaSiThCaPBSiThPRnFArSiThCaSiThCaSiThCaPTiBSiRnFYFArCaCaPRnFArPBCaCaPBSiRnTiRnFArCaPRnFArSiRnCaCaCaSiThCaRnCaFArYCaSiRnFArBCaCaCaSiThFArPBFArCaSiRnFArRnCaCaCaFArSiRnFArTiRnPMgArF`;

var mainMoleculeMapData = `Al => ThF
Al => ThRnFAr
B => BCa
B => TiB
B => TiRnFAr
Ca => CaCa
Ca => PB
Ca => PRnFAr
Ca => SiRnFYFAr
Ca => SiRnMgAr
Ca => SiTh
F => CaF
F => PMg
F => SiAl
H => CRnAlAr
H => CRnFYFYFAr
H => CRnFYMgAr
H => CRnMgYFAr
H => HCa
H => NRnFYFAr
H => NRnMgAr
H => NTh
H => OB
H => ORnFAr
Mg => BF
Mg => TiMg
N => CRnFAr
N => HSi
O => CRnFYFAr
O => CRnMgAr
O => HP
O => NRnFAr
O => OTi
P => CaP
P => PTi
P => SiRnFAr
Si => CaSi
Th => ThCa
Ti => BP
Ti => TiTi
e => HF
e => NAl
e => OMg`;

function getCountOfPossibleNewMolecules(moleculeMapData, currentMolecule) {
    var moleculeMap = moleculeMapData
        .split(/\r|\n/g)
        .map(line => line.split(' => '))
        .map(lineParts => ({ molecule: lineParts[0], replaceBy: lineParts[1] }));

    var distinctNewMolecules = [];
    for (var replacement of moleculeMap) {
        var molecule = replacement.molecule;
        var replaceBy = replacement.replaceBy;

        var instances = currentMolecule.split(molecule);
        var totalInstances = instances.length - 1;

        for (var instanceCounter = 0; instanceCounter < totalInstances; instanceCounter++) {
            var pre = instances.slice(0, instanceCounter + 1).join(molecule);
            var post = instances.slice(instanceCounter + 1).join(molecule);
            var newMolecule = pre + replaceBy + post;

            if (distinctNewMolecules.indexOf(newMolecule) == -1) {
                distinctNewMolecules.push(newMolecule);
            }
        }
    }

    return distinctNewMolecules.length;
}

function sortByLength(x, y) {
    if (x.replaceBy.length < y.replaceBy.length) {
        return 1;
    }
    else if (x.replaceBy.length == y.replaceBy.length) {
        return x.replaceBy.length == y.replaceBy.length ? 1 : -1;
    }
    else {
        return -1;
    }
}

function randomSort(x, y) {
    return Math.random() < Math.random() ? 1 : -1;
}

function currentHasReplacements(current, replacements) {
    return replacements.some(r => current.indexOf(r.replaceBy) > -1);
}

function calculateSteps(moleculeMapData, currentMolecule, totalAttempts) {
    var replacements = moleculeMapData.split(/\r|\n/g)
        .map(line => line.split(' => '))
        .map(lineParts => ({ molecule: lineParts[0], replaceBy: lineParts[1] }));
    var current;
    var steps;
    var flow = [];
    var bestSteps = 10000;

    var attemptCount = 0;
    while (attemptCount < totalAttempts) {
        replacements = replacements.sort(randomSort);
        current = currentMolecule;
        steps = 0;
        flow = [current];

        while (currentHasReplacements(current, replacements) && current != 'e') {
            for (var replacement of replacements) {
                while (current.indexOf(replacement.replaceBy) > -1) {
                    var parts = current.split(replacement.replaceBy);
                    current = parts.join(replacement.molecule);
                    steps = steps + parts.length - 1;
                    flow.push(current);
                    if (current == 'e') {
                        break;
                    }
                }
                if (current == 'e') {
                    break;
                }
            };
        }

        if (current == 'e') {
            if (steps < bestSteps) {
                bestSteps = steps;
            }
        }
        attemptCount = attemptCount + 1;
    }
    if (bestSteps < 10000) {
        return bestSteps;
    }
    else {
        return -1;
    }
}

/*
getCountOfPossibleNewMolecules(testMoleculeMapData, testInput);
calculateSteps(`e => H
e => O
H => HO
H => OH
O => HH`, testInput, 20);

calculateSteps(`e => H
e => O
H => HO
H => OH
O => HH`, `HOHOHO`, 20);
*/
//576
console.log(getCountOfPossibleNewMolecules(mainMoleculeMapData, mainInput));
//207
console.log(calculateSteps(mainMoleculeMapData, mainInput, 50));