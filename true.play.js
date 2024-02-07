var XMLHttpRequest = require('xhr2');
const Helper = require('./helper');

class TruePlay
{
    async checkStake(token, successLogFile, errorLogFile)
    {
        let checkRequest = new XMLHttpRequest();

        checkRequest.open('GET', 'https://api.trueplay.io/api/v1/user/stacking-history?closed=false');
        checkRequest.setRequestHeader('x-auth-token', token);
        checkRequest.responseType = 'json';

        checkRequest.onload = function() {
            if (checkRequest.status != 200) {
                Helper.writeLog(errorLogFile, `${new Date().toUTCString()} - Error ${checkRequest.status}: ${checkRequest.statusText}`)
            } else {
                Helper.checkStakeTime(checkRequest.response, successLogFile);
            }
        };

        checkRequest.send();
        await delay(1000);
    }
    
    stacking(token, programId, successLogFile, errorLogFile)
    {
        let stackingRequest = new XMLHttpRequest();
        stackingRequest.open('POST', 'https://api.trueplay.io/api/v1/user/staking');
        stackingRequest.setRequestHeader('x-auth-token', token);
        stackingRequest.setRequestHeader('content-type', 'application/json');
        let requestBody = JSON.stringify({
            amount: 1,
            programId: programId,
            useMaxAmount: true
        });
        stackingRequest.responseType = 'json';

        stackingRequest.onload = () => {
            if (stackingRequest.status != 201) {
                Helper.writeLog(errorLogFile, `${new Date().toUTCString()} - Error ${stackingRequest.status}: ${stackingRequest.statusText}\r\n`);
            } else {
                Helper.writeLog(successLogFile, `${new Date().toUTCString()} - Stake was created successfully. Amount = ${stackingRequest.response.amount}.\r\n`);
            }
        };

        stackingRequest.send(requestBody);
    }

    async hasAvailableTokens(token, minTokens, successLogFile, errorLogFile)
    {
        let result;
        let maxDelayThreshold = 10
        let currentThreshold = 0;
        let checkRequest = new XMLHttpRequest();

        checkRequest.open('GET', 'https://api.trueplay.io/api/v1/user/token');
        checkRequest.setRequestHeader('x-auth-token', token);
        checkRequest.responseType = 'json';

        checkRequest.onload = () => {
            if (checkRequest.status != 200) {
                Helper.writeLog(errorLogFile, `${new Date().toUTCString()} - Error ${checkRequest.status}: ${checkRequest.statusText}\r\n`);
            } else {
                result = Helper.checkRestOfTokens(checkRequest.response, minTokens, successLogFile);
            }
        };
        checkRequest.send();

        while(result == null && currentThreshold++ < maxDelayThreshold)
        {
            await delay(1000);
        }
        
        return result;
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

module.exports = new TruePlay();