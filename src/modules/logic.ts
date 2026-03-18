import { Difficulty } from '../types';
import { randInt, pickRandom, shuffle } from '../utils/random';

export interface LogicCaptcha {
  chars: string[];
  answer: string;
  question: string;
  answerIndex: number;
}

const DIGITS = '0123456789'.split('');
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWER_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const EVENS = '02468'.split('');
const ODDS = '13579'.split('');

export function generateLogic(difficulty: Difficulty): LogicCaptcha {
  let items: string[] = [];
  let answer: string = '';
  let count = 0;
  
  switch (difficulty) {
    case 1: // 4 items: 1 letter among digits
      count = 4;
      items = shuffle(DIGITS).slice(0, count - 1);
      answer = pickRandom(LETTERS);
      items.push(answer);
      break;
    case 2: // 5 items: 1 digit among letters
      count = 5;
      items = shuffle(LETTERS).slice(0, count - 1);
      answer = pickRandom(DIGITS);
      items.push(answer);
      break;
    case 3: // 5 items: 1 even among odds
      count = 5;
      items = shuffle(ODDS).slice(0, count - 1);
      answer = pickRandom(EVENS);
      items.push(answer);
      break;
    case 4: // 6 items: 1 lowercase among uppercase
      count = 6;
      items = shuffle(LETTERS).slice(0, count - 1);
      answer = pickRandom(LOWER_LETTERS);
      items.push(answer);
      break;
  }

  items = shuffle(items);
  const answerIndex = items.indexOf(answer);

  return {
    chars: items,
    answer,
    question: "Which one is different?",
    answerIndex
  };
}