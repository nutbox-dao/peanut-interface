const getTspTronLink = async function() {
  if (window.tronWeb) {
    console.log(11, "tronlink is ok! tsp")
    let tronWeb = window.tronWeb
    let instance = tronWeb.contract(this.$store.state.tspJson.abi, this.$store.state.tspJson.contract)
    //将得到的数据存入vuex中
    this.$store.commit('saveTspInstance', instance)
    console.log(22, "tronlink is ok! tsp")
  } else {
    // 如果检测到没有注入tronWeb对象，则等待3s后重新检测
    console.error('wait for tronLink')
    await this.sleep()
    if (window.tronWeb) {
      let tronWeb = window.tronWeb
      let instance = tronWeb.contract(this.$store.state.tspJson.abi, this.$store.state.tspJson.contract)
      //将得到的数据存入vuex中
      this.$store.commit('saveTspInstance', instance)
    }else{
      console.error('wait for tronLink')
      alert("请安装tronlink钱包！")
    }
  }
}

export {getTspTronLink}
