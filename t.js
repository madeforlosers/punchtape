const fs = require('fs');
var stats = fs.statSync("programs/test.PC");
var fileSizeInBytes = stats.size;
console.log(stats);

`
[SYN][RS][SOH][STX][SOH][NUL][SOH][STX][SOH][ETX][SOH][SOH][SOH][DC3][SOH][NUL][SOH][NUL][RS][ETX][NUL][FF][STX][DC1][GS][ACK][ENQ][ESC][DC2][DC3][GS][BEL][EOT][DC4][STX][HT][ESC][RS][ETX][NUL][DLE][ACK][DC3][STX][BEL][LF][DC4][STX][HT][VT]
`