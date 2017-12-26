let failedCount = 0;
let passCount = 0;
const startedOn = Date.now();

export function* matches(str, regex, convertor = x => x) {
    let m = regex.exec(str);
    while (m !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        yield convertor(m);
        m = regex.exec(str);
    }
}

export const matchesToArray = (str, regex, convertor = x => x) => {
    let m = regex.exec(str);
    const result = [];
    while (m !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        result.push(convertor(m));
        m = regex.exec(str);
    }
    return result;
};

export const assert = (actual, expected, message: string) => {
    if (expected === actual) {
        passCount = passCount + 1;
    } else {
        failedCount = failedCount + 1;
        console.log(`error: ${message} failed.`);
        console.log(`Expected - ${expected}`);
        console.log(`Actual - ${actual}`);
    }
};

export const printSummary = () => {
    console.log(`Executed ${failedCount + passCount}, Failed ${failedCount}`);
    console.log(`Completed in ${(Date.now() - startedOn) / 1000} s`);
};

export function* breakInChunks(str, size) {
    for (let charIndex = 0; charIndex <= str.length - size; charIndex++) {
        yield str.substr(charIndex, size);
    }
}

export const flattenArrayOfArray = (arr) => arr.reduce((acc, a) => acc.concat(a));

export class LinkedList {
    private length = 0;
    private first = null;
    private last = null;

    public get count() {
        return this.length;
    }

    public get firstNode() {
        return this.first;
    }

    public append(node) {
        if (this.first === null) {
            node.prev = node;
            node.next = node;
            this.first = node;
            this.last = node;
        } else {
            node.prev = this.last;
            node.next = this.first;
            this.first.prev = node;
            this.last.next = node;
            this.last = node;
        }
        this.length++;
    }

    public appendAfter(node, marker, steps) {
        let stepsToNext = steps < this.length ? steps : ((this.length % steps) - 1);
        let direction = "next";
        if (stepsToNext > this.length / 2) {
            stepsToNext = this.length - stepsToNext;
            direction = "prev";
        }
        console.log(stepsToNext + " " + direction);
        while (stepsToNext-- > 0) {
            marker = marker[direction];
        }

        node.prev = marker;
        node.next = marker.next;

        marker.next = node;
        node.next.prev = node;
        this.length++;
    }

    public remove(node) {
        if (this.length > 1) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
            if (node === this.first) {
                this.first = node.next;
            }
            if (node === this.last) {
                this.last = node.prev;
            }
        } else {
            this.first = null;
            this.last = null;
        }
        node.prev = null;
        node.next = null;
        this.length--;
    }
}

export const permutator = (input) => {
    const results = [];
    const permute = (arr, memo = []) => {
        let cur;
        for (let i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(cur));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
        }
    };
    permute(input);
    return results;
};
