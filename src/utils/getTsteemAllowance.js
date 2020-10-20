const getTsteemAllowance = async function(){
  let addr = this.$store.state.addr
  let instance = this.$store.state.steemInstance2
  let t = await instance.allowance(addr, this.tsteemOtc).call()
  let s = this.web3.utils.fromWei(this.tronWeb2.toBigNumber(t).toFixed(), 'ether')
  //将得到的数据存入vuex中
  this.$store.commit('saveTsteemAllowance', s)
}

export {getTsteemAllowance}
