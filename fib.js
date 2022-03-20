/*
Fibonacci clock implementation

|-------|---|-----------|
|       | B |           |
|   C   |---|           |
|       | A |           |
|-------|---|     E     |
|           |           |
|     D     |           |
|           |           |
|-----------|-----------|

A = 1
B = 1
C = 2
D = 3
E = 5

Red = hour
Green = minute (/5)
Blue = hour & minute (/5)
White border = +minute (A=0, B=1, C=2, D=3, E=4)
 
Example: 1:41 = B/G C/G E/G, B/WB
*/

const cStatic = false;  // keep the same indication for hour until it changes
const cBoxMinute = false;  // use a box to indicate sub-minute, otw circle
const cBlinkMinute = true;

const cNumBoxes = 5;
const cBaseSize = 100;
const cBorder = 1;

const cMinuteColor = "PaleGoldenRod";
const cBorderColor = "#000000";

const cWhiteValue = 0;
const cRedValue = 1;
const cGreenValue = 2;
const cBlueValue = 3;

const cWhite = "#eeeeee";
const cRed = "#FF6961";
const cGreen = "#77DD77";
const cBlue = "#1FCECB";
const cColors = [cWhite, cRed, cGreen, cBlue];

const cBoxes = [
    boxRecord(2, 1, 1),
    boxRecord(2, 0, 1),
    boxRecord(0, 0, 2),
    boxRecord(0, 2, 3),
    boxRecord(3, 0, 5)
];

const BA = 0x01;
const BB = 0x02;
const BC = 0x04;
const BD = 0x08;
const BE = 0x10;

const cFibs = [
    fibRecord(1, [0]),									            // 0
    fibRecord(2, [BA, BB]),								            // 1 - A | B
    fibRecord(2, [BC, BA | BB]),							        // 2 - C | AB
    fibRecord(3, [BD, BA | BC, BB | BC]),					        // 3 - D | AC | BC
    fibRecord(3, [BA | BD, BB | BD, BA | BB | BC]), 			    // 4 - AD | BD | ABC
    fibRecord(3, [BE, BC | BD, BA | BB | BD]),			            // 5 - E | CD | ABD
    fibRecord(4, [BA | BE, BB | BE, BA | BC | BD, BB | BC | BD]),   // 6 - AE | BE | ACD | BCD
    fibRecord(3, [BA | BB | BE, BC | BE, BA | BB | BC | BD]),	    // 7 - ABE | CE | ABCD
    fibRecord(3, [BD | BE, BA | BC | BE, BB | BC | BE]),		    // 8 - DE | ACE | BCE
    fibRecord(3, [BA | BD | BE, BB | BD | BE, BA | BB | BC | BE]),  // 9 - ADE | BDE | ABCE
    fibRecord(2, [BC | BD | BE, BA | BB | BD | BE]),			    // 10 - CDE | ABDE
    fibRecord(2, [BA | BC | BD | BE, BB | BC | BD | BE]),		    // 11 - ACDE | BCDE
    fibRecord(1, [BA | BB | BC | BD | BE])						    // 12 - ABCDE
];

var gTimec = [0, 0, 0, 0, 0];
var gOldHour = -1;
var gOldMinute = -1;
var gCurrentMinute = 0;

var gDrawMinute = true;

function boxRecord(x, y, size) {
    return { x: x * cBaseSize, y: y * cBaseSize, size: size * cBaseSize };
}

function fibRecord(count, vals) {
    return { count: count, values: vals };
}

function pickFib(arg) {
    if ((arg < 0) || (arg > 12)) {
        return 0;
    }
    let c = cFibs[arg].count;
    let r = Math.floor(Math.random() * c);
    let f = cFibs[arg].values[r]
    return f;
}

function drawBoxes(ctx) {
    // borders
    ctx.fillStyle = cBorderColor;
    ctx.fillRect(0, 0, 8 * cBaseSize, 5 * cBaseSize);

    for (let i = 0; i < cNumBoxes; i++) {
        let size = cBoxes[i].size - 2 * cBorder;
        ctx.fillStyle = cColors[gTimec[i]];
        ctx.fillRect(cBoxes[i].x + cBorder, cBoxes[i].y + cBorder, size, size);
    }
}

function drawMinute(ctx, m) {
    // indicate the minute (0-4)
    ctx.beginPath();

    if (gDrawMinute) {
        ctx.fillStyle = cMinuteColor;
    } else {
        ctx.fillStyle = cColors[gTimec[m]];
    }

    if (cBoxMinute) {
        let width = cBoxes[m].size / 3;
        let size = cBoxes[m].size - 2 * width;
        ctx.rect(cBoxes[m].x + width, cBoxes[m].y + width, size, size);
    } else {
        let offset = cBoxes[m].size / 2;
        let radius = cBoxes[m].size / 10;
        if (!gDrawMinute) {
            radius += 1;
        }
        ctx.arc(cBoxes[m].x + offset, cBoxes[m].y + offset, radius, 0, 2 * Math.PI);
    }

    ctx.fill();
}

function drawClock(ctx) {
    let today = new Date();
    let hour = today.getHours();
    if (hour > 12) {
        hour -= 12;
    }
    gCurrentMinute = today.getMinutes();

    let hf = pickFib(hour);
    let mf = pickFib(Math.floor(gCurrentMinute / 5));
    for (let i = 0; i < cNumBoxes; i++) {
        gTimec[i] = cWhiteValue;
        if (hf & (1 << i)) {
            gTimec[i] = cRedValue;
        }
        if (mf & (1 << i)) {
            gTimec[i] += cGreenValue;
        }
    }

    gOldHour = hour;
    gOldMinute = gCurrentMinute;

    drawBoxes(ctx);
    if (!cBlinkMinute) {
        drawMinute(ctx, gCurrentMinute % 5);
    }
}

function blinkMinute(ctx) {
    drawMinute(ctx, gCurrentMinute % 5);
    gDrawMinute = !gDrawMinute;
}

function start() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");

    drawClock(ctx);

    if (cBlinkMinute) {
        setInterval(function () { blinkMinute(ctx) }, 1000);
    }

    let time = new Date();
    let secondsRemaining = (60 - time.getSeconds()) * 1000;
    setTimeout(function () { drawClock(ctx); setInterval(function () { drawClock(ctx) }, 60000) }, secondsRemaining);
}
