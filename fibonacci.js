// fibonacci.js
// Shared Fibonacci clock logic (pure, testable)

export const VALUES = [1, 1, 2, 3, 5];

export const A = 0x01;
export const B = 0x02;
export const C = 0x04;
export const D = 0x08;
export const E = 0x10;

/*
  fibs[n] = array of bitmasks whose VALUES sum to n
*/
export const FIBS = [
  [0], // 0
  [A, B], // 1
  [C, A | B], // 2
  [D, A | C, B | C], // 3
  [A | D, B | D, A | B | C], // 4
  [E, C | D, A | B | D], // 5
  [A | E, B | E, A | C | D, B | C | D], // 6
  [A | B | E, C | E, A | B | C | D], // 7
  [D | E, A | C | E, B | C | E], // 8
  [A | D | E, B | D | E, A | B | C | E], // 9
  [C | D | E, A | B | D | E], // 10
  [A | C | D | E, B | C | D | E], // 11
  [A | B | C | D | E], // 12
];

/**
 * Pick a random Fibonacci bitmask for value n (0–12)
 */
export function pickFib(n) {
  if (n < 0 || n > 12) return 0;
  const choices = FIBS[n];
  return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * Sum a bitmask using Fibonacci VALUES
 * (useful for tests & validation)
 */
export function sumMask(mask) {
  let sum = 0;
  for (let i = 0; i < VALUES.length; i++) {
    if (mask & (1 << i)) sum += VALUES[i];
  }
  return sum;
}
