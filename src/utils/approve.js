const approve = async function(){
      // await this.unlockWallet()
      let addr = this.$store.state.addr
      let instance = this.$store.state.steemInstance
      //授权额度
      let amount = this.web3.utils.toWei('80000000', 'ether')
      let c = await instance.approve(this.tsteemOtc, amount ).send()
      console.log(1234, c, "approve")
}

export {approve}
