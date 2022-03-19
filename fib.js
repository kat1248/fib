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

const cStatic = true;
const cNumBoxes = 5;
const cBaseSize = 50;
const cBorder = 2;

const BA = 0x01;
const BB = 0x02;
const BC = 0x04;
const BD = 0x08;
const BE = 0x10;

const cRedValue = 1;
const cGreenValue = 2;
const cWhite = "#eeeeee";

const cRed = "#ff0000";	   // "#FF6961"
const cGreen = "#00ff00";  // "#77DD77"
const cBlue = "#0000ff";   // "#1FCECB"
const cColors = [cWhite, cRed, cGreen, cBlue];

const cBoxes = [
    boxRecord(2, 1, 1),
    boxRecord(2, 0, 1),
    boxRecord(0, 0, 2),
    boxRecord(0, 2, 3),
    boxRecord(3, 0, 5)
];

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

var gTimec = [];
var gOldHour, gOldMinute;

function boxRecord(x, y, size) {
    return { x: x * cBaseSize, y: y * cBaseSize, size: size * cBaseSize };
}

function fibRecord(count, vals) {
    return { count: count, values: vals };
}

function drawBoxes(vals, blink) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");

    // borders
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 8 * cBaseSize, 5 * cBaseSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cBoxes[blink].x, cBoxes[blink].y, cBoxes[blink].size, cBoxes[blink].size);

    for (let i = 0; i < cNumBoxes; i++) {
        ctx.fillStyle = cColors[vals[i]];
        ctx.fillRect(cBoxes[i].x + cBorder, cBoxes[i].y + cBorder, cBoxes[i].size - 2 * cBorder, cBoxes[i].size - 2 * cBorder);
    }
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

function drawClock() {
    let today = new Date(Date.now());
    let hour = today.getHours();
    if (hour > 12) {
        hour -= 12;
    }
    let minute = today.getMinutes();

    let update = true;
    if (cStatic && (gOldHour == hour) && (Math.floor(minute / 5) == Math.floor(gOldMinute / 5))) {
        update = false;
    }

    if (update) {
        let hf = pickFib(hour);
        let mf = pickFib(Math.floor(minute / 5));
        for (let i = 0; i < cNumBoxes; i++) {
            gTimec[i] = 0;
            if (hf & (1 << i)) {
                gTimec[i] = cRedValue;
            }
            if (mf & (1 << i)) {
                gTimec[i] += cGreenValue;
            }
        }
    }

    gOldHour = hour;
    gOldMinute = minute;

    drawBoxes(gTimec, minute % 5);
}

function start() {
    gOldHour = -1;
    gOldMinute = -1;

    drawClock();
    setInterval(function () { drawClock() }, 60000);
}
