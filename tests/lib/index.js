class TricRunner {

    tests = []    
    totalScs = 0    
    totalErr = 0
    bundledTests = {}
    
    assert(title) {
        this.tests.push(title)
        return (func, res, args) => {
            if(this.bundledTests[func].apply(null, args) == res) {
                console.log('✓ ' + title)
                this.totalScs++ 
            } else {
                console.log('X ' + title)
                this.totalErr++            
            }
        }
    }
    
    assertEval(title) {
        this.tests.push(title)
        return async (first, second) => {
            const res = JSON.stringify(await eval(`var ${first}=${this.bundledTests[first]};(${first}())`))
            let adj = JSON.parse(res)
            // if(JSON.stringify(adj.res).endsWith('\nundefined')) { // TODO: brrp
            //     adj.res = (adj.res.replace('\nundefined', ''))
            //     adj.res = parseInt(adj.res)
            // }
            if(JSON.stringify(adj) == JSON.stringify(second).replaceAll('"',"")) {
                console.log('✓ ' + title)
                ++this.totalScs 
            } else {
                console.log('X ' + title)
                this.totalErr++            
            }
        }
    }
    
    assertEvalArgs(title) {
        this.tests.push(title)
        return async (func, res, args, types) => {
            if(await eval(`var ${func}=${this.bundledTests[func]};(${func}(${args.map((a, i) => {
            // console.log(i)
            // console.log(types)
                // if(types[i] == 'string'){
                    return `'${String(a)}'`
                // }
            })}))`) == res) {
                console.log('✓ ' + title)
                this.totalScs++ 
            } else {
                console.log('X ' + title)
                this.totalErr++            
            }
        }
    }
    

    bundler(bundleID, toBundle) {
        this.log('\n** ' + bundleID)
        toBundle.map((test) => {
            const vari = eval(test).name.toString()
            this.bundledTests[vari] = test
        })
    }   
     
    i(title){
        return {
            assert: this.assert(title)
        }
    }

    ive(title) {
        return{
            assertEval: this.assertEval(title)
        }
    }
    
    ill(title) {
        return{
            assertEvalArgs: this.assertEvalArgs(title)
        }
    }
    
    log(log){
        console.log(log)
    }
    
    // TODO: with eval
    // async complete(){
    //     this.log('\n'+(this.totalScs) + ' / ' + parseInt(this.totalScs + this.totalErr) + ' ✓')
    // }
}

const fs = require('fs')

const TCLParser = async (tclFile) => {
    const re = /[^(+.){\}]+(.*|\.)+?|[\.]?(?=})/g
    const getFunction = /\'(.*?)\'/
    const TCLBundlerParser = (tcl) => {
        return /"(.*?)"/.exec(tcl)
    }
    
    const data = await fs.readFileSync(__dirname +'/..'+ tclFile)
    const tcl = data.toString()
    // console.log(tcl.match(re)[7].split('\n'))
    let output = tcl.match(re)[7].split('\n')[1].trim()
    let outputVal = output
    if(output == '}'){
        output = tcl.match(re)[6].split('\n')[1].trim()
        outputVal = (TCLBundlerParser(output))[1]
    }
    // console.log((tcl.match(re)[2]).split('=')[1].split('\n')[0].replaceAll("'", '').trim())
    return {
        bundler: TCLBundlerParser(tcl)[1], // TODO: create bundle depth
        function: (tcl.match(re)[2]).split('=')[1].split('\n')[0].replaceAll("'", '').trim(),
        input: JSON.parse(tcl.match(re)[4].split('\n')[1].trim()),
        output: outputVal,
        typeInput: JSON.parse(tcl.match(re)[4].split('\n')[1].trim()).map((t => typeof t)),
        typeOutput: typeof JSON.parse(output)
    }
}

const TCLBundlerParser = (tcl) => {
    return /"(.*?)"/.exec(tcl)
}

module.exports = {
    TCLParser,
    TricRunner
}
