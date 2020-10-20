const getSbdInstance = async function(){
  let res = await this.axios.get('/NutboxSbd.json')
  // console.log(66799, res.data)
  let contract = this.tronWeb2.address.fromHex(res.data.networks['*'].address)
  // console.log(188, 'tsteem',res.data.networks['*'].address)
  // console.log(2868, 'tsbd',contract)
  //将得到的数据存入vuex中
  this.$store.commit('saveSbdJson', {abi: res.data.abi, contract: contract})

  let instance = this.tronWeb2.contract(res.data.abi, contract)
  //将得到的数据存入vuex中
  this.$store.commit('saveSbdInstance2', instance)
}

export {getSbdInstance}
