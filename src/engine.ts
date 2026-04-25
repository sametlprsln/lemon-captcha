import { CaptchaOptions, CaptchaResult } from './types';
import { setSeed } from './utils/random';
import { generateMath } from './modules/math';
import { generateAlpha } from './modules/alpha';
import { generateLogic } from './modules/logic';
import { buildSvg } from './renderer/svg';

export function generateCaptcha(options: CaptchaOptions): CaptchaResult {
  const difficulty = options.difficulty ?? 2;
  const globalNoise = options.globalNoise ?? 2;
  
  setSeed(options.seed);

  let resultChars: string[] = [];
  let answer: string | number;
  let question: string | undefined;
  
  let width = options.width ?? 200;
  let height = options.height ?? 70;

  switch (options.type) {
    case 'math': {
      const mathRes = generateMath(difficulty);
      resultChars = [mathRes.chars];
      answer = mathRes.answer;
      break;
    }
    case 'alpha': {
      const alphaRes = generateAlpha(difficulty, options.wordPool);
      resultChars = [alphaRes.chars];
      answer = alphaRes.answer;
      break;
    }
    case 'logic': {
      const logicRes = generateLogic(difficulty);
      resultChars = logicRes.chars;
      answer = logicRes.answer;
      question = logicRes.question;
      if (logicRes.chars.length === 6 && !options.width) {
        width = 280;
      }
      break;
    }
    default:
      throw new Error(`Unsupported CAPTCHA type: ${options.type}`);
  }

  const isAnimated = globalNoise > 3 || difficulty > 3;

  const svgImage = buildSvg(resultChars, difficulty, globalNoise, width, height, isAnimated);

  const meta = {
    type: options.type,
    difficulty,
    globalNoise,
    createdAt: Date.now()
  };

  return {
    image: svgImage,
    answer,
    ...(question ? { question } : {}),
    meta
  };
}
