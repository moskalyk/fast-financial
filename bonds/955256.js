/*
    check and transfer
    
    pass in credentials (or simply email with OTP)
    time since last transfer,
    calculate diff
    transfer amount
*/
module.exports.serverless = async function (email, bond_id) {
    const bond = await db.kv('/custodian').get('bond:'+bond_id)
    
    if(JSON.parse(bond).status==false) {
        console.log(false);
    } else {
        const amt = await db.kv('/custodian').get('cash:'+email);
        const time = await db.kv('/custodian').get('bond:'+bond_id+":"+email+":"+"payoutTime");
        
        const amount = await db.kv('/custodian').put('bond:amount:'+bond_id);
        const rate = await db.kv('/custodian').put('bond:rate:'+bond_id);
        const horizon = await db.kv('/custodian').put('bond:horizon:'+bond_id);
        const payout = amount * rate * (Date.now() - time) / horizon;
        
        if(JSON.parse(amt).status!=false) {
            await db.kv('/custodian').put('cash:'+email, Number(JSON.parse(amt).v) + Number(payout));
        } else {
            await db.kv('/custodian').put('cash:'+email, Number(payout));
        }
        await db.kv('/custodian').put('bond:'+bond_id+":"+email+":"+"payoutTime", Date.now());
        console.log(payout);
    }
};
