import { getLines } from './util';

type DirectoryMap = {
    [key: string]: number;
};

type Data = { paths: string[]; dirs: DirectoryMap };

const parseLine = (data: Data, command: string) => {
    if (command.startsWith('$ cd ')) {
        const arg = command.slice(5);
        if (arg === '/') {
            data.paths = [''];
        } else if (arg === '..') {
            data.paths.pop();
        } else {
            const last = data.paths[data.paths.length - 1];
            data.paths.push(last + '/' + arg);
        }
    } else if (command.startsWith('dir ')) {
        const name = command.slice(4);
        const last = data.paths[data.paths.length - 1];
        const path = last + '/' + name;
        data.dirs[path] = 0;
    } else if (!command.startsWith('$')) {
        const parts = command.split(' ');
        const size = +parts[0];
        for (const path of data.paths) {
            data.dirs[path] += size;
        }
    }
    return data;
};

const solve = (fn: string) => {
    const d = getLines(fn).reduce(parseLine, { paths: [], dirs: { '': 0 } });
    const totalUsed = d.dirs[''];
    const unused = 70000000 - totalUsed;
    const gap = 30000000 - unused;
    let sum = 0;
    let selected = Number.MAX_SAFE_INTEGER;
    for (const size of Object.values(d.dirs)) {
        if (size <= 100000) {
            sum = sum + size;
        }
        if (size > gap && selected > size) {
            selected = size;
        }
    }
    return [sum, selected];
};

test('07', () => {
    const t = solve('07-test');
    const a = solve('07');
    expect(t).toEqual([95437, 24933642]);
    expect(a).toEqual([1583951, 214171]);
});
