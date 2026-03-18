import { Difficulty } from '../types';
import { randInt } from '../utils/random';

export function generateMath(difficulty: Difficulty): { chars: string; answer: number } {
  let a: number, b: number, answer: number;
  let op: string;

  switch (difficulty) {
    case 1:
      a = randInt(0, 9);
      b = randInt(0, 9);
      answer = a + b;
      op = '+';
      break;
    case 2:
      a = randInt(0, 9);
      b = randInt(0, a); // ensures answer >= 0
      answer = a - b;
      op = '-';
      break;
    case 3:
      a = randInt(10, 19);
      b = randInt(0, 9);
      answer = a + b;
      op = '+';
      break;
    case 4:
      a = randInt(10, 49);
      b = randInt(10, a); // ensures answer >= 0
      answer = a - b;
      op = '-';
      break;
    default:
      a = randInt(0, 9);
      b = randInt(0, 9);
      answer = a + b;
      op = '+';
  }

  return { chars: `${a}${op}${b}`, answer };
}