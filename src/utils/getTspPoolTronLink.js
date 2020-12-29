const getTspPoolTronLink = async function() {
  if (window.tronWeb) {
    let tronWeb = window.tronWeb
    let instance = tronWeb.contract(this.$store.state.tspPoolJson.abi, this.$store.state.tspPoolJson.contract)
    //将得到的数据存入vuex中
    this.$store.commit('saveTspPoolInstance', instance)
  } else {
    // 如果检测到没有注入tronWeb对象，则等待3s后重新检测
    console.error('wait for tronLink')
    await this.sleep()
    if (window.tronWeb) {
      let tronWeb = window.tronWeb
      let instance = tronWeb.contract(this.$store.state.tspPoolJson.abi, this.$store.state.tspPoolJson.contract)
      //将得到的数据存入vuex中
      this.$store.commit('saveTspPoolInstance', instance)
    }else{
      console.error('wait for tronLink')
      alert("请安装tronlink钱包！")
    }
  }
}

export {getTspPoolTronLink}
