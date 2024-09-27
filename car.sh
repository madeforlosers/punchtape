node compile/compiler.js $1.txt programs/$1.PC
if [ $? -eq 0 ]
then
node bin/punchcode.js programs/$1.PC $2
fi