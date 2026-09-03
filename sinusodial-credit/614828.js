/*
    time of month, avail credit, can make purchase
    to be composed as vm('614828').serverless('nero.mage@proton.me', 3.55)
    TODO: calculate with start date and save frequency as value
*/
module.exports.serverless = async function (email, amount) {
    const credit = await db.kv('/custodian').get('sinusodial:'+email)
    const endingPeriod = await db.kv('/custodian').get('sinusodial:'+email + ':endingPeriod')
    
    if(JSON.parse(credit).status==false) {
        console.log(false);
    } else {
        const time = (endingPeriod- Date.now()) / 1000
        const frequency = 2628000000; /* 1 month */
        const x = time * 2 * Math.PI * frequency;
        const credit = await db.kv('/custodian').get('sinusodial:'+email);
        const drawnAmount = await db.kv('/custodian').get('sinusodial:'+email+":"+"drawn");
        
        const creditAvailable = Number(credit) * Math.sin(x) - JSON.parse(drawnAmount).v;
        
        if(creditAvailable >= Number(amount)){
            console.log(true);
        } else {
            console.log(false);
        }
    }
};
