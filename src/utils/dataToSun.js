const dataToSun = function(data){
  let a = data * 1e6
  return this.tronWeb2.toBigNumber(a).toFixed(0)
}

export {dataToSun}
