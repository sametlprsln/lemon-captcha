import { randFloat, randInt } from '../utils/random';
import { GlobalNoise } from '../types';

export const NOISE_CONFIG: Record<GlobalNoise, {
  displacementScale: number;
  bgLines: [number, number];
  fgLines: [number, number];
  dotCount: [number, number];
}> = {
  1: { displacementScale: 0,  bgLines: [0, 1],  fgLines: [1, 2],  dotCount: [20,  50]  },
  2: { displacementScale: 3,  bgLines: [2, 3],  fgLines: [2, 4],  dotCount: [60,  100] },
  3: { displacementScale: 5,  bgLines: [3, 5],  fgLines: [3, 5],  dotCount: [100, 150] },
  4: { displacementScale: 7,  bgLines: [4, 6],  fgLines: [4, 7],  dotCount: [140, 200] },
  5: { displacementScale: 11, bgLines: [5, 8],  fgLines: [5, 9],  dotCount: [180, 260] },
};

export function randomColor(min = 0, max = 255): string {
  return `rgb(${randInt(min, max)},${randInt(min, max)},${randInt(min, max)})`;
}