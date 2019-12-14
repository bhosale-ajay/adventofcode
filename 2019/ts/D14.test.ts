import { getInput, Dictionary } from './util';
import { matchesToArray, descendingBy } from 'dotless';

interface Input {
  element: string;
  quantity: number;
}
interface Equation {
  quantity: number;
  requirement: number;
  inputs: Input[];
  level: number;
}
type Equations = Dictionary<Equation>;
const [ORE, FUEL] = ['ORE', 'FUEL'];

const lineToEquation = (d: Equations, l: string) => {
  const ps = matchesToArray(l, /(\d+)\s([A-Z]+)/g);
  const [_, quantity, product] = ps.pop() as string[];
  const inputs = ps.map(p => ({ element: p[2], quantity: +p[1] }));
  const level = inputs.length === 1 && inputs[0].element === ORE ? 1 : -1;
  // prettier-ignore
  const equation = { quantity: +quantity, requirement: 0, inputs, level };
  d[product] = equation;
  return d;
};

// prettier-ignore
const parse = (ip: string) => getInput(ip).split('\n').reduce(lineToEquation, {} as Equations);

const adjustLevel = (eq: Equations, product: string) => {
  const equation = eq[product];
  if (equation.level > -1) {
    return equation.level;
  }
  let maxChildLevel = 0;
  for (const input of equation.inputs) {
    maxChildLevel = Math.max(maxChildLevel, adjustLevel(eq, input.element));
  }
  equation.level = maxChildLevel + 1;
  return equation.level;
};

const findRequirement = (
  equations: Equations,
  order: string[],
  requirement: number
) => {
  order.forEach(p => (equations[p].requirement = 0));
  equations[FUEL].requirement = requirement;
  equations[ORE].requirement = 0;
  for (const product of order) {
    const equation = equations[product];
    const need = Math.ceil(equation.requirement / equation.quantity);
    for (const input of equation.inputs) {
      equations[input.element].requirement += input.quantity * need;
    }
  }
  return equations[ORE].requirement;
};

const minORERequired = (ip: string) => {
  const es = parse(ip);
  adjustLevel(es, FUEL);
  const order = Object.keys(es).sort(descendingBy(k => es[k].level));
  es[ORE] = { requirement: 0 } as Equation;
  return findRequirement(es, order, 1);
};

const findMaxFuel = (ip: string) => {
  const es = parse(ip);
  adjustLevel(es, FUEL);
  const order = Object.keys(es).sort(descendingBy(k => es[k].level));
  es[ORE] = { requirement: 0 } as Equation;
  const trillion = 1000000000000;
  let upperBound = 1;
  while (findRequirement(es, order, upperBound) < trillion) {
    upperBound = upperBound * 10;
  }
  let lowerBound = upperBound / 10;
  while (lowerBound !== upperBound) {
    const guess = lowerBound + Math.floor((upperBound - lowerBound) / 2);
    if (guess === lowerBound) {
      break;
    }
    if (findRequirement(es, order, guess) <= trillion) {
      lowerBound = guess;
    } else {
      upperBound = guess - 1;
    }
  }
  return lowerBound;
};

test('14 Part 1', () => {
  expect(minORERequired('14a')).toEqual(31);
  expect(minORERequired('14b')).toEqual(165);
  expect(minORERequired('14c')).toEqual(13312);
  expect(minORERequired('14d')).toEqual(180697);
  expect(minORERequired('14e')).toEqual(2210736);
  expect(minORERequired('14')).toEqual(783895);
});

test('14 Part 2', () => {
  expect(findMaxFuel('14c')).toEqual(82892753);
  expect(findMaxFuel('14d')).toEqual(5586022);
  expect(findMaxFuel('14e')).toEqual(460664);
  expect(findMaxFuel('14')).toEqual(1896688);
});
