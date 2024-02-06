const fs = require('fs');

class Helper
{
    checkStakeTime(jsonResponse, logFile)
    {   
        if(jsonResponse.stakingHistory.length > 0)
        {
            let text = '';
            jsonResponse.stakingHistory.forEach(stake => {
                let unstakingDateStr = stake.unstakingDate;
                let currentDate = new Date();
                let unstakingDate = new Date(unstakingDateStr + 'Z');
                let restOfTime = unstakingDate - currentDate;
                if(restOfTime > 0)
                {
                    text += `${new Date().toUTCString()} - Program: ${stake.programId}. Staking Amount: ${stake.stakingAmount}. The rest of the time = ${Math.round(restOfTime / 1000)} sec.\r\n`;
                }
            });
            this.writeLog(logFile, text);
        }
    }

    checkRestOfTokens(jsonResponse, minTokens, logFile)
    {   
        let amount = jsonResponse.amount;
        if(amount >= minTokens)
        {
            this.writeLog(logFile, `${new Date().toUTCString()} - The rest of tokens = ${amount}. Make stake.\r\n`);
            return true;
        }
        this.writeLog(logFile, `${new Date().toUTCString()} - The rest of tokens = ${amount}. Doesn't make stake.\r\n`);
        return false;
    }

    writeLog(logFile, logData)
    {
        fs.appendFileSync(logFile, logData, err => {
            if (err) console.error(err);
            });
    }
}

module.exports = new Helper();