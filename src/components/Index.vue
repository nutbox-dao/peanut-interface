<template>
  <div>
  <div class="wallet">
     <div>
       <!--代理挖矿-->
        <div class="delegate">
            <p class="titleSelected">{{ $t('message.delegatemine') }}</p>
            <div class="delegatetext round-box">
                < {{ $t('message.yourdata') }} > <br>
                {{ $t('message.steembalance') }}： {{ balanceOfSeem }}<br>
                {{ $t('message.spbalance') }}： {{ balanceOfSp }} SP<br>
                {{ $t('message.yourspdelegate') }}： {{ balanceOfDelegate }} SP<br>
                {{ $t('message.pnutbalance') }}： {{ nutBalanceOf }} PNUT<br>
            </div>

            <!--矿池数据-->
            <div class="delegatetext round-box">
                < {{ $t('message.miningpooldata') }} > <br>
                {{ $t('message.sptotaldelegate') }}： {{ totalDepositedSP }} SP<br>
                {{ $t('message.totalpnut') }}： {{ totalPendingPeanuts }} PNUT<br>
                {{ $t('message.rewardperblock') }}： {{ rewardsPerBlock }} PNUT<br>
                {{ $t('message.apy') }}： {{ apy }} %<br>
            </div>
            <hr>
            <!--<div >-->
            <div v-if="balanceOfDelegate2 <= 0">
                <div class="round-box">
                  <div class="round-box-title-container">
                    <p class="box-title">
                      {{ $t('message.input') }}
                    </p>
                    <!-- <p class="box-title">
                      {{ $t('message.spbalance') }}：{{ balanceOfSp }}
                    </p> -->
                  </div>
                  <div class="round-box-content-container">
                        <input
                        class="mb-2 mr-sm-2 mb-sm-0 user input"
                        :class="checkFlag ? 'isok': 'isfalse'"
                        placeholder="0.0" v-model="delegatevalue"
                        @keyup="checkDelegateValue" type="number" inputmode="decimal"
                        pattern="^[0-9]*[.,]?[0-9]*$" spellcheck="false" value>
                        <!-- <button id="maxBtn" @click="fillMaxDelegate">Max</button>-->
                  </div>
                </div>

              <div class="confirm-box" style="margin-bottom:10px">
                <button class="confirm-btn" @click="delegate" :disabled="!checkDelegateFlag">
                  {{ $t('message.confirmdelegate') }}
                </button>
              </div>

                <!--手续费-->
                <p style="width:100%;text-align:center;font-size:14px;color:gray;margin:0;padding-top:8px">
                    {{ $t('message.delegatecharge') }}： {{ fee }} STEEM
                </p>
            </div>

            <!--已代理：-->
            <div v-if="balanceOfDelegate2 > 0">
              <!-- 增加、减少、取消代理 -->
              <div class="confirm-box">
                <button class="confirm-btn" @click="delegateOpt=1,showDelegateMask=true" style="margin-right:30px" :disabled="!loadingFlag || !(fee<=parseFloat(balanceOfSeem))" >
                  {{ $t('message.adddelegate') }}
                </button>
                <button class="confirm-btn" @click="delegateOpt=2,showDelegateMask=true" style="margin-right:30px" :disabled="!loadingFlag || !(fee<=parseFloat(balanceOfSeem))">
                  {{ $t('message.minusdelegate') }}
                </button>
                <button class="confirm-btn" @click="delegateOpt=0,showDelegateMask=true" :disabled="!loadingFlag || !(fee<=parseFloat(balanceOfSeem))">
                  {{ $t('message.canceldelegate') }}
                </button>
              </div>

              <!-- PEANUTS代理收益 -->
              <div class="round-box">
                <div class="round-box-content-container">
                  <span>
                    {{ $t('message.pnutprofits') }}
                  </span>
                  <span style="color: darkred;">
                    <strong>{{ pendingPnut }} </strong>
                  </span>
                </div>
              </div>

              <!-- 提现按钮 -->
              <div class="confirm-box">
                <button class="confirm-btn" @click="withdrawPeanuts" :disabled="!loadingFlag">
                  {{ $t('message.withdraw') }}
                </button>
              </div>

                <!--手续费-->
                <p style="width:100%;text-align:center;font-size:14px;color:gray;margin:0;padding-top:8px">
                    {{ $t('message.delegatecharge') }}： {{ fee }} STEEM
                </p>

            </div>
        </div>
    </div>

    <!-- 增加或减少代理弹窗 -->
    <transition name="fade">
      <ChangeDelegateMask
          :changeDegate = 'delegateOpt'
          :balanceOfSP = 'balanceOfSp'
          :balanceOfDelegate = 'balanceOfDelegate'
          :balanceOfDelegate2 = 'balanceOfDelegate2'
          :spToVests = 'spToVests'
          :addr = 'addr'

          v-if="showDelegateMask"
          @hideMask="showDelegateMask=false"
      >
      </ChangeDelegateMask>
    </transition>

    <!--加载动画-->
    <transition name="fade">
      <SmallLoading v-if="isLoading"></SmallLoading>
    </transition>
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
  </div>
</template>

<script>
  import SmallLoading from './SmallLoading'
  import ChangeDelegateMask from './ChangeDelegateMask'
  import { isTransactionSuccess, isInsufficientEnerge, getTronLinkAddr, intToAmount} from '../utils/chain/tron'
  import {getContract} from '../utils/chain/contract'
  import axios from 'axios'
  export default {
    name: "Index",
    data() {
      return {
        balanceOfDelegate: '',
        balanceOfDelegate2: '',
        totalDepositedSP:'',
        totalDepositedSP2:'',
        rewardsPerBlock:'',
        totalPendingPeanuts:'',
        apy:'',

        isLoading: true,
        loadingFlag: false,

        balanceOfSeem: '',
        balanceOfSp: '',

        checkFlag: true,
        checkDelegateFlag: false,
        delegatevalue: '',
        spToVests: '',

        nutBalanceOf: '',
        nutBalanceOf2: '',

        showMask:false,
        maskInfo:"",
        showDelegateMask:false,
        delegateOpt: 1,

        pendingPnut:'',
        pendingPnut2:'',
        fee: process.env.VUE_APP_DELEGATE_FEE,

        vestsToSp: 0,
        addr:'',

      }
    },
    methods: {
      checkDelegateValue(){
        let reg = /^\d+(\.\d+)?$/
        let res = reg.test(this.delegatevalue)
        let res1 = false
        if(parseFloat(this.delegatevalue) >= 1){
          res1 = true
        }
        //代理量应小于SP量
        // let res2 = parseFloat(this.delegatevalue) <= parseFloat(this.balanceOfSp) - 5
        let res2 = true
        let res3 = this.fee <= parseFloat(this.balanceOfSeem)
        this.checkFlag = this.checkDelegateFlag = res && res1 && res2 && res3
        },
      async getOtherBalance(){  //nuts
        this.getBalanceOfPnut()
        this.getDelegatedSp()
        this.getTotalDepositedSp()
        this.getTotalPendingPnuts()
        this.getRewardsPerBlock()
      },
      async getBalanceOfPnut(){
        let instance = await getContract('PNUT')
        let a = await instance.balanceOf(this.addr).call()
        this.nutBalanceOf = this.formatData(intToAmount(a))  //nuts
        this.nutBalanceOf2 = intToAmount(a)
      },
      async getDelegatedSp(){
        let poolinstance = await getContract('PNUT_POOL')
        let f = await poolinstance.delegators(this.addr).call()  //balanceOfDelegate
        let p = intToAmount(f.amount) * this.vestsToSp
        this.balanceOfDelegate =  this.formatData(p)
        this.balanceOfDelegate2 = p
      },
      async getTotalDepositedSp(){
        let poolinstance = await getContract('PNUT_POOL')
        let g = await poolinstance.getTotalDepositedSP().call()
        let g2 = intToAmount(g) * this.vestsToSp
        this.totalDepositedSP = this.formatData(g2)
        this.totalDepositedSP2 = g2
      },
      async getTotalPendingPnuts(){
        let poolinstance = await getContract('PNUT_POOL')
        let i = await poolinstance.getTotalPendingPeanuts().call()
        let i2 = intToAmount(i)
        this.totalPendingPeanuts = this.formatData(i2)
      },
      async getRewardsPerBlock(){
        let poolinstance = await getContract('PNUT_POOL')
        let t = await poolinstance.getRewardsPerBlock().call()
        this.rewardsPerBlock = this.formatData(intToAmount(t))
      },
      async getSteemStates(){
        let username = this.$store.state.username
        let s = await this.steem.api.getAccountsAsync([username])
        this.balanceOfSeem = s[0].balance
        let a = await this.steem.api.getDynamicGlobalPropertiesAsync()
        this.spToVests = parseFloat(a.total_vesting_shares) / parseFloat(a.total_vesting_fund_steem)
        this.vestsToSp = parseFloat(a.total_vesting_fund_steem) / parseFloat(a.total_vesting_shares)
        let sp = parseFloat(s[0].vesting_shares) * this.vestsToSp
        let delegatedSp = parseFloat(s[0].delegated_vesting_shares) * this.vestsToSp
        this.balanceOfSp = (sp - delegatedSp).toFixed(3)
        },
      fillMaxDelegate(){
        this.delegatevalue = this.balanceOfSp - 5
        if (parseFloat(this.delegatevalue) >= 1){
          this.checkDelegateFlag = true
        }
      },
      async delegate(){
        try {
          this.isLoading = true
          this.checkDelegateFlag = false

          let nutPool = await getContract('PNUT_POOL')
          var res = await nutPool.delegators(this.addr).call()
          let steemAcc = res.steemAccount

          //steem代理
          let delegator = this.$store.state.username

          if (delegator && delegator.hasDeposited && steemAcc !== delegator){
            alert(this.$t('error.delegateerror') + "\n" + this.$t('error.accountChanged'))
            return
          }
          let delegatee = process.env.VUE_APP_STEEM_MINE

          let b = this.delegatevalue * this.spToVests
          let amount = b.toFixed(6)
          res = await this.steemDelegation(delegator, delegatee, amount, this.addr)

          if(res.success === true) {
            await this.sleep()
            //直接刷新当前页面
            this.$router.go(0)
          }else{
            this.delegatevalue = ''
            this.isLoading = false
            alert(this.$t('error.delegateerror') + "\n"+res.message)
          }
        }
        catch(e){
          this.isLoading = false
          alert(this.$t('error.error') + "\n" + e)
        }
      },
      async withdrawPeanuts(){
        try {
          this.isLoading = true
          this.loadingFlag = false
          let instance = await getContract('PNUT_POOL')
          let res = await instance.withdrawPeanuts().send({feeLimit:20_000_000})
          if (res && (await isTransactionSuccess(res))){
            await this.getOtherBalance()
            this.isLoading = false
            this.loadingFlag = true
          }else{
            if (await isInsufficientEnerge(res)){
              alert(this.$t('error.error') + "\n" + this.$t("error.insufficientEnerge"))
            }else{
              alert(this.$t('error.error')+"\n" + this.$t("error.withdrawFail"))
            }
          }
          
        }
        catch(e){
          this.isLoading = false
          alert(this.$t('error.error')+"\n" + e)
        }
      },
      hideMask(){
        this.showMask=false
      },

      async getPendingPnut(){
        let nutPool = await getContract('PNUT_POOL')
        let s = await nutPool.getPendingPeanuts().call()
        this.pendingPnut = intToAmount(s)
        // console.log(599, "pending pnut", this.pendingPnut)
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

    components: {
      SmallLoading,
      ChangeDelegateMask,
      },

    mounted() {
      if(!this.$store.state.username){
        this.$router.push({path: '/login'})
      }
      let that = this
      async function main(){
        try{
          await that.getSteemStates()
          that.addr = await getTronLinkAddr()
          await that.getOtherBalance()

          that.loadingFlag = true

        }catch(e){
          that.maskInfo = that.$t('error.tryrefreshpage')+"\n"+e
          that.showMask = true
          return
        }
        that.isLoading = false
        await that.calPnutApy()
      }
      main()

      //初始化年化收益率
      if(localStorage.getItem("apy") == null){
        this.apy = 52.786
      }else{
        this.apy = localStorage.getItem("apy")
      }

      //设置定时器以更新当前收益
      let timer = setInterval(this.getPendingPnut, 3000)
      // 通过$once来监听定时器，在beforeDestroy钩子时被清除。
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    },

    }
</script>

<style scoped>

  .wallet{
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

.round-box{
      border-radius: 20px;
      border: 1px solid rgb(247, 248, 250);
      padding:8px 14px;
      margin-bottom: 1rem;
}

.round-box-title-container{
     display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    color: rgb(0, 0, 0);
    font-size: 0.75rem;
    line-height: 1rem;;
    box-sizing: border-box;
    justify-content: space-between;
    -webkit-box-pack: justify;
    height: 100%;
}
.round-box-content-container{
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    color: rgb(0, 0, 0);
    font-size: 1rem;
    line-height: 1.2rem;;
    box-sizing: border-box;
    padding-top: 10px;
    padding-bottom: 10px;
    justify-content: space-between;
    -webkit-box-pack: justify;
    height: 100%;
}

.box-title{
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 500;
    font-size: 14px;
    color: rgb(86, 90, 105);
}

.input{
  color: rgb(0, 0, 0);
    width: 100%;
    position: relative;
    font-weight: 500;
    outline: none;
    border: none;
    flex: 1 1 auto;
    background-color: rgb(255, 255, 255);
    font-size: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px;
    /*appearance: textfield;*/
}
#maxBtn{
  height: 100%;
  margin-top: 16px;
    background-color: rgb(253, 234, 241);
    border: 1px solid rgb(253, 234, 241);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    margin-right: 0.5rem;
    color: rgb(255, 0, 122);
    user-select: none;
}

#maxBtn:focus{
  border: 1px solid rgb(255, 0, 122);
    outline: none;
}

#maxBtn:hover{
      border: 1px solid rgb(255, 0, 122);
}
.pink-arrow-box{
  margin-bottom:1rem;
  display:flex;
  align-items:center;
  align-content: center;
  width:100%;
  text-align: center;
}
.coin-icon{
  margin-top: 15px;
  width:24px;
  height:24px;
}

.pink-arrow{
  cursor: pointer;
}

  .delegatetext{
      line-height: 2rem;
  }


  .confirm-box{
    margin-top: 1em;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-around;
  }

  .confirm-btn{
     padding: 12px;
    /* width: 100%; */
    flex: 1;
    text-align: center;
    border-radius: 20px;
    outline: none;
    border: 1px solid transparent;
    text-decoration: none;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    flex-wrap: nowrap;
    -webkit-box-align: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    z-index: 1;
    background-color: rgb(253, 234, 241);
    color: rgb(255, 0, 122);
    font-size: 16px;
    font-weight: 500;
    user-select: none;
  }

.confirm-btn:hover{
  background-color: rgb(251, 220, 230);
}

.confirm-btn:disabled{
  color: rgb(136, 141, 155);
  cursor: auto;
  box-shadow: none;
  outline: none;
  opacity: 1;
  background-color: rgb(237, 238, 242);
}

  .mask{
    z-index: 2000;
    overflow: hidden;
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
}

 .mask-box{
    position: relative;
    max-width: 280px;
    width: 100%;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
    border-radius: 10px;
    padding: 1rem;
    display: block;
    z-index: 100;
    box-sizing: border-box;
    margin-top: -50vh;
 }

 .mask-info{
   display: flex;
   align-content: center;
 }

 .mask-info-text{
   text-align: center;
   width: 100%;
 }

  .delegate{
    /* width: 30rem; */
    margin-top: 1rem;
  }
  .loginbtn{
    margin-top: 0.5rem;
  }
  .isok{
      /*margin-top: 1.5rem;*/
      /*width: 50%;*/
      /*background-color: chartreuse;*/
  }
  .isfalse{
      /*margin-top: 1.5rem;*/
      /*width: 50%;*/
      background-color: crimson;
  }

</style>
