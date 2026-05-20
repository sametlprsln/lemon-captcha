// LCG parameters
const m = 0x80000000;
const a = 1103515245;
const c = 12345;

let state = Math.floor(Math.random() * (m - 1));

function normalizeSeed(seed?: number | string): number | undefined {
  if (seed === undefined || seed === null) return undefined;

  if (typeof seed === 'number' && Number.isFinite(seed)) {
    return Math.abs(Math.floor(seed)) % m || 1;
  }

  const raw = String(seed).trim().toLowerCase().replace(/^0x/, '');
  if (/^[0-9a-f]{64}$/.test(raw)) {
    const chunk1 = parseInt(raw.slice(0, 8), 16);
    const chunk2 = parseInt(raw.slice(8, 16), 16);
    const chunk3 = parseInt(raw.slice(16, 24), 16);
    const chunk4 = parseInt(raw.slice(24, 32), 16);
    const chunk5 = parseInt(raw.slice(32, 40), 16);
    const chunk6 = parseInt(raw.slice(40, 48), 16);
    const chunk7 = parseInt(raw.slice(48, 56), 16);
    const chunk8 = parseInt(raw.slice(56, 64), 16);

    const mixed =
      chunk1 ^
      chunk2 ^
      chunk3 ^
      chunk4 ^
      chunk5 ^
      chunk6 ^
      chunk7 ^
      chunk8;

    return (mixed % m) || 1;
  }

  if (/^[0-9a-f]+$/i.test(raw)) {
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
    }
    return (hash % m) || 1;
  }

  return undefined;
}

export function setSeed(seed?: number | string): string | undefined {
  const normalized = normalizeSeed(seed);

  if (normalized !== undefined) {
    state = normalized;
    return typeof seed === 'string' ? String(seed).trim().toLowerCase() : String(normalized);
  }

  state = Math.floor(Math.random() * (m - 1));
  return undefined;
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
