export function map(convertor) {
    return function* (source) {
        for (const item of source) {
            yield convertor(item);
        }
    };
}

export function mapObjectPropertiesToArray(convertor) {
    return (obj) => Object.keys(obj).map(p => convertor(obj[p], p));
}

export function reduce(callback, initialValue) {
    return (source) => {
        let accumulator = initialValue;
        let currentIndex = 0;
        for (const item of source) {
            accumulator = callback(accumulator, item, currentIndex++);
        }
        return accumulator;
    };
}

export function where(predicate) {
    return function* (source) {
        for (const item of source) {
            if (predicate(item)) {
                yield item;
            }
        }
    };
}

export function any(predicate) {
    return (source) => {
        for (const item of source) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    };
}

export function take(count) {
    let fetched = 0;
    return function* (source) {
        for (const item of source) {
            if (fetched === count) {
                break;
            }
            fetched++;
            yield item;
        }
    };
}

export function forEach(action) {
    return (source) => {
        for (const item of source) {
            action(item);
        }
    };
}

export function toArray(source) {
    const result = [];
    for (const item of source) {
        result.push(item);
    }
    return result;
}

export function count(source) {
    let counter = 0;
    for (const _ of source) {
        counter++;
    }
    return counter;
}

export function* range(from, to, step = 1) {
    let current = from;
    let directionFactor = step > 0 ? 1 : -1;
    while ((to - current) * directionFactor >= 0) {
        yield current;
        current = current + step;
    }
}

export const ascendingBy = (property) => {
    return (a, b) => {
        if (a[property] > b[property]) {
            return 1;
        } else if (a[property] === b[property]) {
            return 0;
        } else {
            return -1;
        }
    };
};

export const descendingBy = (property) => {
    return (a, b) => {
        if (a[property] > b[property]) {
            return -1;
        } else if (a[property] === b[property]) {
            return 0;
        } else {
            return 1;
        }
    };
};

export const sortBy = (compareFns) => {
    const sorter = (a, b) => {
        let result = 0;
        for (const compareFn of compareFns) {
            result = compareFn(a, b);
            if (result !== 0) {
                return result;
            }
        }
        return result;
    };
    return arrayOfObjects => arrayOfObjects.sort(sorter);
};

export const query = (chain) => {
    return chain.reduce((a, f) => f(a));
};
