// LCG parameters
const m = 0x80000000;
const a = 1103515245;
const c = 12345;

let state = Math.floor(Math.random() * (m - 1));

export function setSeed(seed?: number): void {
  if (seed !== undefined) {
    state = seed ? seed % m : 1;
  } else {
    state = Math.floor(Math.random() * (m - 1));
  }
}

export function nextRandom(): number {
  state = (a * state + c) % m;
  return state / (m - 1);
}

export function randFloat(min: number, max: number): number {
  return nextRandom() * (max - min) + min;
}

export function randInt(min: number, max: number): number {
  return Math.floor(randFloat(min, max + 1));
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}