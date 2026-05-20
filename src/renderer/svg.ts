import { FONT } from './font';
import { NOISE_CONFIG, randomColor } from './noise';
import { randInt, randFloat, shuffle } from '../utils/random';
import { Difficulty, GlobalNoise } from '../types';

function generateFakeString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-=?';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[randInt(0, chars.length - 1)];
  }
  return res;
}

export function buildSvg(
  items: string[],
  difficulty: Difficulty,
  globalNoise: GlobalNoise,
  width = 200,
  height = 70,
  animated = false
): string {
  const config = NOISE_CONFIG[globalNoise];
  const bgR = randInt(230, 255);
  const bgG = randInt(230, 255);
  const bgB = randInt(230, 255);

  const totalChars = items.reduce((sum, item) => sum + item.length, 0);
  const charColors: string[] = [];
  for (let i = 0; i < totalChars; i++) {
    charColors.push(randomColor(0, 150));
  }

  function pickCamouflageColor(): string {
    return charColors[randInt(0, charColors.length - 1)];
  }

  const glyphHeight = 7;
  const glyphWidth = 5;
  const paddingX = Math.max(12, Math.floor(width * 0.06));
  const paddingY = Math.max(10, Math.floor(height * 0.12));

  const maxLines = Math.max(1, items.length);
  const maxCharsPerLine = Math.max(...items.map(item => item.length), 1);

  const usableWidth = Math.max(1, width - paddingX * 2);
  const usableHeight = Math.max(1, height - paddingY * 2);

  const scaleX = usableWidth / (maxCharsPerLine * (glyphWidth + 1));
  const scaleY = usableHeight / (maxLines * (glyphHeight + 1));
  const scale = Math.max(1, Math.min(scaleX, scaleY));

  const textBlockWidth = maxCharsPerLine * (glyphWidth * scale) + (maxCharsPerLine - 1) * (scale * 1.3);
  const textBlockHeight = maxLines * (glyphHeight * scale) + (maxLines - 1) * (scale * 1.5);

  const startX = Math.max(paddingX, Math.floor((width - textBlockWidth) / 2));
  const startY = Math.max(paddingY, Math.floor((height - textBlockHeight) / 2));

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;

  const seed = randInt(1, 1000);
  if (config.displacementScale > 0) {
    svg += `
      <defs>
        <filter id="warp" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="${randFloat(0.01, 0.05).toFixed(3)} ${randFloat(0.05, 0.1).toFixed(3)}" numOctaves="2" seed="${seed}" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="${config.displacementScale}" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    `;
  }

  svg += `<rect width="100%" height="100%" fill="rgb(${bgR},${bgG},${bgB})" />`;

  const fakeLen = totalChars > 0 ? totalChars : 5;
  svg += `<text x="-9999" y="-9999" aria-hidden="true">${generateFakeString(fakeLen)}</text>`;
  svg += `<text x="${randInt(10, Math.max(11, width - 20))}" y="${randInt(10, Math.max(11, height - 10))}" opacity="0.0001" font-size="0.1">${generateFakeString(fakeLen + 1)}</text>`;
  svg += `<text x="${randInt(10, Math.max(11, width - 20))}" y="${randInt(10, Math.max(11, height - 10))}" fill="transparent">${randInt(10, 99)}+${randInt(1, 9)}</text>`;

  const numFakePaths = randInt(4, 8);
  for (let i = 0; i < numFakePaths; i++) {
    const fx = randInt(0, width).toFixed(2);
    const fy = randInt(0, height).toFixed(2);
    const fx2 = randInt(0, width).toFixed(2);
    const fy2 = randInt(0, height).toFixed(2);
    svg += `<path d="M${fx},${fy} C${fx2},${fy} ${fx},${fy2} ${fx2},${fy2}" fill="none" stroke="${pickCamouflageColor()}" stroke-width="${randFloat(0.8, 1.8).toFixed(1)}" opacity="${randFloat(0.15, 0.35).toFixed(2)}" />`;
  }

  const numBgLines = randInt(config.bgLines[0], config.bgLines[1]);
  for (let i = 0; i < numBgLines; i++) {
    const strokeColor = pickCamouflageColor();
    svg += `<line x1="${randInt(0, width)}" y1="${randInt(0, height)}" x2="${randInt(0, width)}" y2="${randInt(0, height)}" stroke="${strokeColor}" stroke-width="${randFloat(0.8, 2).toFixed(1)}" opacity="${randFloat(0.2, 0.5).toFixed(2)}" />`;
  }

  const dotCount = randInt(config.dotCount[0], config.dotCount[1]);
  for (let i = 0; i < dotCount; i++) {
    svg += `<circle cx="${randInt(0, width)}" cy="${randInt(0, height)}" r="${randFloat(0.4, 1.2).toFixed(1)}" fill="${pickCamouflageColor()}" opacity="${randFloat(0.15, 0.45).toFixed(2)}" />`;
  }

  svg += `<g ${config.displacementScale > 0 ? 'filter="url(#warp)"' : ''}>`;

  let blockIndex = 0;
  let cursorY = startY;

  for (const block of items) {
    let cursorX = startX;
    const charWidth = glyphWidth * scale;
    const baseSpacing = scale * 1.3;

    for (let charIndex = 0; charIndex < block.length; charIndex++) {
      const char = block[charIndex];
      const glyph = FONT[char] || FONT['?'];
      const color = charColors[blockIndex * block.length + charIndex] ?? pickCamouflageColor();

      const isOperator = char === '+' || char === '-';
      const rot = isOperator ? 0 : randInt(-5 * difficulty, 5 * difficulty);
      const dy = randInt(-2 * difficulty, 2 * difficulty);
      const localCursorY = Math.floor(cursorY) + dy;

      const cx = cursorX + (charWidth / 2);
      const cy = localCursorY + (glyphHeight * scale / 2);

      const pathSegments: string[] = [];
      for (let y = 0; y < 7; y++) {
        const row = glyph[y];
        for (let x = 0; x < 5; x++) {
          if ((row & (0x80 >> x)) !== 0) {
            const px = (cursorX + x * scale).toFixed(2);
            const py = (localCursorY + y * scale).toFixed(2);
            pathSegments.push(`M${px},${py}h${scale.toFixed(2)}v${scale.toFixed(2)}h-${scale.toFixed(2)}Z`);
          }
        }
      }

      const d = shuffle(pathSegments).join('');

      let animationTag = '';
      if (animated) {
        const dur = randFloat(1.5, 4.0).toFixed(1);
        const transX = randFloat(-2, 2).toFixed(1);
        const transY = randFloat(-3, 3).toFixed(1);
        animationTag = `<animateTransform attributeName="transform" type="translate" values="0,0; ${transX},${transY}; 0,0" dur="${dur}s" repeatCount="indefinite" additive="sum"/>`;
      }

      svg += `<path d="${d}" fill="${color}" transform="rotate(${rot}, ${cx}, ${cy})">${animationTag}</path>`;

      cursorX += charWidth + baseSpacing;
    }

    cursorY += glyphHeight * scale + scale * 1.5;
    blockIndex++;
  }

  const numFgLines = randInt(config.fgLines[0], config.fgLines[1]);
  for (let i = 0; i < numFgLines; i++) {
    const strokeColor = pickCamouflageColor();
    if (randInt(0, 1) === 0) {
      svg += `<line x1="${randInt(0, width)}" y1="${randInt(0, height)}" x2="${randInt(0, width)}" y2="${randInt(0, height)}" stroke="${strokeColor}" stroke-width="${randFloat(1.5, 3).toFixed(1)}" opacity="${randFloat(0.5, 0.9).toFixed(2)}" />`;
    } else {
      svg += `<path d="M${randInt(0, width)},${randInt(0, height)} Q${randInt(0, width)},${randInt(0, height)} ${randInt(0, width)},${randInt(0, height)}" fill="none" stroke="${strokeColor}" stroke-width="${randFloat(1.5, 3).toFixed(1)}" opacity="${randFloat(0.5, 0.9).toFixed(2)}" />`;
    }
  }

  svg += `</g>`;
  svg += `</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
