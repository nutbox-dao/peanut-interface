<template>
<div id="content">
    <h1>{{ $t('message.delegateList') }}</h1>
    <div class="text">
      <b-table striped hover :items="items" :fields="fields"></b-table>
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
        // items: [
        //   { isActive: true, id: 1, steemId: 'Dickerson', tron: 'Macdonald', delegatedSP: 20 },
        // ],
        showMask:false,
        maskInfo:"",
        vestsToSp: '',
        lists: []

      }
    },
    computed:{
      items() {
        return this.lists
      },
    },
    methods: {
      async getSteemStates(){
        let a = await this.steem.api.getDynamicGlobalPropertiesAsync()
        this.vestsToSp = parseFloat(a.total_vesting_fund_steem) / parseFloat(a.total_vesting_shares)
      },
      async getDelegateList(){
        let nutPool = this.$store.state.nutPoolInstance
        // let s = await nutPool.delegatorList(1).call()
        let s = await nutPool.getDelegatorListLength().call()
        console.log(256, "lists", this.tronWeb2.toBigNumber(s).toFixed(0))
        let length = parseInt(this.tronWeb2.toBigNumber(s))
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
      hideMask(){
        this.showMask=false
      },
    },
    mounted() {
      let that = this
      let instance = this.$store.state.steemInstance2
      async function main(){
        if(Object.keys(instance).length === 0){
          //如果刷新页面, instance未定义
          // console.log(888, "instance为空，是刷新页面")
          try{
            await that.getSteemInstance()
            await that.getSbdInstance()
            await that.getNutsInstance()
            await that.getNutsPool()
            await that.getSteemStates()

            await that.getNutTronLink()
            await  that.getNutPoolTronLink()
            await that.getDelegateList()

          }catch(e){
            that.maskInfo = that.$t('message.tryrefreshpage')+"\n"+e
            that.showMask = true
          }
        } else{
          // console.log(22333, "啥也没干！")
          try{
            await that.getSteemStates()
            await that.getDelegateList()
            await that.getNutTronLink()
            await  that.getNutPoolTronLink()
          }catch(e){
            that.maskInfo = that.$t('message.tryrefreshpage')+"\n"+e
            that.showMask = true
          }
        }

      }
      main()
    },


  }
</script>

<style scoped>
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

