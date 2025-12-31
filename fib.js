// fib.js
// Fibonacci Clock renderer (hour, minute, both) with accessibility

import { pickFib } from "./fibonacci.js";

(() => {
  "use strict";

  /* -------------------------
   * Configuration
   * ------------------------- */

  const STATIC_HOUR = true;
  const BLINK_MINUTE = true;
  const BOX_MINUTE = false;

  const NUM_BOXES = 5;
  const BASE_SIZE = 100;
  const BORDER = 1;

  const LOGICAL_WIDTH = 8 * BASE_SIZE;
  const LOGICAL_HEIGHT = 5 * BASE_SIZE;

  const SECOND_MS = 1000;
  const MINUTE_MS = 60000;

  /* -------------------------
   * Colors
   * ------------------------- */

  const WHITE = "#eeeeee"; // neither
  const RED = "#FF6961"; // hour
  const GREEN = "#77DD77"; // minute
  const BLUE = "#1AA3A3"; // hour + minute
  const MINUTE_COLOR = "PaleGoldenRod";
  const BORDER_COLOR = "#000000";

  const COLORS = [WHITE, RED, GREEN, BLUE];

  const COLOR_NONE = 0;
  const COLOR_HOUR = 1;
  const COLOR_MINUTE = 2;
  const COLOR_BOTH = 3;

  /* -------------------------
   * Geometry
   * ------------------------- */

  const boxes = [
    box(2, 1, 1),
    box(2, 0, 1),
    box(0, 0, 2),
    box(0, 2, 3),
    box(3, 0, 5),
  ];

  function box(x, y, size) {
    return { x: x * BASE_SIZE, y: y * BASE_SIZE, size: size * BASE_SIZE };
  }

  /* -------------------------
   * DOM helpers
   * ------------------------- */

  const canvas = () => document.getElementById("myCanvas");
  const textClock = () => document.getElementById("clock-text");

  /* -------------------------
   * State
   * ------------------------- */

  const timeColors = new Array(NUM_BOXES).fill(COLOR_NONE);
  let currentMinute = 0;
  let drawMinute = true;

  let lastHour = -1;
  let lastMinute5 = -1;
  let hourFib = 0;
  let minuteFib = 0;

  /* -------------------------
   * Drawing helpers
   * ------------------------- */

  function clear(ctx) {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  }

  function drawBoxes(ctx) {
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    for (let i = 0; i < NUM_BOXES; i++) {
      const b = boxes[i];
      const size = b.size - 2 * BORDER;
      ctx.fillStyle = COLORS[timeColors[i]];
      ctx.fillRect(b.x + BORDER, b.y + BORDER, size, size);
    }
  }

  function drawMinuteIndicator(ctx, index) {
    const b = boxes[index];
    ctx.beginPath();

    ctx.fillStyle = drawMinute ? MINUTE_COLOR : COLORS[timeColors[index]];

    if (BOX_MINUTE) {
      const w = b.size / 3;
      const s = b.size - 2 * w;
      ctx.rect(b.x + w, b.y + w, s, s);
    } else {
      const r = b.size / 10 + (drawMinute ? 0 : 1);
      ctx.arc(b.x + b.size / 2, b.y + b.size / 2, r, 0, Math.PI * 2);
    }

    ctx.fill();
  }

  /* -------------------------
   * Accessibility
   * ------------------------- */

  function updateAccessibleTime(date) {
    const el = textClock();
    if (!el) return;

    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    el.textContent = `The time is ${h}:${m}`;
  }

  /* -------------------------
   * Clock logic
   * ------------------------- */

  function drawClock(ctx) {
    const now = new Date();

    let hour = now.getHours() % 12;
    if (hour === 0) hour = 12;

    currentMinute = now.getMinutes();
    const minute5 = Math.floor(currentMinute / 5);

    if (!STATIC_HOUR || hour !== lastHour) {
      hourFib = pickFib(hour);
      lastHour = hour;
    }

    if (minute5 !== lastMinute5) {
      minuteFib = pickFib(minute5);
      lastMinute5 = minute5;
      drawMinute = true;
      updateAccessibleTime(now);
    }

    for (let i = 0; i < NUM_BOXES; i++) {
      const hasHour = (hourFib & (1 << i)) !== 0;
      const hasMinute = (minuteFib & (1 << i)) !== 0;

      if (hasHour && hasMinute) timeColors[i] = COLOR_BOTH;
      else if (hasHour) timeColors[i] = COLOR_HOUR;
      else if (hasMinute) timeColors[i] = COLOR_MINUTE;
      else timeColors[i] = COLOR_NONE;
    }

    clear(ctx);
    drawBoxes(ctx);

    if (!BLINK_MINUTE) drawMinuteIndicator(ctx, currentMinute % 5);
  }

  function blink(ctx) {
    drawMinuteIndicator(ctx, currentMinute % 5);
    drawMinute = !drawMinute;
  }

  /* -------------------------
   * Startup
   * ------------------------- */

  function start() {
    const c = canvas();
    if (!c) return;

    c.width = LOGICAL_WIDTH;
    c.height = LOGICAL_HEIGHT;

    const ctx = c.getContext("2d");

    drawClock(ctx);

    if (BLINK_MINUTE) setInterval(() => blink(ctx), SECOND_MS);

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    setTimeout(() => {
      drawClock(ctx);
      setInterval(() => drawClock(ctx), MINUTE_MS);
    }, delay);
  }

  window.addEventListener("DOMContentLoaded", start);
})();
