<template>
<div id="content">
  <div class="checkbox">
    <p :class="[delegateSpFlag==0 ? 'titleSelected' : 'titleUnSelected']" @click="delegateSpFlag=0">{{ $t('message.delegatorList') }}</p>
    <p :class="[delegateSpFlag==1 ? 'titleSelected' : 'titleUnSelected']" @click="delegateSpFlag=1">{{ $t('message.tspDepositList') }}</p>
    <p :class="[delegateSpFlag==2 ? 'titleSelected' : 'titleUnSelected']" @click="delegateSpFlag=2">{{ $t('message.tspLPDepositList') }}</p>
  </div>
    
    <div class="text" v-show="delegateSpFlag==0">
      <b-table striped hover :items="items" :fields="fields"></b-table>
    </div>
    <div class="text" v-show="delegateSpFlag==1">
      <b-table striped hover :items="tspItems" :fields="tspFields"></b-table>
    </div>
    <div class="text" v-show="delegateSpFlag==2">
      <b-table striped hover :items="tspLPItems" :fields="tspLPFields"></b-table>
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
  import {getContractByDefaultAcc, getContract} from '../../utils/chain/contract'
  import {vestsToSteem} from '../../utils/chain/steemOperations'
  import {getAddress, intToAmount} from '../../utils/chain/tron'

  export default {
    name: "DelegatorLists",
    data() {
      return {
        fields: ['id', 'steemId', 'tron', 'delegatedSP'],
        tspFields: ['id', 'tron', 'depositedTsp'],
        tspLPFields: ['id', 'tron', 'depositedTspLP'],
        showMask:false,
        maskInfo:"",
        vestsToSp: '',
        lists: [],
        delegateSpFlag : 0,
        tspDepositList: [],
        tspLPDepositList:[]
      }
    },
    computed:{
      items() {
        return this.lists
      },
      tspItems(){
        // return [{isActive: true, id: 1,  tron: 'Macdonald', depositedTsp: 20}]
        return this.tspDepositList
      },
      tspLPItems(){
        return this.tspLPDepositList
      }
    },
    methods: {
      async getSteemStates(){
        let a = await this.steem.api.getDynamicGlobalPropertiesAsync()
        this.vestsToSp = parseFloat(a.total_vesting_fund_steem) / parseFloat(a.total_vesting_shares)
      },
      async getDelegateList(){
        let nutPool = await getContract('PNUT_POOL')
        let s = await nutPool.getDelegatorListLength().call()
        let length = s * 1

        for(let i = 0; i < length; i++){
          let p = await nutPool.delegatorList(i).call()
          let res = await nutPool.delegators(p).call()
          let amount = (intToAmount(res.amount) * this.vestsToSp).toFixed(3)
          let t = { isActive: true, id: i, steemId: res.steemAccount, tron: getAddress(p), delegatedSP: amount }
          this.lists.push(t)
        }
      },
      async getTspDepositList(){
        let tspPool = await getContract('TSP_POOL')
        let tspDelegatorLength = (await tspPool.getDelegatorListLength().call())*1
        for (let i = 0; i < tspDelegatorLength; i++){
          let addr = await tspPool.delegatorsList(i).call()
          let res = await tspPool.delegators(addr).call()
          let amount = (intToAmount(res.tspAmount) * 1.0).toFixed(3)
          let t = {isActive: true, id:i, tron: getAddress(addr), depositedTsp: amount}
          this.tspDepositList.push(t)
        }
      },
      async getTspLPDepositList(){
        let tspLPPool = await getContract('TSP_LP_POOL')
        let tspLPDelegatorLenth = (await tspLPPool.getDelegatorListLength().call())*1
        for (let i = 0;i < tspLPDelegatorLenth; i++){
          let addr = await tspLPPool.delegatorsList(i).call()
          let res = await tspLPPool.delegators(addr).call()
          let amount = (intToAmount(res.tspLPAmount) * 1.0).toFixed(3)
          let t = {isActive: true, id:i, tron: getAddress(addr), depositedTspLP: amount}
          this.tspLPDepositList.push(t)
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
          await that.getSteemStates()
          // await that.sleep()
          that.getDelegateList()
          that.getTspDepositList()
          that.getTspLPDepositList()
        }catch(e){
          that.maskInfo = that.$t('error.tryrefreshpage')+"\n"+e
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

