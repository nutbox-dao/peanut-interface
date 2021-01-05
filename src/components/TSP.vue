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
import {whatchWallet,getTronLinkAddr, intToAmount} from '../utils/chain/tron.js'
import {getContract} from '../utils/chain/contract'
import {TRON_LINK_ADDR_NOT_FOUND} from '../const.js'
import axios from 'axios'
  
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
        let instance = await getContract('PNUT')
        let a = await instance.balanceOf(this.addr).call()

        this.nutBalanceOf = this.formatData(intToAmount(a))  //nuts
        this.nutBalanceOf2 = intToAmount(a)

        let poolinstance = await getContract('PNUT_POOL')

        let g = await poolinstance.getTotalDepositedSP().call()
        this.totalDepositedSP2 = await vestsToSteem(intToAmount(g))
        this.totalDepositedSP = this.formatData(this.totalDepositedSP2)

        let t = await poolinstance.getRewardsPerBlock().call()

        this.rewardsPerBlock = this.formatData(intToAmount(t))
        let i = await poolinstance.getTotalPendingPeanuts().call()
        let i2 = intToAmount(i)
        this.totalPendingPeanuts = this.formatData(i2)
      },
      async getSteemPrice(){
        let res = await axios.request({
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
        let res = await axios.request({
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
        let res = await axios.request({
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
      async function main(){
        //如果刷新页面, instance未定义
        try{
          that.getOtherBalance()
        }catch(e){
          that.maskInfo = that.$t('error.tryrefreshpage')+"\n"+e
          that.showMask = true
          return
        }
      }
      this.apy = localStorage.getItem('apy')
      this.addr = await getTronLinkAddr()
      main()
      this.calPnutApy()
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

