<template>
  <div class="tsp">
     <div>
       <div class="changebox">
          <p :class="[tspFlag ? 'titleSelected' : 'titleUnSelected']" @click="tspFlag = true;LPFlag=false">{{ $t('tsp.tspMine') }}</p>
          <!-- <p :class="[LPFlag ? 'titleSelected' : 'titleUnSelected']" @click="tspFlag = false;LPFlag=true">{{ $t('tsp.tspLPMine') }}</p> -->
        </div>
        
        <TSPMine v-show="tspFlag" ref="tsp"
        :totalDepositedSP = "totalDepositedSP"
        :totalDepositedSP2 = 'totalDepositedSP2'
        :rewardsPerBlock = 'rewardsPerBlock'
        :addr = 'addr'
        :nutBalanceOf = 'nutBalanceOf'
        :nutBalanceOf2 = 'nutBalanceOf2'>
        </TSPMine>

        <!-- <TSPLPMine v-show="LPFlag" ref="tsplp">
        </TSPLPMine> -->

        <transition name="fade">
          <SmallLoading v-if="isLoading"></SmallLoading>
        </transition>
    </div>
  </div>
</template>

<script>
import SmallLoading from './SmallLoading'
import TSPMine from './TSPMine.vue'
import TSPLPMine from './TSPLPMine.vue'
import {vestsToSteem} from '../utils/chain/steemOperations.js'
  
  export default {
    name: "TSP",
    data() {
      return {
        LPFlag:false,
        tspFlag:true,
        isLoading:true,
        nutBalanceOf:'',
        nutBalanceOf2:'',
        totalDepositedSP:'',
        totalDepositedSP2:'',
        rewardsPerBlock:0,
        addr:'',
      }
    },
    components: {
      TSPMine,
      TSPLPMine,
      SmallLoading
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
        console.log("ggg",g*1)
        console.log("235",23)
        this.totalDepositedSP2 = await vestsToSteem(this.dataFromSun(g))
        console.log(5234,this.totalDepositedSP2)
        this.totalDepositedSP = this.formatData(this.totalDepositedSP2)
        console.log(5234,this.totalDepositedSP,this.totalDepositedSP2)

        let t = await poolinstance.getRewardsPerBlock().call()
        this.rewardsPerBlock = this.formatData(this.dataFromSun(t))
      },
    },
    async mounted() {
      let that = this
      let instance = this.$store.state.tspInstance2
      let poolinstance = this.$store.state.tspPoolInstance2
      async function main(){
        // await that.sleep()
        if (window.tronWeb) {
          // console.log(22, "tronlink is ok! login")
          that.addr = window.tronWeb.defaultAddress.base58
        }else{
             that.tronlinkFlag = false
        }
        that.isLoading = false
        that.loadingFlag = true

        //如果有一个没有获取到则再获取一次
        if(!that.tronlinkFlag){
          that.isLoading = true
          await that.sleep(1)
          //tronlink
          if (window.tronWeb) {
            console.log(522, "tronlink is ok! login")
            that.addr = window.tronWeb.defaultAddress.base58
          }else{
            let link2 = 'TronLink: https://www.tronlink.org'
            alert(that.$t('message.needtronlink')+"\n\n"+link2)
          }
        }
        that.isLoading = false
        that.loadingFlag = true


        if(Object.keys(instance).length === 0 || Object.keys(poolinstance).length === 0){
          //如果刷新页面, instance未定义
          console.log(888, "instance为空，是刷新页面")
          try{
            // await that.getSteemInstance()
            // await that.getSbdInstance()
            await that.getNutsInstance()
            await that.getNutTronLink()
            await that.getNutsPool()
            await that.getNutPoolTronLink()

            await that.getTspInstance()
            await that.getTspTronLink()
            await that.getTspPoolInstance()
            await that.getTspPoolTronLink()

            await that.getOtherBalance()
            that.loadingFlag = true
          }catch(e){
            that.maskInfo = that.$t('message.tryrefreshpage')+"\n"+e
            that.showMask = true
            return
          }
        } else{
          console.log(22333, "啥也没干！")
          try{
            await that.getTspPoolTronLink()
            await that.getTspTronLink()
            await that.getNutTronLink()
            await that.getNutPoolTronLink()

            await that.getOtherBalance()
            that.loadingFlag = true
          }catch(e){
            that.maskInfo = that.$t('message.tryrefreshpage')+"\n"+e
            that.showMask = true
            return
          }
        }
        that.isLoading = false
      }
      await main()
      // 更新子组件
      await this.$refs.tsp.update()
      // this.$refs.tsplp.update()
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

