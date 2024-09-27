const fs = require("fs");
const prompt = require("prompt-sync")();
var proginc = 0;
const full_e = fs.readFileSync(process.argv[2],"utf8")
const debugOn = process.argv[3]=="debug";
var program = []
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
program = string2Bin(full_e)
function decode(line){
  return parseInt(line,2)
}

function returnError(error){
  console.log(`Runtime error: ${[
    "Command does not exist",
    "Type mismatch",
    ][error]}.\n\nCode: ${error}`);
  process.exit(1);
}

let maxCom = 31;
let holster = [];
let holsterPos = 0;
let skipNext = false;
let stringBuffer = [];
let skipUntil = 0;
let readString = false;
for(proginc = 0; proginc < full_e.length; proginc++){

  if(skipNext){
    skipNext = false;
    continue;
  }
  if(skipUntil != 0){
    if(skipUntil == decode(program[proginc])){
      skipUntil = 0;
      if(readString){
        readString=false;
        holster[holsterPos] = bin2String(stringBuffer);
        stringBuffer = [];
      }
    }else{
      if(readString){
        stringBuffer.push(program[proginc])
      }
      continue;
    }
  }
  let command = decode(program[proginc]);
  if(command > maxCom){
    returnError(0);
  }
  if(debugOn)console.log("!!! - "+ command+` (${program[proginc]}) | `+proginc+` | `+holster);
  if(command == 1){ //1
    number = decode(program[proginc+1]);
    holster.push(number)
    skipNext = true;
  }
  if(command == 2){ //10
    holsterPos = decode(program[proginc+1]);
    holster[holsterPos] ??= 0
    skipNext = true;
  }
  if(command == 3){ //11
    holster[holsterPos] = holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 4){ //100
    
    holster[holsterPos] += holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 5){ //101
    holster[holsterPos] -= holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 6){ //110
    holster[holsterPos] *= holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 7){ //111
    holster[holsterPos] /= holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 8){ //1000
    holster[holsterPos] **= holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 9){ //1001
    
    holster[holsterPos] ||= holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 10){ //1010
    
    holster[holsterPos] &&= holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 11){ //1011
    console.log(holster[holsterPos]);
  }
  
  if(command == 12){ //1100
    
    holster[holsterPos] %= holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 13){ //1101
    if( holster[holsterPos]-2 > program.length){
      proginc = 0
    }else{
      if(debugOn)console.log(holster[holsterPos]+" | "+holsterPos+" | "+holster);
    proginc = holster[holsterPos]-2;
      }
    
  }
  if(command == 14){ //1110
    holster[holsterPos] = holster[holsterPos] > holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 15){ //1111
    holster[holsterPos] = holster[holsterPos] < holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 16){ //10000
    holster[holsterPos] = holster[holsterPos] == holster[decode(program[proginc+1])];
    skipNext = true;
  }
  if(command == 17){ //10001
    if(!holster[holsterPos]){
      skipUntil = 18;
    }
  }

  // 18 is if stop //10010

  if(command == 19){ //10011
    if(holster[holsterPos]){
      skipUntil = 20;
    }
  }

  //20 is else if stop //10100

  if(command == 21){ //10101
    console.log(holster)
  }
  if(command == 22){ //10110
    holster[holsterPos] = prompt(">");
  }
  if(command == 23){ //10111
    readString = true;
    skipUntil=24;
  }
  //24 is string stop //11000
  if(command == 25){ //11001
    holster[holsterPos] = Math.floor(Math.random() * (Math.floor(holster[holsterPos]==undefined||holster[holsterPos]==0?10:holster[holsterPos]) - 0 + 1) + 0);
  }
  if(command == 26){ //11010
    holster[holsterPos] = parseInt(holster[holsterPos])
  }
  if(command == 27){ //11011
    holster[holsterPos] +=1
  }
  if(command == 28){ //11100
    holster[holsterPos] -=1
  }
  if(command == 29){ //11101
    holsterPos = 0
    holster[holsterPos] ??= 0
  }
  if(command == 30){ //11110
    holsterPos = 1
    holster[holsterPos] ??= 0
  }
  if(command == 31){ //11111
    holsterPos = 2
    holster[holsterPos] ??= 0
  }
}
