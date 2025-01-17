const fs = require("fs");
const prompt = require("prompt-sync")();
var proginc;
const full_e = fs.readFileSync(process.argv[2], "utf8");
const debugOn = process.argv[3] == "debug";
var program = string2Bin(full_e);


let maxCom = 33;
let holster = [];
let holsterPos = 0;
let skipNext = false;
let stringBuffer = [];
let skipUntil = 0;
let readString = false;
for (proginc = 0; proginc < full_e.length; proginc++) {
  if (skipNext) {
    skipNext = false;
    continue;
  }
  if (skipUntil != 0) {
    if (skipUntil == decode(program[proginc])) {
      skipUntil = 0;
      if (readString) {
        readString = false;
        holster[holsterPos] = bin2String(stringBuffer);
        stringBuffer = [];
      }
    } else {
      if (readString) {
        stringBuffer.push(program[proginc]);
      }
      continue;
    }
  }
  let command = decode(program[proginc]);
  if (command > maxCom) {
    returnError(0);
  }
  if (debugOn) console.log("!!! - " + command + ` (${program[proginc]}) | ` + proginc + ` | ` + holster);

  switch (command) {
    case 1: //1 
      number = decode(program[proginc + 1]);
      holster.push(number);
      skipNext = true;
      break;
    case 2: //10
      holsterPos = decode(program[proginc + 1]);
      holster[holsterPos] ??= 0;
      skipNext = true;
      break;
    case 3: //11
      holster[holsterPos] = holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 4://100
      holster[holsterPos] += holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 5://101
      holster[holsterPos] -= holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 6: //110
      holster[holsterPos] *= holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 7: //111
      holster[holsterPos] /= holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 8: //1000
      holster[holsterPos] **= holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 9: //1001
      holster[holsterPos] ||= holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 10: //1010
      holster[holsterPos] &&= holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 11: //1011
      console.log(holster[holsterPos]);
      break;
    case 12: //1100
      holster[holsterPos] %= holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 13: //1101
      if (holster[holsterPos] - 2 > program.length) {
        proginc = 0
      } else {
        if (debugOn) console.log(holster[holsterPos] + " | " + holsterPos + " | " + holster);
        proginc = holster[holsterPos] - 2;
      }
      break;
    case 14: //1110
      holster[holsterPos] = holster[holsterPos] > holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 15: //1111
      holster[holsterPos] = holster[holsterPos] < holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 16: //10000
      holster[holsterPos] = holster[holsterPos] == holster[decode(program[proginc + 1])];
      skipNext = true;
      break;
    case 17://10001
      if (!holster[holsterPos]) {
        skipUntil = 18;
      }
      break;
    case 18: // 18 is if stop 10010
      break;
    case 19: //10011
      if (holster[holsterPos]) {
        skipUntil = 20;
      }
      break;
    case 20: //20 is else if stop //10100
      break;
    case 21: //10101
      console.log(holster);
      break;
    case 22://10110
      holster[holsterPos] = prompt(">");
      break;
    case 23://10111
      readString = true;
      skipUntil = 24;
      break;
    case 24: //24 is string stop //11000
      break;
    case 25: //11001
      holster[holsterPos] = Math.floor(Math.random() * (Math.floor(holster[holsterPos] == undefined || holster[holsterPos] == 0 ? 10 : holster[holsterPos]) - 0 + 1) + 0);
      break;
    case 26: //11010
      holster[holsterPos] = parseInt(holster[holsterPos]);
      break;
    case 27://11011
      holster[holsterPos] += 1;
      break;
    case 28: //11100
      holster[holsterPos] -= 1;
      break;
    case 29: //11101
      holsterPos = 0;
      holster[holsterPos] ??= 0;
      break;
    case 30: //11110
      holsterPos = 1;
      holster[holsterPos] ??= 0;
      break;
    case 31: //11111
      holsterPos = 2;
      holster[holsterPos] ??= 0;
      break;
    case 32: //100000 
      process.stdout.write(holster[holsterPos].toString());
      break;
    case 33: //100001
      process.stdout.write(String.fromCharCode(holster[holsterPos]));
      break;
  }
}

function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i).toString(2));
  }
  return result;
}
function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}

function decode(line) {
  return parseInt(line, 2)
}

function returnError(error) {
  console.log(`Runtime error: ${[
    "Command does not exist",
    "Type mismatch",
  ][error]}.\n\nCode: ${error}`);
  process.exit(1);
}