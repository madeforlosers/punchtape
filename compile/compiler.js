const fs = require("fs");
var program = fs.readFileSync(process.argv[2],"utf8");
if(program.match(/-*START\s*\|/gm) == null){
  returnError(0);
}
program = program.split(/-START\s*\|\n/g)[1].split("\n")
function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}

function returnError(error, extra=""){
  console.log(`Compiler error: ${[
    "No start statement",
    "Paper width not equal",
    "Number is above octet limit",
    "Write file error: "+extra
    ][error]}.\n\nCode: ${error}`);
  process.exit(1);
}
function decode(line){
  let number = 0;
  let i = 7;
  if(i < line.split("|")[0]){
    returnError(2);
  }
  for(let x of line.split("|")[0]){
    if(x != "-"){
      number+=2**i;
    }
    i--;
  }
  return number;
}
var zipped = [];
for(var i =0; i < program.length; i++){
  if(program[i].split("|")[0].length != program[0].split("|")[0].length){
    returnError(1);
  }
  tex = (((decode(program[i])).toString(2)))
  tex = ("0".repeat(8-tex.length)+tex).match(/.{1,4}/g)
  zipped[i] = tex[0]+tex[1]
}
fs.writeFile(process.argv[3], Buffer.from(btoa(bin2String(zipped)),'base64'), function(err){if(err!=null)returnError(3,err)});
