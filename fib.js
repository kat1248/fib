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

  /**
   * Create a box descriptor with absolute coordinates and size scaled by BASE_SIZE.
   * @param {number} x - Horizontal grid coordinate (in base-size units).
   * @param {number} y - Vertical grid coordinate (in base-size units).
   * @param {number} size - Size of the box (in base-size units).
   * @returns {{x: number, y: number, size: number}} An object with `x`, `y`, and `size` expressed in absolute (scaled) units.
   */
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

  /**
   * Clears the entire logical canvas area used by the clock.
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context for the target canvas.
   */

  function clear(ctx) {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  }

  /**
   * Renders the clock background and fills each display box according to the current color states.
   *
   * Uses BORDER_COLOR to draw the outer background, then fills each box from the global `boxes`
   * layout using the corresponding entry in `timeColors` mapped through `COLORS`.
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context of the target canvas.
   */
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

  /**
   * Draws the minute indicator inside a specified box using the configured style.
   *
   * When the minute marker is active, the indicator is drawn using the minute color;
   * otherwise it is drawn using the box's current color. The indicator is rendered
   * as a smaller inset square when box-style minute indicators are enabled, or as
   * a small circle when they are not.
   *
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context for the canvas.
   * @param {number} index - Zero-based index of the box in which to draw the indicator.
   */
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

  /**
   * Update the clock-text element with the provided time for assistive technologies.
   *
   * Sets the element returned by textClock() to the string "The time is HH:MM" (24-hour, zero-padded).
   * No action is taken if the target element is not present.
   * @param {Date} date - Date whose hours and minutes are used to produce the HH:MM string.
   */

  function updateAccessibleTime(date) {
    const el = textClock();
    if (!el) return;

    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    el.textContent = `The time is ${h}:${m}`;
  }

  /**
   * Update the clock state for the current time and render the display.
   *
   * Updates hour and 5-minute Fibonacci masks (respecting STATIC_HOUR), updates the per-box color state array, sets the minute-indicator visibility flag when the 5-minute bucket changes, updates the accessible time text, clears and redraws the canvas, and — if BLINK_MINUTE is disabled — renders the minute indicator for the current 5-minute bucket immediately.
   *
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context for the clock canvas.
   */

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

  /**
   * Draws the minute indicator for the current 5-minute bucket and toggles its visibility state.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context used for drawing.
   */
  function blink(ctx) {
    drawMinuteIndicator(ctx, currentMinute % 5);
    drawMinute = !drawMinute;
  }

  /**
   * Initialize the canvas renderer: size the canvas, perform the initial draw, start the optional per-second blink timer, and schedule minute-aligned redraws.
   *
   * Performs no action if the canvas element cannot be found.
   */

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