<template>
<div id="content">
  <div class="checkbox">
    <p :class="[delegateSpFlag ? 'titleSelected' : 'titleUnSelected']" @click="delegateSpFlag=true">{{ $t('message.delegatorList') }}</p>
    <p :class="[delegateSpFlag ? 'titleUnSelected' : 'titleSelected']" @click="delegateSpFlag=false">{{ $t('message.tspDepositList') }}</p>
  </div>
    
    <div class="text" v-show="delegateSpFlag">
      <b-table striped hover :items="items" :fields="fields"></b-table>
    </div>
    <div class="text" v-show="!delegateSpFlag">
      <b-table striped hover :items="tspItems" :fields="tspFields"></b-table>
    </div>

    <!-- 错误提示弹窗 -->
    <transition name="fade">
      <div class="mask" v-if="showMask" @click="hideMask">
        <div class="mask-box">
          <div class="mask-info">
            <div class="mask-info-text">
              {{ maskInfo }}
            </div>
          </div>
        </div>
      </div>
    </transition>


</div>
</template>

<script>

  export default {
    name: "DelegatorLists",
    data() {
      return {
        fields: ['id', 'steemId', 'tron', 'delegatedSP'],
        tspFields: ['id', 'tron', 'depositedTsp'],
        showMask:false,
        maskInfo:"",
        vestsToSp: '',
        lists: [],
        delegateSpFlag : true,
        tspDepositList: [],
      }
    },
    computed:{
      items() {
        return this.lists
      },
      tspItems(){
        // return [{isActive: true, id: 1,  tron: 'Macdonald', depositedTsp: 20}]
        return this.tspDepositList
      }
    },
    methods: {
      async getSteemStates(){
        let a = await this.steem.api.getDynamicGlobalPropertiesAsync()
        this.vestsToSp = parseFloat(a.total_vesting_fund_steem) / parseFloat(a.total_vesting_shares)
      },
      async getDelegateList(){
        let nutPool = this.$store.state.nutPoolInstance2
        // let s = await nutPool.delegatorList(1).call()
        let s = await nutPool.getDelegatorListLength().call()
        // console.log(256, "lists", this.tronWeb2.toBigNumber(s).toFixed(0))
        // let length = parseInt(this.tronWeb2.toBigNumber(s))
        let length = s * 1
        console.log(2567, "lists", length)

        for(let i = 0; i < length; i++){
          let p = await nutPool.delegatorList(i).call()
          let res = await nutPool.delegators(p).call()
          // console.log(i, this.tronWeb2.address.fromHex(p), res.steemAccount)
          let amount = (this.dataFromSun(res.amount) * this.vestsToSp).toFixed(3)
          let t = { isActive: true, id: i, steemId: res.steemAccount, tron: this.tronWeb2.address.fromHex(p), delegatedSP: amount }
          this.lists.push(t)
        }
      },
      async getTspDepositList(){
        let tspPool = this.$store.state.tspPoolInstance2
        let tspDelegatorLength = (await tspPool.getDelegatorListLength().call())*1
        console.log(4716,"tsp list ", tspDelegatorLength)
        for (let i = 0; i < tspDelegatorLength; i++){
          let addr = await tspPool.delegatorsList(i).call()
          console.log(876, addr);
          let res = await tspPool.delegators(addr).call()
          let amount = (this.dataFromSun(res.tspAmount) * 1.0).toFixed(3)
          console.log(8673,amount)
          let t = {isActive: true, id:i, tron: this.tronWeb2.address.fromHex(addr), depositedTsp: amount}
          console.log(235,t)
          this.tspDepositList.push(t)
        }
      },
      hideMask(){
        this.showMask=false
      },
    },
    mounted() {
      let that = this
      async function main(){
        try{
          await that.getNutsPool()
          await that.getTspPoolInstance()
          await that.getSteemStates()
          // await that.sleep()
          that.getDelegateList()
          that.getTspDepositList()
        }catch(e){
          that.maskInfo = that.$t('message.tryrefreshpage')+"\n"+e
          that.showMask = true
        }

      }
      main()
    },


  }
</script>

<style scoped>
.checkbox{
  display: flex;
  align-content: center;
  justify-content: space-evenly;
}
.titleSelected{
color: rgb(30, 30, 30) !important;
font-weight: 500 !important;
font-size: 1.5em;
}

.titleUnSelected{
color: darkgray !important;
font-weight: 400 !important;
font-size: 1.5em;
}
  h1{
    font-size: 2rem;
    text-align: center;
    padding-bottom: 1rem;
    /*border-bottom: 1px solid #ddd;*/
  }
  #content{
    color: rgba(55,53,58,0.75);
    align: center;
    margin: 1rem auto;
    width: 60%;
    padding-bottom: 0.2rem;
  }
  .text{
    line-height: 1.8rem;
  }

  a{
    color: rgba(55,53,58,0.75);
  }

  a:hover{
    color: darkcyan;
    text-decoration: none;
  }

  .btn-outline-primary {
    color: rgba(55,53,58,0.75);
    border-color: rgba(55,53,58,0.75);
  }
  .btn-outline-primary:hover{
    background-color: chocolate;
  }
</style>

