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

  it('Custom width and height are applied', () => {
    const res = generateCaptcha({ type: 'math', width: 350, height: 120 });
    const svgText = Buffer.from(res.image.split(',')[1], 'base64').toString('utf-8');
    expect(svgText).toContain('width="350"');
    expect(svgText).toContain('height="120"');
  });

  it('Adds animation for globalNoise > 3', () => {
    const res = generateCaptcha({ type: 'math', globalNoise: 4 });
    const svgText = Buffer.from(res.image.split(',')[1], 'base64').toString('utf-8');
    expect(svgText).toContain('<animateTransform');
  });

  it('Does not add animation for globalNoise <= 3 and difficulty <= 3', () => {
    const res = generateCaptcha({ type: 'math', globalNoise: 3, difficulty: 2 });
    const svgText = Buffer.from(res.image.split(',')[1], 'base64').toString('utf-8');
    expect(svgText).not.toContain('<animateTransform');
  });
});
