/*
    buy a bond
    pass in id with amount, reduce balance, increase balance
*/
module.exports.serverless = async function (email, amount, bond_id) {
    const bond = await db.kv('/custodian').get('bond:'+bond_id)
    
    if(JSON.parse(bond).status==false) {
        console.log(false);
    } else {
        const amt = await db.kv('/custodian').get('cash:'+email);
        
        if(JSON.parse(amt).status!=false) {
            if(Number(JSON.parse(amt).v) < Number(amount)){
                console.log(false);
            } else {
                const bondExisting = await db.kv('/custodian').get('bond:'+bond_id+":"+email);
                
                if(JSON.parse(amt).status==false){
                    await db.kv('/custodian').put('bond:'+bond_id+":"+email, 1);
                } else {
                    await db.kv('/custodian').put('bond:'+bond_id+":"+email, Number(JSON.parse(bondExisting).v)+1);
                }
                await db.kv('/custodian').put('cash:'+email, Number(JSON.parse(amt).v) - Number(amount));
                await db.kv('/custodian').put('bond:'+bond_id+":"+email+":"+"payoutTime", Date.now());
                console.log(true);
            }
        } else {
            console.log(false);
        }
    }
};
