const getSteemInstance = async function(){
  let res = await this.axios.get('/NutboxSteem.json')
  // console.log(66799, "tsteem",res.data)
  let contract = this.tronWeb2.address.fromHex(res.data.networks['*'].address)
  // console.log(188, 'tsteem',res.data.networks['*'].address)
  // console.log(288, 'tsteem',contract)
  //将得到的数据存入vuex中
  this.$store.commit('saveSteemJson', {abi: res.data.abi, contract: contract})

  let instance = this.tronWeb2.contract(res.data.abi, contract)
  // console.log(288, 'tsteem',instance)
  //将得到的数据存入vuex中
  this.$store.commit('saveSteemInstance2', instance)
}

export {getSteemInstance}
