export type CaptchaType = 'math' | 'alpha' | 'logic';

export type Difficulty = 1 | 2 | 3 | 4;
export type GlobalNoise = 1 | 2 | 3 | 4 | 5;

export interface CaptchaOptions {
  type: CaptchaType;
  difficulty?: Difficulty;
  globalNoise?: GlobalNoise;
  wordPool?: string[];
  seed?: number | string;
  width?: number;
  height?: number;
  animated?: boolean;
}

export interface CaptchaResult {
  image: string;
  answer: string | number;
  question?: string;
  meta: {
    type: CaptchaType;
    difficulty: Difficulty;
    globalNoise: GlobalNoise;
    createdAt: number;
    animated: boolean;
    seed?: string;
  };
}
