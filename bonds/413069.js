/*
    create bond asset
*/
module.exports.serverless = async function (id, amount, rate, horizon) {
    const bond = await db.kv('/custodian').get('bond:'+id);
    if(JSON.parse(bond).status==false) {
        await db.kv('/custodian').put('bond:'+id, true);
        await db.kv('/custodian').put('bond:amount:'+id, amount);
        await db.kv('/custodian').put('bond:rate:'+id, rate);
        await db.kv('/custodian').put('bond:horizon:'+id, horizon);
        console.log(id);
    } else {
        console.log(false);
    }
};
