/*
    group credit calculation across peers (for bank) to 
    good for basic testing short-term debt positions
    i.e. how much credit is extended at one period of time
    eased and smoothed with sinusodial credit
*/
module.exports.serverless = async function (emails) {
    const total = emails.reduce((acc, email) => {
        const credit = await db.kv('/custodian').get('sinusodial:'+email);
        const endingPeriod = await db.kv('/custodian').get('sinusodial:'+email + ':endingPeriod');
        
        const time = (endingPeriod- Date.now()) / 1000;
        const frequency = 2628000000; /* 1 month */
        const x = time * 2 * Math.PI * frequency;
        const creditAvailable = Number(credit) * Math.sin(x);
        
        return acc + creditAvailable;
    }, 0)
    console.log(total);
};
