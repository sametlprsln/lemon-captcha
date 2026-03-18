import { describe, it, expect } from 'vitest';
import { generateLogic } from '../src/modules/logic';

describe('Logic Module', () => {
  it('Difficulty 1 produces 4 items, 1 letter among digits', () => {
    const res = generateLogic(1);
    expect(res.chars).toHaveLength(4);
    expect(res.chars[res.answerIndex]).toBe(res.answer);
    expect(res.question).toBe("Which one is different?");
  });

  it('Difficulty 2 produces 5 items, 1 digit among letters', () => {
    const res = generateLogic(2);
    expect(res.chars).toHaveLength(5);
    expect(res.chars[res.answerIndex]).toBe(res.answer);
  });

  it('Difficulty 3 produces 5 items, 1 even among odds', () => {
    const res = generateLogic(3);
    expect(res.chars).toHaveLength(5);
    expect(res.chars[res.answerIndex]).toBe(res.answer);
  });

  it('Difficulty 4 produces 6 items, 1 lowercase among uppercase', () => {
    const res = generateLogic(4);
    expect(res.chars).toHaveLength(6);
    expect(res.chars[res.answerIndex]).toBe(res.answer);
  });
});