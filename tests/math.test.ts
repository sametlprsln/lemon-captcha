import { describe, it, expect } from 'vitest';
import { generateMath } from '../src/modules/math';

describe('Math Module', () => {
  it('Difficulty 1 should generate single digit addition', () => {
    const { chars, answer } = generateMath(1);
    expect(chars).toMatch(/^\d\+\d$/);
    expect(answer).toBeGreaterThanOrEqual(0);
    expect(answer).toBeLessThanOrEqual(18);
  });

  it('Difficulty 2 should generate single digit subtraction yielding >= 0', () => {
    const { chars, answer } = generateMath(2);
    expect(chars).toMatch(/^\d-\d$/);
    expect(answer).toBeGreaterThanOrEqual(0);
  });

  it('Difficulty 3 should generate two-digit + single digit addition', () => {
    const { chars, answer } = generateMath(3);
    expect(chars).toMatch(/^\d{2}\+\d$/);
    expect(answer).toBeGreaterThanOrEqual(10);
  });

  it('Difficulty 4 should generate two-digit subtraction yielding >= 0', () => {
    const { chars, answer } = generateMath(4);
    expect(chars).toMatch(/^\d{2}-\d{2}$/);
    expect(answer).toBeGreaterThanOrEqual(0);
  });
});