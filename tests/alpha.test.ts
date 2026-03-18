import { describe, it, expect } from 'vitest';
import { generateAlpha } from '../src/modules/alpha';

describe('Alpha Module', () => {
  it('Difficulty 1 produces 3 digits', () => {
    const { chars, answer } = generateAlpha(1);
    expect(chars).toHaveLength(3);
    expect(chars).toMatch(/^\d{3}$/);
    expect(answer).toBe(chars);
  });

  it('Difficulty 2 produces 4 uppercase letters', () => {
    const { chars, answer } = generateAlpha(2);
    expect(chars).toHaveLength(4);
    expect(chars).toMatch(/^[A-Z]{4}$/);
    expect(answer).toBe(chars);
  });

  it('Difficulty 3 produces 5 mixed chars', () => {
    const { chars, answer } = generateAlpha(3);
    expect(chars).toHaveLength(5);
    expect(chars).toMatch(/^[A-Z0-9]{5}$/);
    expect(answer).toBe(chars);
  });

  it('Difficulty 4 respects custom wordPool', () => {
    const pool = ['TESTWORD', 'HELLO'];
    const { chars, answer } = generateAlpha(4, pool);
    expect(['TESTWO', 'HELLO']).toContain(chars);
    expect(answer).toBe(chars);
  });
});