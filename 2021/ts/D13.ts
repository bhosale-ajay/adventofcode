import { matchesToArray } from 'dotless';
import { getInput } from './util';

const regC = /\d+,\d+/gm;
const regI = /(x|y)=(\d+)/gm;
type Paper = Set<string>;
type Instruction = [number, number];
const blankPaper = () => new Set<string>();
const addCoordinatesToPaper = (p: Paper, c: string) => p.add(c);
const getAxis = (c: string) => (c === 'x' ? 0 : 1);
const lineToInstruction = (m: RegExpExecArray): Instruction => [
    getAxis(m[1]),
    +m[2],
];
const fold = (paper: Paper, [axis, foldAt]: Instruction): Paper => {
    const folded = blankPaper();
    for (const dot of paper) {
        const coords = dot.split(',');
        const value = +coords[axis];
        if (value > foldAt) {
            coords[axis] = (foldAt * 2 - value).toString();
        }
        folded.add(`${coords[0]},${coords[1]}`);
    }
    return folded;
};
const solve = (fn: string) => {
    const [cp, ip] = getInput(fn).split('\n\n');
    const cords = matchesToArray(cp, regC, m => m[0]);
    const paper = cords.reduce(addCoordinatesToPaper, blankPaper());
    const instructions = matchesToArray(ip, regI, lineToInstruction);
    const folded = instructions.reduce(fold, paper);
    let message = '';
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 40; x++) {
            message = message + (folded.has(`${x},${y}`) ? '#' : ' ');
        }
        message = message + '\n';
    }
    console.log(message);
};
solve('13');
