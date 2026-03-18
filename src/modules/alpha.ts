import { Difficulty } from '../types';
import { randInt, pickRandom } from '../utils/random';

const DIGITS = '0123456789';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_POOL = [
  "CLOUD", "FIRE", "WAVE", "ECHO", "STAR", "BOLT", "FROG", "HAWK", "MINT", "JADE",
  "BEAR", "WOLF", "LION", "SWAN", "CROW", "DEER", "DOVE", "MOON", "SUN", "WIND",
  "RAIN", "SNOW", "SAND", "ROCK", "HILL", "TREE", "LEAF", "ROOT", "SEED", "FERN"
];

function randomString(length: number, charset: string): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[randInt(0, charset.length - 1)];
  }
  return result;
}

export function generateAlpha(
  difficulty: Difficulty,
  wordPool?: string[]
): { chars: string; answer: string } {
  let chars = '';

  switch (difficulty) {
    case 1:
      chars = randomString(3, DIGITS);
      break;
    case 2:
      chars = randomString(4, LETTERS);
      break;
    case 3:
      chars = randomString(5, LETTERS + DIGITS);
      break;
    case 4:
      if (wordPool && wordPool.length > 0) {
        chars = pickRandom(wordPool).toUpperCase().slice(0, 6);
      } else {
        chars = pickRandom(DEFAULT_POOL).toUpperCase().slice(0, 6);
      }
      break;
  }

  return { chars, answer: chars };
}