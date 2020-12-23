const sleep = async function(interval=1){
    return new Promise(resolve => {
        console.log(1, "start")
        setTimeout(resolve, interval * 1000)  //6秒
        console.log(2, "end")
    })
}

export {sleep}
