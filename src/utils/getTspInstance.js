const getTspInstance = async function(){
  let res = await this.axios.get('/NutboxTsp.json')
  // console.log(66799, res.data)
  let contract = this.tronWeb2.address.fromHex(res.data.networks['*'].address)
  // console.log(588, 'pnut',res.data.networks['*'].address)
  // console.log(688, 'pnut',contract)

  //将得到的数据存入vuex中
  this.$store.commit('saveTspJson', {abi: res.data.abi, contract: contract})

  let instance = this.tronWeb2.contract(res.data.abi, contract)
  // console.log(688, 'pnut',instance)
  //将得到的数据存入vuex中
  this.$store.commit('saveTspInstance2', instance)
}

export {getTspInstance}
