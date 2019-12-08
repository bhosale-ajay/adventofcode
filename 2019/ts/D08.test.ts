import { getInput } from './util';
import { countBy } from 'dotless';

const [B, W, T] = ['0', '1', '2'];
// prettier-ignore
const puzzleInput = (getInput('08').match(/.{1,150}/g) as RegExpMatchArray).map(l => l.split(''));

const checkImageValidity = () => {
  const layerWithFewest0 = puzzleInput
    .map(countBy())
    .reduce((acc, l) => (l[B] < acc[B] ? l : acc));
  return layerWithFewest0[W] * layerWithFewest0[T];
};

const displayMessage = () => {
  const finalLayer = puzzleInput[0];
  for (let li = 1; li < puzzleInput.length; li++) {
    const current = puzzleInput[li];
    for (let pi = 0; pi < current.length; pi++) {
      if (finalLayer[pi] === T && current[pi] !== T) {
        finalLayer[pi] = current[pi];
      }
    }
  }
  const m = finalLayer.join('').match(/.{1,25}/g) as RegExpMatchArray;
  // prettier-ignore
  console.log(m.join('\n').replace(/0/g, ' ').replace(/1/g, '|'));
};

test('08 Part 1', () => {
  expect(checkImageValidity()).toEqual(2684);
  displayMessage();
});
