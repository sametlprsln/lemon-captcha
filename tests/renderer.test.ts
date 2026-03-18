import { describe, it, expect } from 'vitest';
import { generateCaptcha } from '../src/engine';

describe('Renderer & Engine', () => {
  it('Math creates valid base64 SVG', () => {
    const res = generateCaptcha({ type: 'math' });
    expect(res.image.startsWith('data:image/svg+xml;base64,')).toBe(true);
  });

  it('Alpha creates valid base64 SVG', () => {
    const res = generateCaptcha({ type: 'alpha', difficulty: 4 });
    expect(res.image.startsWith('data:image/svg+xml;base64,')).toBe(true);
  });

  it('Logic creates valid base64 SVG with question', () => {
    const res = generateCaptcha({ type: 'logic', difficulty: 2 });
    expect(res.image.startsWith('data:image/svg+xml;base64,')).toBe(true);
    expect(res.question).toBe("Which one is different?");
  });

  it('Higher globalNoise produces larger SVG string', () => {
    const res1 = generateCaptcha({ type: 'math', globalNoise: 1, seed: 123 });
    const res5 = generateCaptcha({ type: 'math', globalNoise: 5, seed: 123 });
    expect(res5.image.length).toBeGreaterThan(res1.image.length);
  });
});
