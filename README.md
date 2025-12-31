
# Fibonacci Clock

A visual **Fibonacci Clock** implemented in JavaScript and HTML. The clock represents the current time using five squares corresponding to Fibonacci numbers:

| Box | Value |
|-----|-------|
| A   | 1     |
| B   | 1     |
| C   | 2     |
| D   | 3     |
| E   | 5     |

- **Red** = hour
- **Green** = minute (in 5-minute increments)
- **Blue** = hour + minute
- **White** = unused

A blinking indicator shows the minutes (0–4) inside the corresponding box.

---

## Clock Layout

The boxes are arranged visually like this:

```
+-------+---+-----------+
|       | B |           |
|   C   |---|           |
|       | A |           |
+-------+---+     E     |
|           |           |
|     D     |           |
|           |           |
+-----------+-----------+
```

- **A** = 1
- **B** = 1
- **C** = 2
- **D** = 3
- **E** = 5

---

## Color Example

This shows the **meaning of each color** inline:

<div style="display:flex; gap:8px; margin-top:8px;">
  <div style="width:40px; height:40px; background:#FF6961; border:1px solid #000;"></div>
  <span>Hour</span>
</div>
<div style="display:flex; gap:8px; margin-top:4px;">
  <div style="width:40px; height:40px; background:#77DD77; border:1px solid #000;"></div>
  <span>Minute</span>
</div>
<div style="display:flex; gap:8px; margin-top:4px;">
  <div style="width:40px; height:40px; background:#1AA3A3; border:1px solid #000;"></div>
  <span>Hour + Minute</span>
</div>
<div style="display:flex; gap:8px; margin-top:4px;">
  <div style="width:40px; height:40px; background:#eeeeee; border:1px solid #000;"></div>
  <span>Unused</span>
</div>


This visually illustrates what each color represents on the clock.

## Features

- Pure JavaScript, no frameworks

- Responsive and accessible (aria-live text updates)

- Optional blinking minute indicator

- Explicit color semantics (hour, minute, both)

- Fully testable Fibonacci logic

## Files

- fib.html – main HTML page with canvas

- fib.js – clock renderer

- fibonacci.js – core Fibonacci logic (pick combinations, bitmasks)

- test/fib.test.js – unit tests

## Running Locally

1. Clone the repository:

```sh
git clone <repo-url>
cd <repo-folder>
```


2. Install dependencies (for testing):

```sh
npm install
```

3. Start a local server to view the clock in a browser (required for ES modules):

```sh
npx serve .
```

## Running Tests

Tests verify the Fibonacci logic (bitmasks and sums) using Mocha.

1. Ensure dependencies are installed:

```sh
npm install
```

2. Run the tests:

```sh
npm tests
```

3. Expected output:

```
  Fibonacci combinations
    ✓ all combinations sum correctly
    ✓ no mask uses invalid bits
    ✓ zero uses only empty mask
    ✓ twelve uses all boxes
```