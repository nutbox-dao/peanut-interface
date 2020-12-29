<template>
  <div class="tsp">
     <div>
       <div class="changebox">
          <p :class="[tspFlag ? 'titleSelected' : 'titleUnSelected']" @click="tspFlag = true;LPFlag=false">{{ $t('tsp.tspMine') }}</p>
          <p :class="[LPFlag ? 'titleSelected' : 'titleUnSelected']" @click="tspFlag = false;LPFlag=true">{{ $t('tsp.tspLPMine') }}</p>
        </div>
        
        <TSPMine v-show="tspFlag" ref="tsp"
        :totalDepositedSP = "totalDepositedSP"
        :totalDepositedSP2 = 'totalDepositedSP2'
        :rewardsPerBlock = 'rewardsPerBlock'
        :totalPendingPeanuts = 'totalPendingPeanuts'
        :addr = 'addr'
        :nutBalanceOf = 'nutBalanceOf'
        :nutBalanceOf2 = 'nutBalanceOf2'
        :apy = 'apy'>
        </TSPMine>

        <TSPLPMine v-show="LPFlag" ref="tsplp"
        :totalDepositedSP = "totalDepositedSP"
        :totalDepositedSP2 = 'totalDepositedSP2'
        :rewardsPerBlock = 'rewardsPerBlock'
        :totalPendingPeanuts = 'totalPendingPeanuts'
        :addr = 'addr'
        :nutBalanceOf = 'nutBalanceOf'
        :nutBalanceOf2 = 'nutBalanceOf2'
        :apy = 'apy'>
        </TSPLPMine>

    </div>
  </div>
</template>

<script>
import TSPMine from './TSPMine.vue'
import TSPLPMine from './TSPLPMine.vue'
import {vestsToSteem} from '../utils/chain/steemOperations.js'
  
  export default {
    name: "TSP",
    data() {
      return {
        LPFlag:false,
        tspFlag:true,
        nutBalanceOf:'',
        nutBalanceOf2:'',
        totalDepositedSP:'',
        totalDepositedSP2:'',
        rewardsPerBlock:0,
        totalPendingPeanuts:'',
        addr:'',
        apy:''
      }
    },
    components: {
      TSPMine,
      TSPLPMine
      },
    methods: {
      // 获取子控件共用数据，通过属性传进去
      async getOtherBalance(){  //nuts
        let addr = this.addr
        let instance = this.$store.state.nutInstance2
        let a = await instance.balanceOf(addr).call()

        this.nutBalanceOf = this.formatData(this.dataFromSun(a))  //nuts
        this.nutBalanceOf2 = this.dataFromSun(a)

        let poolinstance = this.$store.state.nutPoolInstance2

        let g = await poolinstance.getTotalDepositedSP().call()
        this.totalDepositedSP2 = await vestsToSteem(this.dataFromSun(g))
        this.totalDepositedSP = this.formatData(this.totalDepositedSP2)

        let t = await poolinstance.getRewardsPerBlock().call()
        this.rewardsPerBlock = this.formatData(this.dataFromSun(t))
        let i = await poolinstance.getTotalPendingPeanuts().call()
        let i2 = this.dataFromSun(i)
        this.totalPendingPeanuts = this.formatData(i2)
      },
      async getSteemPrice(){
        let res = await this.axios.request({
          method:"get",
          url:'https://api.coingecko.com/api/v3/coins/steem',
          headers: {
            "accept": "application/json",
          }
        })
        // console.log(111,res.data.tickers)
        let arr = res.data.tickers
        for(let i = 0; i < arr.length; i++){
          if(arr[i].target === "USDT"){
            // console.log(112,arr[i].last)
            return arr[i].last
          }
        }
      },
      async getTronPrice(){
        let res = await this.axios.request({
          method:"get",
          url:'https://api.coingecko.com/api/v3/coins/tron',
          headers: {
            "accept": "application/json",
          }
        })
        // console.log(111,res.data.tickers)
        let arr = res.data.tickers
        for(let i = 0; i < arr.length; i++){
          if(arr[i].target === "USDT"){
            // console.log(112,arr[i].last)
            return arr[i].last
          }
        }
      },
      async getPnutPrice(){
        let res = await this.axios.request({
          method:"get",
          url:'https://api.justswap.io/v2/allpairs',
          headers: {
            "accept": "application/json",
          },
          params: {
            page_size : 2500,
            page_num: 1
          }
        })
        // console.log(111,res.data.data)
        // console.log(113,res.data.data["0_TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW"])
        let price = res.data.data["0_TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW"].price
        // console.log(114,price)
        // let pnut = "TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW"
        res = null
        return price
      },
      async calPnutApy(){
        let steemPrice = await this.getSteemPrice()
        let tronPrice = await this.getTronPrice()
        let pnutPrice = await this.getPnutPrice()
        let apy = 28800 * this.rewardsPerBlock * 365 * pnutPrice * tronPrice / (this.totalDepositedSP2 * steemPrice)
        this.apy = (apy * 100).toFixed(3)
        localStorage.setItem('apy', this.apy)
      },
    },
    async mounted() {
      let that = this
      let instance = this.$store.state.tspInstance2
      let poolinstance = this.$store.state.tspPoolInstance2
      let lpPoolInstance = this.$store.state.tspLPPoolInstance2
      async function main(){
        // await that.sleep()
        if (window.tronWeb) {
          // console.log(22, "tronlink is ok! login")
          that.addr = window.tronWeb.defaultAddress.base58
        }else{
             that.tronlinkFlag = false
        }

        //如果有一个没有获取到则再获取一次
        if(!that.tronlinkFlag){
          that.isLoading = true
          await that.sleep(1)
          //tronlink
          if (window.tronWeb) {
            that.addr = window.tronWeb.defaultAddress.base58
          }else{
            let link2 = 'TronLink: https://www.tronlink.org'
            alert(that.$t('error.needtronlink')+"\n\n"+link2)
          }
        }
        if(Object.keys(instance).length === 0 || Object.keys(poolinstance).length === 0 || Object.keys(lpPoolInstance).length === 0){
          //如果刷新页面, instance未定义
          try{
            await that.getNutsInstance()
            await that.getNutTronLink()
            await that.getNutsPool()
            await that.getNutPoolTronLink()

            await that.getTspInstance()
            await that.getTspTronLink()
            await that.getTspPoolInstance()
            await that.getTspPoolTronLink()

            await that.getTspLPPoolInstance()
            await that.getTspLPPoolTronLink()

            await that.getOtherBalance()
          }catch(e){
            that.maskInfo = that.$t('error.tryrefreshpage')+"\n"+e
            that.showMask = true
            return
          }
        } else{
          try{
            await that.getTspPoolTronLink()
            await that.getTspTronLink()
            await that.getNutTronLink()
            await that.getNutPoolTronLink()
            await that.getTspLPPoolTronLink()

            await that.getOtherBalance()
          }catch(e){
            that.maskInfo = that.$t('error.tryrefreshpage')+"\n"+e
            that.showMask = true
            return
          }
        }
      }
      await main()
      await this.calPnutApy()
      // 更新子组件,保证第一页面先加载完再加载LP页面
      await this.$refs.tsp.update()
      this.$refs.tsplp.update()
    }
  }
</script>

<style scoped>

  .tsp{
    width: 45%;
    max-width: 520px;
    min-width: 400px;
    margin: 2.5rem auto;
    padding: 1.5rem 1rem 2rem 1rem;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
    border-radius: 30px;
    display: block;
    z-index: 1;
    box-sizing: border-box;
    margin-bottom: 2rem;
  }

.changebox{
  display: flex;
  justify-content: space-evenly;
  padding: 1em;
  padding-bottom: 0;

}

.changebox p{
  font-weight: 400;
  color: darkgray;
  font-size: 20px;
  cursor: pointer;
}

.titleSelected{
     color: rgb(30, 30, 30) !important;
     font-weight: 500;
     font-size: 1.2rem;
     cursor: pointer;
     text-align: center;
 }


.changebox p:hover{
  color: rgb(92, 91, 91) !important;
}

  .user{
    margin-top: 1rem;
    width: 30rem;
  }



</style>

