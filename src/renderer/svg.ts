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

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
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
  svg += `<text x="${randInt(10, width - 20)}" y="${randInt(10, height - 10)}" opacity="0.0001" font-size="0.1">${generateFakeString(fakeLen + 1)}</text>`;
  svg += `<text x="${randInt(10, width - 20)}" y="${randInt(10, height - 10)}" fill="transparent">${randInt(10, 99)}+${randInt(1, 9)}</text>`;
  
  const numFakePaths = randInt(4, 8);
  for (let i = 0; i < numFakePaths; i++) {
    const fx = randInt(0, width).toFixed(2);
    const fy = randInt(0, height).toFixed(2);
    const fakePathD = `M${fx},${fy}h${randFloat(2,6).toFixed(2)}v${randFloat(2,6).toFixed(2)}h-${randFloat(2,6).toFixed(2)}Z M${(parseFloat(fx)+5).toFixed(2)},${(parseFloat(fy)+5).toFixed(2)}v${randFloat(2,6).toFixed(2)}Z`;
    
    const trapStyles = [
      `opacity="0"`,
      `fill="none" stroke="none"`,
      `stroke-width="0.001" stroke="transparent" fill="transparent"`,
      `visibility="hidden"`
    ];
    svg += `<path d="${fakePathD}" ${trapStyles[randInt(0, trapStyles.length - 1)]} class="captcha-bg-element" />`;
  }

  const filterAttr = config.displacementScale > 0 ? `filter="url(#warp)"` : '';
  svg += `<g ${filterAttr}>`;

  const numBgLines = randInt(config.bgLines[0], config.bgLines[1]);
  for (let i = 0; i < numBgLines; i++) {
    svg += `<line x1="${randInt(0, width)}" y1="${randInt(0, height)}" x2="${randInt(0, width)}" y2="${randInt(0, height)}" stroke="${pickCamouflageColor()}" stroke-width="${randFloat(1, 3).toFixed(1)}" opacity="${randFloat(0.3, 0.7).toFixed(2)}" />`;
  }

  const scale = 5.5;
  const charWidth = 5 * scale;
  const totalSpacing = width - (totalChars * charWidth);
  const baseSpacing = totalSpacing / (totalChars + 1);
  
  let cursorX = baseSpacing;
  let colorIndex = 0;

  for (let blockIndex = 0; blockIndex < items.length; blockIndex++) {
    const block = items[blockIndex];
    for (let charIndex = 0; charIndex < block.length; charIndex++) {
      const char = block[charIndex];
      const glyph = FONT[char] || FONT['?'];
      const color = charColors[colorIndex++];
      
      const isOperator = char === '+' || char === '-';
      const rot = isOperator ? 0 : randInt(-5 * difficulty, 5 * difficulty);
      const dy = randInt(-2 * difficulty, 2 * difficulty);
      const cursorY = Math.floor((height - 7 * scale) / 2) + dy;
      
      const cx = cursorX + (charWidth / 2);
      const cy = cursorY + (7 * scale / 2);
      
      const pathSegments: string[] = [];
      for (let y = 0; y < 7; y++) {
        const row = glyph[y];
        for (let x = 0; x < 5; x++) {
          if ((row & (0x80 >> x)) !== 0) {
            const px = (cursorX + x * scale).toFixed(2);
            const py = (cursorY + y * scale).toFixed(2);
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

  const numDots = randInt(config.dotCount[0], config.dotCount[1]);
  for (let i = 0; i < numDots; i++) {
    svg += `<circle cx="${randInt(0, width)}" cy="${randInt(0, height)}" r="${randFloat(0.5, 1.5).toFixed(2)}" fill="${pickCamouflageColor()}" opacity="${randFloat(0.5, 0.9).toFixed(2)}" />`;
  }

  svg += `</svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
