var mainInput = `1
2
3
5
7
13
17
19
23
29
31
37
41
43
53
59
61
67
71
73
79
83
89
97
101
103
107
109
113`;

function getSmallestQuantumEntanglement(numberOfGroups) {
    var packages = mainInput.split(/\r|\n/g).map(line => parseInt(line)).sort((x, y) => x < y ? 1 : -1);
    var totalSums = packages.reduce((acc, p) => acc + p);
    var distributedWeight = totalSums / numberOfGroups;

    var currentSum = 0;
    var minPackageForDW = 0;
    var minPackageToCrossDW = 0;

    for (var packageCounter = 0; packageCounter < packages.length; packageCounter++) {
        currentSum += packages[packageCounter];
        if (currentSum == distributedWeight) {
            minPackageForDW = packageCounter + 1;
            break;
        }
        else if (currentSum > distributedWeight) {
            minPackageToCrossDW = packageCounter + 1;
            break;
        }
    }

    if (minPackageForDW > 0) {
        console.log("You are just lucky");
        console.log(packages.slice(0, minPackageForDW).reduce((acc, p) => acc * p, 1));
        return;
    }

    var topPackages = packages.slice(0, minPackageToCrossDW);
    var remainingPackges = packages.slice(minPackageToCrossDW);
    var combinationsForPerfectDistribution = [];

    for (var topPackageCounter = 0; topPackageCounter < topPackages.length; topPackageCounter++) {
        var selTopPackages = topPackages.filter((_, index) => index != topPackageCounter);
        var sumOfSelectedTopPackages = selTopPackages.reduce((acc, item) => acc + item);
        var shortage = distributedWeight - sumOfSelectedTopPackages;

        if (remainingPackges.indexOf(shortage) > -1) {
            selTopPackages.push(shortage);
            combinationsForPerfectDistribution.push(selTopPackages);
        }
        else {
            var selRemTopPackages = remainingPackges.filter(p => p < shortage);
            for (var remPackageCounter = 0; remPackageCounter < selRemTopPackages.length; remPackageCounter++) {
                var firstPart = selRemTopPackages[remPackageCounter];
                if (firstPart < shortage / 2) {
                    break;
                }
                var secondPart = shortage - firstPart;
                if (selRemTopPackages.indexOf(secondPart) > -1) {
                    selTopPackages.push(firstPart);
                    selTopPackages.push(secondPart);
                    combinationsForPerfectDistribution.push(selTopPackages);
                    break;
                }
            }
        }
    }

    if (combinationsForPerfectDistribution.length == 0) {
        console.log('No luck with smart alogo, try brute force');
        return;
    }

    var shortestLength = combinationsForPerfectDistribution.map(c => c.length).reduce((acc, l) => acc < l ? acc : l);

    var smallestQuantumEntanglement = combinationsForPerfectDistribution
        .filter(c => c.length == shortestLength)
        .map(c => c.reduce((acc, p) => acc * p, 1))
        .reduce((acc, product) => acc < product ? acc : product);

    //did not check if the remaining packages can be divided equally into two parts
    console.log("Lucky Answer " + smallestQuantumEntanglement);
}
//10723906903
getSmallestQuantumEntanglement(3);
//74850409
getSmallestQuantumEntanglement(4);