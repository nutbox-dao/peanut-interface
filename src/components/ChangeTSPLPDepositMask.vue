<template>
  <div class="mask" @click.stop="hideMask">

      <!--增加代理-->
      <div class="changeBox" @click.stop="stop" v-if="changeDegate === 1">
          <div class="title" style="width:100%;text-align:center;font-weight:500;font-size:20px">
              {{ $t('tsp.addTspDeposit') }}
          </div>
          <div class="round-box">
            <div class="operate-balance" style="text-align:right;margin-bottom:12px;color:gray;font-size:14px;color:rgb(86, 90, 105)">
                {{ $t('tsp.tspLPBalance') }}：{{ balanceOfTSPLP }}
            </div>
            <div class="input-container">
                <div class="round-box-content-container">
                    <input
                            class="mb-2 mr-sm-2 mb-sm-0 user input"
                            :class="checkAddFlag ? 'isok': 'isfalse'"
                            placeholder="0.0" v-model="addvalue"
                            @keyup="checkAddValue" type="number" inputmode="decimal"
                            pattern="^[0-9]*[.,]?[0-9]*$" spellcheck="false" value>
                    <button class="maxBtn" @click="fillMaxDelegate">Max</button>
                </div>
            </div>
          </div>
          <div class="confirm-box">
              <button class="confirm-btn" @click="approve" :disabled="!checkApproveFlag">
                  {{$t('tsp.approveNutbox')}}
                </button>
              <button class="confirm-btn" :disabled="!canAddFlag"  @click="addDeposit">
                  {{ $t('tsp.confirmAddTspDeposit') }}
              </button>
          </div>
          <div style="margin-top:8px;margin-left:4px">
              <!--加载动画-->
              <transition name="fade">
                  <SmallLoading v-if="isLoading"></SmallLoading>
              </transition>
          </div>
      </div>

      <!--减少代理-->
      <div class="changeBox" @click.stop="stop" v-else-if="changeDegate === 2">
          <div class="title" style="width:100%;text-align:center;font-weight:500;font-size:20px">
              {{ $t('tsp.minusTspDeposit') }}
          </div>
          <div class="round-box">
              <div class="operate-balance" style="text-align:right;margin-bottom:12px;color:gray;font-size:14px;color:rgb(86, 90, 105)">
                  {{ $t('tsp.yourTSPLPAmount') }}：{{ balanceOfDelegate }}
              </div>
              <div class="input-container">
                  <div class="round-box-content-container">
                      <input
                              class="mb-2 mr-sm-2 mb-sm-0 user input"
                              :class="checkSubFlag ? 'isok': 'isfalse'"
                              placeholder="0.0" v-model="subvalue"
                              @keyup="checkSubValue" type="number" inputmode="decimal"
                              pattern="^[0-9]*[.,]?[0-9]*$" spellcheck="false" value>
                      <button class="maxBtn" @click="fillMaxSub">Max</button>
                  </div>
              </div>
          </div>
          <div class="confirm-box">
              <button class="confirm-btn" :disabled="!canSubFlag"  @click="subDeposit">
                  {{ $t('tsp.confirmMinusTspDeposit') }}
              </button>
          </div>
          <div style="margin-top:8px;margin-left:4px">
              <!--加载动画-->
              <transition name="fade">
                  <SmallLoading v-if="isLoading"></SmallLoading>
              </transition>
          </div>

      </div>

      <!--取消代理-->
      <div class="changeBox" @click.stop="stop" v-else>
          <div class="confirm-box">
              <button class="confirm-btn" :disabled="!canDelFlag"  @click="delDeposit">
                  {{ $t('tsp.confirmCancelTspDeposit') }}
              </button>
          </div>
          <div style="margin-top:8px;margin-left:4px">
              <!--加载动画-->
              <transition name="fade">
                  <SmallLoading v-if="isLoading"></SmallLoading>
              </transition>
          </div>
      </div>
  </div>
</template>

<script>
import SmallLoading from './SmallLoading'
import {steemToVest, vestsToSteem} from '../utils/chain/steemOperations.js'
import {getAbiAndContractAddress, getContract} from '../utils/chain/contract.js'

import {
        isTransactionSuccess,
        isInsufficientEnerge,
        getBalanceOfToken,
        getSupplyOfToken,
        amountToInt,
        intToAmount,
        getTronLink} from '../utils/chain/tron.js'

import {TSP_LP_TOKEN_ADDRESS, TSP_TRX_CONTRACT_ADDRESS} from '../const.js'
export default {
    name: "ChangeTSPLPDepositMask",
    props: ['changeDegate',
            'balanceOfTSPLP',
            'balanceOfTSPLP2',
            'balanceOfDelegate',
            'balanceOfDelegate2',
            'spToVests',
            'addr'
    ],
    data(){
        return {
            addvalue: '',
            checkAddFlag: true,
            canAddFlag: false,
            checkApproveFlag: false,
            subvalue:'',
            checkSubFlag: true,
            canSubFlag: false,
            canDelFlag: true,

            showMask: true,
            isLoading: false,

            opValue:null,
            opValueIsOK:false,
        }
    },
    methods:{
        checkAddValue(){
            let reg = /^\d+(\.\d+)?$/
            let res = reg.test(this.addvalue)
            let res1 = false
            if(parseFloat(this.addvalue) >= 1){
                res1 = true
            }
            //增加量应小于TSPLP量
            let res2 = parseFloat(this.addvalue) <= parseFloat(this.balanceOfTSPLP2)
            this.checkApproveFlag = this.checkAddFlag = res && res1 && res2
            this.canAddFlag = false
        },
        checkSubValue(){
            let reg = /^\d+(\.\d+)?$/
            let res = reg.test(this.subvalue)
            let res1 = false
            if(parseFloat(this.subvalue) >= 0.01){
                res1 = true
            }
            //减少应小于代理SP量
            let res2 = parseFloat(this.subvalue) <= parseFloat(this.balanceOfDelegate2)
            this.canSubFlag = this.checkSubFlag = res && res1 && res2
        },

        fillMaxDelegate(){
            this.addvalue = parseFloat(this.balanceOfTSPLP2)
            this.checkAddValue()
        },
        fillMaxSub(){
            this.subvalue = parseFloat(this.balanceOfDelegate2)
            this.checkSubValue()
        },
        async approve(){
            try{
                this.isLoading = true
                this.checkApproveFlag = false
                let addr = this.addr
                let a = parseFloat(this.addvalue)
                let value = this.dataToSun(a)

                let tspLPPoolAddr = (await getAbiAndContractAddress('TSP_LP_POOL')).address
                let tronLink = await getTronLink()
                let params = [{type:"address",value:tspLPPoolAddr},{type:"uint256",value:value}]
                // 创建交易
                let approve = await tronLink.transactionBuilder
                                .triggerSmartContract(TSP_LP_TOKEN_ADDRESS, 
                                                    "approve(address,uint256)", 
                                                    {feeLimit:20_000_000}, 
                                                    params, addr)
                if (!approve || approve["result"]["result"] !== true){
                    this.checkAddValue()
                    alert(this.$t('error.error')+"\n" + this.$t("error.approveFail"))
                    return
                }
                // 签名交易
                let signedTx = await tronLink.trx.sign(approve['transaction'])
                // 广播交易
                let broastTx = await tronLink.trx.sendRawTransaction(signedTx)
                if (broastTx && broastTx['txid'] && (await isTransactionSuccess(broastTx['txid']))){
                    this.checkApproveFlag = false
                    this.canAddFlag = true
                }else{
                    if (await isInsufficientEnerge(broastTx['txid'])){
                        alert(this.$t('error.error') + "\n" + this.$t("error.insufficientEnerge"))
                    }else{
                        alert(this.$t('error.error')+"\n" + this.$t("error.approveFail"))
                    }
                    this.checkAddValue()
                }
            }catch (e){
                this.checkAddValue()
                alert(this.$t('error.error') + "\n" + e)
            }
            finally{
                this.isLoading = false
            }
        },
        async addDeposit(){
            try {
                this.isLoading = true
                this.checkApproveFlag = false
                this.canAddFlag = false
                let addr = this.addr
                //开始挖矿
                let tspLPPool = await getContract('TSP_LP_POOL')
                let b = parseFloat(this.addvalue)
                let value = this.dataToSun(b)
                // commit deposit
                let res = await tspLPPool.deposit(value).send({feeLimit:20_000_000})
                if (res && (await isTransactionSuccess(res))){
                    // 直接更新数字
                    this.$parent.minedTspLP2 = parseFloat(this.$parent.minedTspLP) + b
                    this.$parent.minedTspLP = parseFloat(this.$parent.minedTspLP2).toFixed(3)
                    this.$parent.balanceOfTSPLP2 = parseFloat(this.$parent.balanceOfTSPLP2) - b
                    this.$parent.balanceOfTSPLP = parseFloat(this.$parent.balanceOfTSPLP2).toFixed(3)
                    this.hideMask()
                }else{
                    if (res && await isInsufficientEnerge(res)){
                        alert(this.$t('error.error') + "\n" + this.$t("error.insufficientEnerge"))
                    }else{
                        alert(this.$t('error.error')+"\n" + this.$t("error.changeDepsitFail"))
                    }
                    this.checkAddValue()
                }
            }
            catch(e){
                this.checkAddValue()
                alert(this.$t('error.error') + "\n" + e)
            }finally{
                this.isLoading = false  
            }
        },
        async subDeposit(){
            try {
                this.isLoading = true
                this.canSubFlag = false
                let addr = this.addr
                let a = parseFloat(this.subvalue)
                let value = this.dataToSun(a)

                let tspLPPool = await getContract('TSP_LP_POOL')
                let res = await tspLPPool.withdraw(value).send({feeLimit:20_000_000})
                if (res && (await isTransactionSuccess(res))){
                    // 直接更新数字
                    this.$parent.minedTspLP2 = parseFloat(this.$parent.minedTspLP) - a
                    this.$parent.minedTspLP = parseFloat(this.$parent.minedTspLP2).toFixed(3)
                    this.$parent.balanceOfTSPLP2 = parseFloat(this.$parent.balanceOfTSPLP2) + a
                    this.$parent.balanceOfTSPLP = parseFloat(this.$parent.balanceOfTSPLP2).toFixed(3)
                   await this.$parent.$parent.getOtherBalance()
                   this.hideMask()
                }else{
                    if (res && await isInsufficientEnerge(res)){
                        alert(this.$t('error.error') + "\n" + this.$t("error.insufficientEnerge"))
                    }else{
                        alert(this.$t('error.error')+"\n" + this.$t("error.changeDepsitFail"))
                    }
                    this.checkSubValue()
                }
            }
            catch(e){
                alert("错误\n" + e)
                this.checkSubValue()
            }finally{
                this.isLoading = false
            }
        },
        async delDeposit(){
            try {
                this.isLoading = true
                this.canDelFlag = false
                let addr = this.addr
                let a = parseFloat(this.balanceOfDelegate2)
                let value = this.dataToSun(a)

                let tspPool = await getContract('TSP_LP_POOL')
                let delDepositTx = await tspPool.withdraw(value).send({feeLimit:20_000_000})
                if(delDepositTx && (await isTransactionSuccess(delDepositTx))){
                    // 直接更新数字
                    this.$parent.minedTspLP2 = parseFloat(this.$parent.minedTspLP) - a
                    this.$parent.minedTspLP = parseFloat(this.$parent.minedTspLP2).toFixed(3)
                    this.$parent.balanceOfTSPLP2 = parseFloat(this.$parent.balanceOfTSPLP2) + a
                    this.$parent.balanceOfTSPLP = parseFloat(this.$parent.balanceOfTSPLP2).toFixed(3)
                    this.$parent.$parent.getOtherBalance()
                    this.hideMask()
                }else{
                    if (await isInsufficientEnerge(delDepositTx)){
                            alert(this.$t('error.error') + "\n" + this.$t("error.insufficientEnerge"))
                        }else{
                            alert(this.$t('error.error')+"\n" + this.$t("error.changeDepsitFail"))
                        }
                }
            }
            catch(e){
                alert(this.$t('error.error')+"\n" + e)
            }finally{
                this.isLoading = false
                this.canDelFlag = true
            }
        },

        hideMask(){
            this.$emit('hideMask')
        },
        stop(){
            // donothing
        },
    },
    components: {
        SmallLoading
    },
    mounted() {

    }
}
</script>

<style scoped>
  .mask {
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    display: flex;
    align-content: center;
    align-items: center;
  }
  .mask .changeBox{
      width: 40%;
      min-width: 400px;
      max-width: 520px;
      /* height: 30%; */
      background-color: white;
      /*margin-top: 10vh;*/
      margin-top: 2rem;
      border-radius: 20px;
      border: 1px solid rgb(247, 248, 250);
      padding:8px 14px;
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
      padding-top: 14px;
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
      appearance: textfield;
  }
  .maxBtn{
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

  .maxBtn:focus{
      border: 1px solid rgb(255, 0, 122);
      outline: none;
  }

  .maxBtn:hover{
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
      margin-right: 10px;
  }

  .confirm-btn:last-child{
      margin-right: 0px;
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
