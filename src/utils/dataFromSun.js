const dataFromSun = function(data){
  let b = data * 1e-6
  // console.log(899, b)
  // console.log(8992, this.tronWeb2.toBigNumber(b).toFixed(6))

  return this.tronWeb2.toBigNumber(b).toFixed(6)
}

export {dataFromSun}
