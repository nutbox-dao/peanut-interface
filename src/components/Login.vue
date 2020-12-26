<template>
  <div class="wallet">
    <div>
      <div class="changebox">
        <h5>{{ $t('message.userlogin') }}</h5>
      </div>

      <!-- steem -->
      <div class="round-box">
        <div class="round-box-title-container">
          <p class="box-title">
            <img class="coin-icon" src="../../static/images/keychain.png" alt="steem">
          </p>
          <p class="box-title">
            <b-input
                    class="mb-2 mr-sm-2 mb-sm-0 user"
                    :placeholder="$t('message.steemAccoutPlaceHolder')" v-model="username"
            ></b-input>
          </p>
        </div>
      </div>

      <!-- tron -->
      <div class="round-box">
        <div class="round-box-title-container">
          <p class="box-title">
            <img class="coin-icon" src="../../static/images/tronlink.jpg" alt="tron">
          </p>
          <p class="box-title">
            {{ addr }}
          </p>
        </div>
      </div>

      <div class="loginbtn">
        <b-button variant="outline-primary" @click="login" :disabled="!loadingFlag">{{ $t('message.login') }}</b-button>
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
  export default {
    name: "Login",
    data() {
      return {
        username:'',
        password:'',
        addr: '',
        isLoading: true,
        loadingFlag: false,
        keychainFlag: true,
        tronlinkFlag: true,
        showMask:false,
      }
    },
    methods:{
      login(){
        this.loadingFlag = false
        if(this.addr !== '' && this.username !== ''){
          let username = this.username
          let message = `nutboxs_login-${Math.floor(100000000 + Math.random() * 900000000)}`
          let key_type = 'Posting'
          steem_keychain.requestSignBuffer(username, message, key_type, response => {
            // console.log(136, response)
            if (response.success === true) {
              // If user is already logged in
              console.log(' Welcome.', username)
              this.$store.commit('saveUser', {username: username, password: null, active: null, addr: this.addr})
              this.loadingFlag = true
              this.$router.push({path:'/'})
            } else {
              //  Verification failed
              alert(this.$t('message.steemloginerr')+"\n"+response.message)
              this.loadingFlag = true
            }
          })
        }else{
          this.loadingFlag = true
          alert(this.$t('message.needkeychainandtronlink'))
        }
      },
    },
    components: {
      SmallLoading
    },

    mounted() {
      let that = this
      async function main(){
        await that.sleep()
        //keychain
        if(window.steem_keychain) {
          // Steem Keychain extension installed...
          // console.log(123, "steem-keychain", window.steem_keychain)
        } else {
          that.keychainFlag = false
        }
        //tronlink
        if (window.tronWeb) {
          // console.log(22, "tronlink is ok! login")
          that.addr = window.tronWeb.defaultAddress.base58
        }else{
             that.tronlinkFlag = false
        }
        that.isLoading = false
        that.loadingFlag = true

        //如果有一个没有获取到则再获取一次
        if(!that.keychainFlag || !that.tronlinkFlag){
          that.isLoading = true
          await that.sleep()
          //keychain
          if(window.steem_keychain) {
            // Steem Keychain extension installed...
          } else {
            // Steem Keychain extension not installed...
            let link = 'Chrome: https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm\n\n' +
                    'Firefox: https://addons.mozilla.org/en-US/firefox/addon/steem-keychain'
            alert(that.$t('message.needkeychain') +"\n\n"+link)
          }
          //tronlink
          if (window.tronWeb) {
            that.addr = window.tronWeb.defaultAddress.base58
          }else{
            let link2 = 'TronLink: https://www.tronlink.org'
            alert(that.$t('message.needtronlink')+"\n\n"+link2)
          }
        }
        that.isLoading = false
        that.loadingFlag = true
      }
      main()
    }

  }
</script>

<style scoped>
  .wallet{
    width: 50rem;
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
    width: 28rem;
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
    margin-bottom: 1rem;
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
    /*margin-top: 15px;*/
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

  .user{
    width:18rem;
  }
  .loginbtn{
    text-align: center;
    margin-top: 1rem;
  }

  .loginbtn:disabled{
    color: gray;
    cursor: auto;
    box-shadow: none;
    outline: none;
    opacity: 1;
    background-color: rgb(237, 238, 242);
  }

</style>

