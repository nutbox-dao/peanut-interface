<template>
    <div class="wallet">
        <div>
            <div class="changebox">
                <h5>{{ $t('message.wallet') }}</h5>
            </div>

             <!-- steem -->
             <div class="round-box" v-if="$store.state.username">
                    <div class="round-box-title-container">
                        <p class="box-title">
                            <img class="coin-icon" src="../../static/images/steem.svg" alt="steem">
                        </p>
                        <p class="box-title">
                            {{ $store.state.username }}
                        </p>
                    </div>
                    <div class="round-box-title-container">
                        <p class="box-title">
                            {{ $t('message.steembalance') }}
                        </p>
                        <p class="box-title">
                            {{ balanceOfSeem }}
                        </p>
                    </div>
                 <div class="round-box-title-container">
                     <p class="box-title">
                         {{ $t('message.sbdbalance') }}
                     </p>
                     <p class="box-title">
                         {{ balanceOfSbd }}
                     </p>
                 </div>
                    <div class="round-box-title-container">
                        <p class="box-title">
                            {{ $t('message.spbalance') }}
                        </p>
                        <p class="box-title">
                            {{ balanceOfSp }}
                        </p>
                    </div>
                    <div class="round-box-title-container">
                        <p class="box-title">
                            {{ $t('message.delegatedsp') }}
                        </p>
                        <p class="box-title">
                            {{ balanceOfDelegate }}
                        </p>
                    </div>
                </div>

            <!-- tron -->
            <div class="round-box" v-if="$store.state.addr">
                <div class="round-box-title-container">
                    <p class="box-title">
                        <img class="coin-icon" src="../../static/images/nav-tron-icon.png" alt="tron">
                    </p>
                    <p class="box-title">
                        {{$store.state.addr | formatAddr}}
                    </p>
                </div>
                <div class="round-box-title-container">
                    <p class="box-title">
                        {{ $t('message.tronbalance') }}
                    </p>
                    <p class="box-title">
                        {{ balanceOfTron }}
                    </p>
                </div>
                <div class="round-box-title-container">
                    <p class="box-title">
                        {{ $t('message.tsteembalance') }}
                    </p>
                    <p class="box-title">
                        {{ balanceOf }}
                    </p>
                </div>
                <div class="round-box-title-container">
                    <p class="box-title">
                        {{ $t('message.tsbdbalance') }}
                    </p>
                    <p class="box-title">
                        {{ balanceOfTsbd }}
                    </p>
                </div>
                <div class="round-box-title-container">
                    <p class="box-title">
                        {{ $t('message.pnutbalance') }}
                    </p>
                    <p class="box-title">
                        {{ nutBalanceOf }}
                    </p>
                </div>

                <div class="round-box-title-container">
                    <p class="box-title">
                        {{ $t('tsp.balanceOfTsp') }}
                    </p>
                    <p class="box-title">
                        {{ balanceOfTsp }}
                    </p>
                </div>

            </div>

        </div>

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
</template>

<script>
    import SmallLoading from './SmallLoading'
    import {getContract} from '../utils/chain/contract.js'
    import {getTronLinkAddr, getTron, getAddress, intToAmount} from '../utils/chain/tron'
    export default {
        name: "Wallet",
        data() {
            return {
                balanceOf: '',
                balanceOf2: '',
                balanceOfDelegate: '',
                balanceOfDelegate2: '',
                balanceOfTron: '',
                isLoading: true,
                totalSupply: '',

                balanceOfSeem: '',
                balanceOfSbd: '',
                balanceOfSp: '',
                vestsToSp:'',

                balanceOfTsp:'',
                balanceOfTsp2:'',

                nutBalanceOf: '',
                nutBalanceOf2: '',
                nutTotalSupply: '',
                nutStartTime:'',
                miningRate: '',
                difficulty:'',
                nutSPR:'',
                showMask:false,

                balanceOfTsbd: '',  //tsbd
                balanceOfTsbd2: '',
            }
        },
        methods: {
            async getBalance(){ //tsteem
                let addr = await getTronLinkAddr()
                let instance = await getContract('STEEM')
                let c = await getTron().trx.getBalance(addr)
                this.balanceOfTron = this.formatData(intToAmount(c))
                let a = await instance.balanceOf(addr).call()
                this.balanceOf = this.formatData(intToAmount(a))  //tsteem
                this.balanceOf2 = intToAmount(a)
            },
            async getOtherBalance(){  //nuts
                let addr = await getTronLinkAddr()
                let instance = await getContract('PNUT')
                let poolinstance = await getContract('PNUT_POOL')
                let f = await poolinstance.delegators(addr).call()  //balanceOfDelegate
                let p = intToAmount(f.amount) * this.vestsToSp
                this.balanceOfDelegate =  this.formatData(p)
                this.balanceOfDelegate2 = intToAmount(f.amount)
                let a = await instance.balanceOf(addr).call()
                this.nutBalanceOf = this.formatData(intToAmount(a))  //nuts
                this.nutBalanceOf2 = intToAmount(a)
                // console.log(1232, "nutBalanceOf2", this.nutBalanceOf2)
            },
            async getTsbdBalance(){ //tsbd
                let addr = await getTronLinkAddr()
                let instance = await getContract('SBD')
                let a = await instance.balanceOf(addr).call()
                this.balanceOfTsbd = this.formatData(intToAmount(a))
                this.balanceOfTsbd2 = intToAmount(a)
                // console.log(1235, "balanceOfTsbd2", this.balanceOfTsbd2)
            },
            async getSteemStates(){
                let username = this.$store.state.username
                let s = await this.steem.api.getAccountsAsync([username])
                this.balanceOfSeem = s[0].balance
                this.balanceOfSbd = s[0].sbd_balance
                let a = await this.steem.api.getDynamicGlobalPropertiesAsync()
                let vestsToSp =   parseFloat(a.total_vesting_fund_steem) /parseFloat(a.total_vesting_shares)
                this.vestsToSp = vestsToSp
                let sp = parseFloat(s[0].vesting_shares) * vestsToSp
                let delegatedSp = parseFloat(s[0].delegated_vesting_shares) * vestsToSp
                this.balanceOfSp = (sp - delegatedSp).toFixed(3)
            },
             async getTspBalance(){// tsp
                let addr = await getTronLinkAddr()
                let instance = await getContract('TSP')
                let a = await instance.balanceOf(addr).call()
                this.balanceOfTsp = this.formatData(intToAmount(a))
                this.balanceOfTsp2 = intToAmount(a)
            },
            async owner() {
                let addr = this.anyaddr
                let instance = this.$store.state.steemInstance2
                let s = await instance.owner().call()
                let a = getAddress(s)
            },
        },
        filters: {
            formatAddr(data) {
                return data.substring(0, 6) + '...' + data.substring(30)
            },
        },

        components: {
            SmallLoading
        },

        mounted() {
            let that = this
            async  function main(){
                try {
                    if (that.$store.state.username){
                        await that.getSteemStates()
                    }
                    that.getBalance()
                    that.getTsbdBalance()
                    that.getOtherBalance()
                    that.getTspBalance()
                }catch (e){
                    alert(this.$t('error.error')+'\n' + e)
                }
                that.isLoading = false
            }
            main()
        },

    }
</script>

<style scoped>
    .wallet{
        width: 30rem;
        margin: 2.5rem auto;
        padding: 1.5rem 1rem 2rem 1rem;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
        border-radius: 30px;
        display: block;
        z-index: 1;
        box-sizing: border-box;
    }
    .changebox{
        display: flex;
        justify-content: space-evenly;
        padding: 1em;
    }

    .changebox p{
        font-weight: 400;
        color: darkgray;
        font-size: 1.2rem;
        cursor: pointer;
    }


    .changebox p:hover{
        color: rgb(92, 91, 91) !important;
    }



    .round-box{
        border-radius: 20px;
        border: 1px solid rgb(247, 248, 250);
        padding:8px 14px;
        margin: 0 auto;
        width: 80%;
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
        margin-bottom: 0.6rem;
    }

    .box-title{
        box-sizing: border-box;
        margin: 0px;
        min-width: 0px;
        font-weight: 500;
        font-size: 14px;
        color: rgb(86, 90, 105);
    }


    .coin-icon{
        margin-top: 15px;
        width:24px;
        height:24px;
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

</style>
