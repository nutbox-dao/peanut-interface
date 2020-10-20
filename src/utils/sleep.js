const sleep = async function(){
    return new Promise(resolve => {
        console.log(1, "start")
        setTimeout(resolve, 6000)  //6秒
        console.log(2, "end")
    })
}

export {sleep}
