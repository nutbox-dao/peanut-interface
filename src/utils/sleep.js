const sleep = async function(interval=6){
    return new Promise(resolve => {
        setTimeout(resolve, interval * 1000)  //6秒
    })
}

export {sleep}
