const getTspLPPoolInstance = async function(){
  let res = await this.axios.get('/TspLPPool.json')
  // console.log(66799, res.data)
  let contract = this.tronWeb2.address.fromHex(res.data.networks['*'].address)
  // console.log(588, 'tsp pool',res.data.networks['*'].address)
  // console.log(688, 'tsp pool',contract)

  //将得到的数据存入vuex中
  this.$store.commit('saveTspLPPoolJson', {abi: res.data.abi, contract: contract})

  let instance = this.tronWeb2.contract(res.data.abi, contract)
  // console.log(689, 'pnut pool',instance)
  //将得到的数据存入vuex中
  this.$store.commit('saveTspLPPoolInstance2', instance)
}

export {getTspLPPoolInstance}
