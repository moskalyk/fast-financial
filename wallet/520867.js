/*
    fund wallet with email,  amount
*/
module.exports.serverless = async function (email, amount) {
    const amt = await db.kv('/custodian').get('cash:'+email);
    if(JSON.parse(amt).status==false) {
        await db.kv('/custodian').put('cash:'+email, amount);
        console.log(amount);
    } else {
        await db.kv('/custodian').put('cash:'+email, Number(JSON.parse(amt).v) + Number(amount));
        const currentBalance = await db.kv('/custodian').get('cash:'+email);
        console.log(currentBalance);
    }
};
