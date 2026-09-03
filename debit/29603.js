/*
    buy
    check to see enough
    transfer to address
    post transaction history
*/
module.exports.serverless = async function (email, tenderID, amount) {
    const amt = await db.kv('/custodian').get('cash:'+email);
    if(JSON.parse(amt).status==false) {
        console.log(false);
    } else {
        if(Number(JSON.parse(amt).v) < Number(amount)){
                console.log(false);
        } else {
            const amt2 = await db.kv('/custodian').get('cash:'+tenderID);

            if(JSON.parse(amt2).status != false) {
                await db.kv('/custodian').put('cash:'+tenderID, Number(JSON.parse(amt2).v) + Number(amount));
            } else {
                await db.kv('/custodian').put('cash:'+tenderID, Number(amount));
            }
            
            await db.kv('/custodian').put('cash:'+email, Number(JSON.parse(amt).v) - Number(amount));
            
            /*
                TODO: transaction history in kv array
                const txsRaw = await db.kv('/custodian').get('cash:'+email+":txs");
                const txs = JSON.parse(txsRaw).v;
                
                txs.push({...});
                
                await db.kv('/custodian').put('cash:'+email+":txs"+txs);
            */
            
            console.log(amount);
        }
    }
};
