import { getInput } from './util';

const parse = (s: string) => s.split('').map(w => +w);
const puzzleInput = getInput('16');
const pattern = [0, 1, 0, -1];

const getPattern = (position: number, index: number) => {
  return pattern[Math.floor(index / position) % 4];
};

const findFirstEightDigits = (ip: string) => {
  const signal = parse(ip);
  for (let phase = 1; phase <= 100; phase++) {
    for (let i = 0; i < signal.length; i++) {
      let digit = 0;
      for (let j = 0; j < signal.length; j++) {
        digit = digit + signal[j] * getPattern(i + 1, j + 1);
      }
      signal[i] = Math.abs(digit) % 10;
    }
  }
  return signal.slice(0, 8).join('');
};

const findEightDigitMessage = (ip: string) => {
  let signal = parse(ip);
  for (let i = 1; i < 10000; i++) {
    for (let n = 0; n < ip.length; n++) {
      signal.push(signal[n]);
    }
  }
  let offset = +ip.slice(0, 7);
  signal = signal.slice(offset);
  // based on answer from folke
  for (let phase = 1; phase <= 100; phase++) {
    for (let i = signal.length - 1; i >= 0; i--) {
      signal[i] = Math.abs((signal[i + 1] || 0) + signal[i]) % 10;
    }
  }
  return signal.slice(0, 8).join('');
};

const check = (a: string, e: string) => {
    if(a !== e) {
        throw `Expected ${e} : Actual ${e}`;
    }
}

const t1 = '80871224585914546619083218645595';
const t2 = '19617804207202209144916044189917';
const t3 = '69317163492948606335995924319873';
const t4 = '03036732577212944063491565474664';
const t5 = '02935109699940807407585447034323';
const t6 = '03081770884921959731165446850517';
check(findFirstEightDigits(t1),'24176176');
check(findFirstEightDigits(t2),'73745418');
check(findFirstEightDigits(t3),'52432133');
check(findFirstEightDigits(puzzleInput),'28430146');
check(findEightDigitMessage(t4),'84462026');
check(findEightDigitMessage(t5),'78725270');
check(findEightDigitMessage(t6),'53553731');
check(findEightDigitMessage(puzzleInput), '12064286');