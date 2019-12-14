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

const minORERequired = (ip: string) => {
  const equations = parse(ip);
  adjustLevel(equations, FUEL);
  const outputs = Object.keys(equations).sort(
    descendingBy(k => equations[k].level)
  );
  equations[FUEL].requirement = 1;
  equations[ORE] = { requirement: 0 } as Equation;
  for (const output of outputs) {
    const equation = equations[output];
    const need = Math.ceil(equation.requirement / equation.quantity);
    for (const input of equation.inputs) {
      equations[input.element].requirement += input.quantity * need;
    }
  }
  return equations[ORE].requirement;
};

test('14', () => {
  expect(minORERequired('14a')).toEqual(31);
  expect(minORERequired('14b')).toEqual(165);
  expect(minORERequired('14c')).toEqual(13312);
  expect(minORERequired('14d')).toEqual(180697);
  expect(minORERequired('14e')).toEqual(2210736);
  expect(minORERequired('14')).toEqual(783895);
});
