export const sleep = async function(interval=6){
    return new Promise(resolve => {
        setTimeout(resolve, interval * 1000)  //6秒
    })
}


// export const sleep = function(delay=5) {
//     var start = (new Date()).getTime();
//     while((new Date()).getTime() - start < delay * 1000) {
//         continue;
//     }
// }