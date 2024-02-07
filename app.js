const fs = require('fs');
var XMLHttpRequest = require('xhr2');
const truePlay = require('./true.play')
const minTokens = 1000;
const programId = 37; // 17 - 1 day, 37 - 8 hours
let tokenFile = './token.txt';

async function main() 
{
    let token = fs.readFileSync(tokenFile, 'utf8').trim();
    await truePlay.checkStake(token, './success.log', './error.log');
    let makeStake = await truePlay.hasAvailableTokens(token, minTokens, './success.log', './error.log');
    if(makeStake)
    {
        truePlay.stacking(token, programId, './success.log', './error.log');
    }
    //timeout = setTimeout(main, 60000);
}

main();