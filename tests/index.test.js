const { TricRunner, TCLParser } = require('./lib/index')

const runBonds = async (val1, val2) => {
    return val1 + val2
};

const runWalletFund = async (id, amount) => {
    const res = await fetch('http://localhost:3000/computer', {
        method: 'POST',
        body: JSON.stringify({
            bundleID: '520867',
            args: [id, amount]
        })
    })
    
    const json = await res.json()
    const val = JSON.parse(json.val)

    if(typeof val == 'object' && 'status' in val){
        return val.v
    } else {
        return val
    }
}

(async () => {
    const runner = new TricRunner()
    
    await runner.bundler('wallet', [
        runWalletFund
    ])
    
    const { assertEvalArgs: assert } = await runner.ill(`fund wallet`)

    assert(
        (await TCLParser('/tcl/runWalletFund.tcl')).function, 
        (await TCLParser('/tcl/runWalletFund.tcl')).output,
        (await TCLParser('/tcl/runWalletFund.tcl')).input,
        (await TCLParser('/tcl/runWalletFund.tcl')).typeInput
    )
    
    // tester
    await runner.bundler('bonds', [
        runBonds
    ])
    
    const { assertEvalArgs: assert4 } = await runner.ill(`output 'concat'`)
    
    assert4(
        (await TCLParser('/tcl/runBonds.tcl')).function, 
        (await TCLParser('/tcl/runBonds.tcl')).output,
        (await TCLParser('/tcl/runBonds.tcl')).input,
        (await TCLParser('/tcl/runBonds.tcl')).typeInput
    )
    
})()
