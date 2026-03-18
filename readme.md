# 🍋 lemon-captcha

A framework-agnostic, zero-dependency SVG CAPTCHA generation engine written in pure TypeScript. It generates math, alphanumeric, and logic CAPTCHAs as inline SVG strings — no canvas, no DOM, no Node.js built-ins.

Works identically in Node.js, Deno, Bun, and browser edge runtimes.

## Why lemon-captcha?
Most CAPTCHA libraries are 5+ years old. They rely on standard font paths that modern AI can decode in milliseconds. lemon-captcha uses a custom 5x7 bitmap matrix and shuffled path segments, meaning the SVG code itself is a chaotic cloud of points that only the human brain can reassemble.

![Sample captcha 1](https://raw.githubusercontent.com/sametlprsln/lemon-captcha/main/assets/sample1.jpg)
![Sample captcha 2](https://raw.githubusercontent.com/sametlprsln/lemon-captcha/main/assets/sample2.jpg)

## Install

```bash
npm install lemon-captcha
```

## Quick Start

### Math CAPTCHA
```typescript
import { generateCaptcha } from 'lemon-captcha';

const captcha = generateCaptcha({ type: 'math', difficulty: 2, globalNoise: 3 });
console.log(captcha.answer); // e.g. 5
console.log(captcha.image);  // "data:image/svg+xml;base64,..."
```

### Alphanumeric CAPTCHA
```typescript
const captcha = generateCaptcha({ 
  type: 'alpha', 
  difficulty: 4, 
  wordPool: ["HELLO", "WORLD"] 
});
console.log(captcha.answer); // "HELLO"
```

### Logic CAPTCHA
```typescript
const captcha = generateCaptcha({ type: 'logic', difficulty: 3 });
console.log(captcha.question); // "Which one is different?"
console.log(captcha.answer);   // "2" (e.g., if array was [1,3,2,7,9])
```

## API Reference

### `CaptchaOptions`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | `'math' \| 'alpha' \| 'logic'` | **Required** | The category of CAPTCHA. |
| `difficulty` | `1 \| 2 \| 3 \| 4` | `2` | Module-specific difficulty. |
| `globalNoise`| `1 \| 2 \| 3 \| 4 \| 5` | `2` | Visual distortion & noise element density. |
| `wordPool` | `string[]` | Built-in | Custom words for Alpha difficulty 4. |
| `seed` | `number` | undefined | Seed for deterministic SVG output (testing). |

### `CaptchaResult`
| Field | Type | Description |
|-------|------|-------------|
| `image` | `string` | Base64 Data URI of the generated SVG. |
| `answer` | `string \| number` | Canonical answer for validation. |
| `question`| `string \| undefined` | Text prompt (used by 'logic' module). |
| `meta` | `Object` | Included generation metadata for backend tracking. |

## Difficulty Matrix

| Module | Level 1 | Level 2 | Level 3 | Level 4 |
|--------|---------|---------|---------|---------|
| **Math** | Single-digit addition (0-9) | Single-digit subtraction (>=0) | 2-digit + 1-digit addition | 2-digit subtraction (>=0) |
| **Alpha**| 3 digits | 4 uppercase letters | 5 mixed characters | 6-char word from pool / mixed |
| **Logic**| 1 letter among digits (4 items) | 1 digit among letters (5 items) | 1 even among odds (5 items) | 1 lowercase among uppercase (6 items)|

## Global Noise Levels

| Level | Distortion | Background Lines | Foreground Lines | Dot Count |
|-------|------------|------------------|------------------|-----------|
| **1** | None | 0-1 | 1-2 | 20-50 |
| **2** | Low | 2-3 | 2-4 | 60-100 |
| **3** | Medium | 3-5 | 3-5 | 100-150 |
| **4** | High | 4-6 | 4-7 | 140-200 |
| **5** | Extreme | 5-8 | 5-9 | 180-260 |

## Roadmap
- **v0.1.5**: Sound CAPTCHA support
- **v0.2.0**: SVG Slider CAPTCHA support

## Beyond the "Sarı Odalar"
Building a "next-gen" security tool is hard. Building it from a place where global financial bridges are burned is harder.

I have spent countless hours crafting this engine that even the most advanced AI models (GPT-5, Gemini 3.1 Pro) fail to decode. But here is the irony: I am building a tool to protect the global web, yet I am financially isolated from it.

Where I am, the bureaucracy like a maze. Global payment gateways like Stripe or PayPal are closed to us. I feel like I’m in Sezen Aksu’s famous song “Sarı Odalar”; you’re creating, but the doors opening to the outside world are always heavy and locked.

If you find value in this project, know that your support isn't just a "donation." It is a bridge over a moat that I am not allowed to cross.

<a href="https://www.youtube.com/watch?v=vjU-RcwSwO4">Sezen Aksu - Sarı Odalar</a>

### Support the lemon-captcha
Those "buy me a coffee" buttons in the rest of the world don't work in my world. That's why blockchain is the only way to overcome the borders and bureaucracy. For me, it's the only donation method without boundaries.

- Ethereum: 0x3b0eF54Ee8701665656F15A8F75418B6b14B7BC0
- Solana: D8Q12hmN3qacQ99D2P64mY86QzS7hrFoZcRG5M3m48t9
- Bitcoin: bc1qkyx6n0z6f4575t9ztecwucl8yhuksl4xaftygg
