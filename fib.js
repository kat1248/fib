
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

var gBoxes = [];
var gFibs = [];
var gTimec = [];
var gOldHour, gOldMinute;

function boxRecord(x, y, size) {
    return { x: x * cBaseSize, y: y * cBaseSize, size: size * cBaseSize };
}

function fibRecord(count, vals) {
    return { count: count, values: vals };
}

function drawBoxes(vals, blink) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    // borders
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 8 * cBaseSize, 5 * cBaseSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(gBoxes[blink].x, gBoxes[blink].y, gBoxes[blink].size, gBoxes[blink].size);

    for (let i = 0; i < cNumBoxes; i++) {
        ctx.fillStyle = cColors[vals[i]];
        ctx.fillRect(gBoxes[i].x + cBorder, gBoxes[i].y + cBorder, gBoxes[i].size - 2 * cBorder, gBoxes[i].size - 2 * cBorder);
    }
}

function pickFib(arg) {
    if ((arg < 0) || (arg > 12))
        return 0;
    var c = gFibs[arg].count;
    var r = Math.floor(Math.random() * c);
    var f = gFibs[arg].values[r]
    return f;
}

function drawClock() {
    var today = new Date(Date.now());
    var hour = today.getHours();
    if (hour > 12)
        hour -= 12;
    var minute = today.getMinutes();
    var blink = minute % 5;

    var update = true;
    if (cStatic && (gOldHour == hour) && (Math.floor(minute / 5) == Math.floor(gOldMinute / 5)))
        update = false;

    if (update) {
        var hf = pickFib(hour);
        var mf = pickFib(Math.floor(minute / 5));
        for (let i = 0; i < cNumBoxes; i++) {
            gTimec[i] = 0;
            if (hf & (1 << i))
                gTimec[i] = cRedValue;
            if (mf & (1 << i))
                gTimec[i] += cGreenValue;
        }
    }

    gOldHour = hour;
    gOldMinute = minute;

    drawBoxes(gTimec, blink);
}

function start() {
    gFibs[0] = fibRecord(1, [0]);									          // 0
    gFibs[1] = fibRecord(2, [BA, BB]);								          // 1 - A | B
    gFibs[2] = fibRecord(2, [BC, BA | BB]);							          // 2 - C | AB
    gFibs[3] = fibRecord(3, [BD, BA | BC, BB | BC]);					      // 3 - D | AC | BC
    gFibs[4] = fibRecord(3, [BA | BD, BB | BD, BA | BB | BC]); 				  // 4 - AD | BD | ABC
    gFibs[5] = fibRecord(3, [BE, BC | BD, BA | BB | BD]); 				      // 5 - E | CD | ABD
    gFibs[6] = fibRecord(4, [BA | BE, BB | BE, BA | BC | BD, BB | BC | BD]);  // 6 - AE | BE | ACD | BCD
    gFibs[7] = fibRecord(3, [BA | BB | BE, BC | BE, BA | BB | BC | BD]);	  // 7 - ABE | CE | ABCD
    gFibs[8] = fibRecord(3, [BD | BE, BA | BC | BE, BB | BC | BE]);			  // 8 - DE | ACE | BCE
    gFibs[9] = fibRecord(3, [BA | BD | BE, BB | BD | BE, BA | BB | BC | BE]); // 9 - ADE | BDE | ABCE
    gFibs[10] = fibRecord(2, [BC | BD | BE, BA | BB | BD | BE]);			  // 10 - CDE | ABDE
    gFibs[11] = fibRecord(2, [BA | BC | BD | BE, BB | BC | BD | BE]);		  // 11 - ACDE | BCDE
    gFibs[12] = fibRecord(1, [BA | BB | BC | BD | BE]);						  // 12 - ABCDE

    gBoxes[0] = boxRecord(2, 1, 1);
    gBoxes[1] = boxRecord(2, 0, 1);
    gBoxes[2] = boxRecord(0, 0, 2);
    gBoxes[3] = boxRecord(0, 2, 3);
    gBoxes[4] = boxRecord(3, 0, 5);

    gOldHour = -1;
    gOldMinute = -1;

    drawClock();
    setInterval(function () { drawClock() }, 60000);
}
