/*
    send money with a source and destination email address, and amount
*/
module.exports.serverless = async function (emailSource, emailDest, amount) {
    const amt = await db.kv('/custodian').get('cash:'+emailSource);
    if(JSON.parse(amt).status==false) {
        console.log(false);
    } else {
        if(Number(JSON.parse(amt).v) < Number(amount)){
            console.log(false);
        } else {
            await db.kv('/custodian').put('cash:'+emailSource, Number(JSON.parse(amt).v) - Number(amount));
            const amt2 = await db.kv('/custodian').get('cash:'+emailDest);
            if(JSON.parse(amt2).status==false) {
                await db.kv('/custodian').put('cash:'+emailDest, Number(amount));
                console.log(Number(amount));
            } else {
                await db.kv('/custodian').put('cash:'+emailDest, Number(JSON.parse(amt2).v) + Number(amount));
                console.log(Number(JSON.parse(amt2).v) + Number(amount));
            }
        }
    }
};
